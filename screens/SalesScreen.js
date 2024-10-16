import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SalesScreenStyles from "./SalesScreenStyles"; // Importa os estilos de um arquivo separado
import { useAuth } from "../AuthContext";

const SalesScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { funcionarioId } = useAuth();
  const [sortConfig, setSortConfig] = useState({
    key: "nome",
    direction: "asc",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartModalVisible, setCartModalVisible] = useState(false); // Modal do carrinho
  const ws = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Vendas",
      headerTitleAlign: "center",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setCartModalVisible(true)} // Abre o modal do carrinho
          style={{ paddingRight: 20 }}
        >
          <Ionicons name="cart-outline" size={24} color="black" />
          {cartItems.length > 0 && (
            <View style={SalesScreenStyles.cartBadgeContainer}>
              <Text style={SalesScreenStyles.cartBadge}>
                {getTotalCartQuantity()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ),
    });

    fetchProducts();
    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [navigation, cartItems]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/products");
      const data = await response.json();
      const sortedData = data.sort((a, b) => a.nome.localeCompare(b.nome));
      setProducts(sortedData);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    ws.current = new WebSocket("ws://localhost:3000");

    ws.current.onopen = () => {
      console.log("Conectado ao WebSocket");
    };

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.type === "UPDATE_STOCK") {
        fetchProducts();
      }
    };

    ws.current.onclose = () => {
      console.log("Conexão ao WebSocket fechada. Tentando reconectar...");
      setTimeout(connectWebSocket, 5000);
    };

    ws.current.onerror = (e) => {
      console.error("Erro no WebSocket:", e.message);
    };
  };

  const sortProducts = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    const sortedProducts = [...products].sort((a, b) => {
      if (direction === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });

    setProducts(sortedProducts);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <Ionicons name="arrow-down" size={16} color="black" />;
    }
    return sortConfig.direction === "asc" ? (
      <Ionicons name="arrow-up" size={16} color="tomato" />
    ) : (
      <Ionicons name="arrow-down" size={16} color="tomato" />
    );
  };

  const handleProductPress = (item) => {
    const cartItem = cartItems.find((cartItem) => cartItem.id === item.id);
    setSelectedProduct(item);
    setQuantity(cartItem ? cartItem.quantity : 1); // Se já estiver no carrinho, mostra a quantidade no carrinho
    setModalVisible(true);
  };

  const increaseQuantity = () => {
    if (quantity < selectedProduct.quantidade) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleUpdateCart = () => {
    if (quantity === 0) {
      // Remove o item do carrinho se a quantidade for zero
      setCartItems(cartItems.filter((item) => item.id !== selectedProduct.id));
    } else {
      const updatedCart = cartItems.filter(
        (item) => item.id !== selectedProduct.id
      );
      updatedCart.push({ ...selectedProduct, quantity });
      setCartItems(updatedCart);
    }

    // Fechar o modal após atualizar
    setModalVisible(false); // Aqui é onde garantimos que o modal fecha após a atualização
    setSelectedProduct(null); // Resetamos o produto selecionado para limpar o estado
  };

  const getTotalCartQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalCartValue = () => {
    return cartItems.reduce(
      (total, item) => total + item.quantity * item.valor_venda,
      0
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Função para finalizar a compra e enviar os dados para o backend
  const finalizarCompra = async () => {
    if (!funcionarioId) {
      Alert.alert("Erro", "Funcionário não autenticado.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/finalizarVenda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cartItems, funcionarioId }),
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Compra finalizada com sucesso.");
        clearCart(); // Limpa o carrinho após a compra
        setCartModalVisible(false); // Fecha o modal do carrinho
      } else {
        Alert.alert("Erro", "Erro ao finalizar a compra.");
      }
    } catch (error) {
      console.error("Erro ao finalizar a compra:", error);
      Alert.alert("Erro", "Erro ao finalizar a compra.");
    }
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={[
        SalesScreenStyles.productItem,
        item.quantidade === 0 && SalesScreenStyles.outOfStockItem,
      ]}
      onPress={() => handleProductPress(item)}
      disabled={item.quantidade === 0} // Desabilita o toque se o produto estiver esgotado
    >
      <View style={SalesScreenStyles.column}>
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.imagem}` }}
          style={SalesScreenStyles.productImage}
        />
      </View>
      <View style={SalesScreenStyles.column}>
        <Text style={SalesScreenStyles.productText}>{item.nome}</Text>
      </View>
      <View style={SalesScreenStyles.column}>
        <Text style={SalesScreenStyles.productText}>{item.descricao}</Text>
      </View>
      <View style={SalesScreenStyles.column}>
        <Text style={SalesScreenStyles.productText}>
          R$ {parseFloat(item.valor_venda).toFixed(2)}
        </Text>
      </View>
      {item.quantidade === 0 && (
        <View style={SalesScreenStyles.outOfStockBadge}>
          <Text style={SalesScreenStyles.outOfStockText}>Produto Esgotado</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={SalesScreenStyles.container}>
      {/* Cabeçalho fixo com colunas */}
      <View style={SalesScreenStyles.header}>
        <View style={SalesScreenStyles.column}>
          <Text style={SalesScreenStyles.headerText}>Foto</Text>
        </View>
        <TouchableOpacity
          style={SalesScreenStyles.column}
          onPress={() => sortProducts("nome")}
        >
          <Text style={SalesScreenStyles.headerText}>
            Nome {renderSortIcon("nome")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={SalesScreenStyles.column}
          onPress={() => sortProducts("descricao")}
        >
          <Text style={SalesScreenStyles.headerText}>
            Volume {renderSortIcon("descricao")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={SalesScreenStyles.column}
          onPress={() => sortProducts("valor_venda")}
        >
          <Text style={SalesScreenStyles.headerText}>
            Preço {renderSortIcon("valor_venda")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Container da lista de produtos */}
      <View style={SalesScreenStyles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProductItem}
            ListEmptyComponent={<Text>Nenhum produto em estoque.</Text>}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Modal para exibir as informações do produto */}
      {selectedProduct && (
        <Modal
          visible={selectedProduct !== null}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedProduct(null)}
        >
          <View style={SalesScreenStyles.modalContainer}>
            <View style={SalesScreenStyles.modalContent}>
              {/* Botão de fechar (X) */}
              <TouchableOpacity
                onPress={() => setSelectedProduct(null)}
                style={SalesScreenStyles.closeButton}
              >
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>

              {/* Nome do produto no topo e em negrito */}
              <Text style={SalesScreenStyles.modalProductName}>
                {selectedProduct.nome}
              </Text>

              {/* Layout semelhante ao modal do carrinho */}
              <View style={SalesScreenStyles.cartItemContainer}>
                {/* Primeira linha: nome do produto em negrito */}
                <Text style={SalesScreenStyles.cartItemName}>
                  {selectedProduct.nome}
                </Text>

                {/* Segunda linha: 3 colunas */}
                <View style={SalesScreenStyles.cartItemDetailsRow}>
                  {/* Primeira coluna: imagem, alinhada à esquerda */}
                  <Image
                    source={{
                      uri: `data:image/jpeg;base64,${selectedProduct.imagem}`,
                    }}
                    style={SalesScreenStyles.cartItemImage}
                  />

                  {/* Segunda coluna: Volume, centralizado */}
                  <Text style={SalesScreenStyles.cartItemVolume}>
                    Volume: {selectedProduct.descricao}
                  </Text>

                  {/* Terceira coluna: controles de quantidade, alinhados à direita */}
                  <View style={SalesScreenStyles.cartItemQuantityControl}>
                    <TouchableOpacity
                      onPress={decreaseQuantity}
                      style={[
                        SalesScreenStyles.quantityButton,
                        SalesScreenStyles.decreaseButton,
                      ]}
                    >
                      <Ionicons name="remove" size={16} color="white" />
                    </TouchableOpacity>
                    <Text style={SalesScreenStyles.quantityText}>
                      {quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={increaseQuantity}
                      style={[
                        SalesScreenStyles.quantityButton,
                        SalesScreenStyles.increaseButton,
                      ]}
                    >
                      <Ionicons name="add" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Terceira linha: total do produto alinhado à direita */}
                <Text style={SalesScreenStyles.cartItemTotal}>
                  Total: R${" "}
                  {(quantity * selectedProduct.valor_venda).toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleUpdateCart}
                style={SalesScreenStyles.updateButton}
              >
                <Text style={SalesScreenStyles.updateButtonText}>
                  Atualizar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal do carrinho de compras */}
      <Modal
        visible={cartModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCartModalVisible(false)}
      >
        <View style={SalesScreenStyles.modalContainer}>
          <View style={SalesScreenStyles.modalContent}>
            {/* Botão de fechar (X) */}
            <TouchableOpacity
              onPress={() => setCartModalVisible(false)}
              style={SalesScreenStyles.closeButton}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text style={SalesScreenStyles.modalTitle}>
              Carrinho de Compras
            </Text>

            {/* ScrollView para rolar o conteúdo sem mostrar a barra de rolagem */}
            <ScrollView
              style={{ width: "100%" }}
              showsVerticalScrollIndicator={false} // Oculta a barra de rolagem
            >
              <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={SalesScreenStyles.cartItemContainer}>
                    {/* Primeira linha: nome do produto em negrito */}
                    <Text style={SalesScreenStyles.cartItemName}>
                      {item.nome}
                    </Text>

                    {/* Segunda linha: 3 colunas */}
                    <View style={SalesScreenStyles.cartItemDetailsRow}>
                      {/* Primeira coluna: imagem, alinhada à esquerda */}
                      <Image
                        source={{
                          uri: `data:image/jpeg;base64,${item.imagem}`,
                        }}
                        style={SalesScreenStyles.cartItemImage}
                      />

                      {/* Segunda coluna: Volume, centralizado */}
                      <Text style={SalesScreenStyles.cartItemVolume}>
                        Frasco: {item.descricao}
                      </Text>

                      {/* Terceira coluna: controles de quantidade, alinhados à direita */}
                      <View style={SalesScreenStyles.cartItemQuantityControl}>
                        <TouchableOpacity
                          onPress={() => {
                            if (item.quantity > 1) {
                              const updatedCart = cartItems.map((cartItem) =>
                                cartItem.id === item.id
                                  ? {
                                      ...cartItem,
                                      quantity: cartItem.quantity - 1,
                                    }
                                  : cartItem
                              );
                              setCartItems(updatedCart);
                            } else {
                              setCartItems(
                                cartItems.filter(
                                  (cartItem) => cartItem.id !== item.id
                                )
                              );
                            }
                          }}
                          style={[
                            SalesScreenStyles.quantityButton,
                            SalesScreenStyles.decreaseButton,
                          ]}
                        >
                          <Ionicons name="remove" size={16} color="white" />
                        </TouchableOpacity>
                        <Text style={SalesScreenStyles.quantityText}>
                          {item.quantity}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            if (item.quantity < item.quantidade) {
                              const updatedCart = cartItems.map((cartItem) =>
                                cartItem.id === item.id
                                  ? {
                                      ...cartItem,
                                      quantity: cartItem.quantity + 1,
                                    }
                                  : cartItem
                              );
                              setCartItems(updatedCart);
                            }
                          }}
                          style={[
                            SalesScreenStyles.quantityButton,
                            SalesScreenStyles.increaseButton,
                          ]}
                        >
                          <Ionicons name="add" size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Terceira linha: total do produto alinhado à direita */}
                    <Text style={SalesScreenStyles.cartItemTotal}>
                      Total: R$ {(item.quantity * item.valor_venda).toFixed(2)}
                    </Text>
                  </View>
                )}
              />
            </ScrollView>

            {/* Total geral */}
            <Text style={SalesScreenStyles.modalTotalText}>
              Total: R$ {getTotalCartValue().toFixed(2)}
            </Text>

            {/* Botões de esvaziar e finalizar */}
            <View style={SalesScreenStyles.cartButtonsContainer}>
              <TouchableOpacity
                onPress={clearCart}
                style={SalesScreenStyles.clearCartButton}
              >
                <Text style={SalesScreenStyles.clearCartButtonText}>
                  Esvaziar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={finalizarCompra}
                style={SalesScreenStyles.finalizeButton}
              >
                <Text style={SalesScreenStyles.finalizeButtonText}>
                  Finalizar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SalesScreen;
