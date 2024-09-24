import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const SalesScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [availableQuantities, setAvailableQuantities] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [cartModalVisible, setCartModalVisible] = useState(false);

  // Função para buscar produtos do backend
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/products");
      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }
      const data = await response.json();
      const availableProducts = data.filter(
        (product) => product.quantidade > 0
      );
      setProducts(availableProducts);

      // Salva a quantidade disponível de cada produto
      const initialQuantities = availableProducts.reduce((acc, product) => {
        acc[product.id] = product.quantidade;
        return acc;
      }, {});
      setAvailableQuantities(initialQuantities);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  // useEffect para carregar a lista de produtos ao montar o componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Configura o cabeçalho com o carrinho de compras
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setCartModalVisible(true)}
          style={styles.cartContainer}
        >
          <MaterialIcons name="shopping-cart" size={28} color="tomato" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, cartCount]);

  // Função para adicionar um produto à seleção
  const handleAddProduct = (product) => {
    setSelectedProducts((prevSelected) => {
      const currentCount = prevSelected[product.id] || 0;
      const availableCount = availableQuantities[product.id] || 0;

      // Verifica se a quantidade selecionada é menor que a disponível
      if (currentCount < availableCount) {
        return { ...prevSelected, [product.id]: currentCount + 1 };
      }
      return prevSelected;
    });
  };

  // Função para remover um produto da seleção
  const handleRemoveProduct = (product) => {
    setSelectedProducts((prevSelected) => {
      const currentCount = prevSelected[product.id] || 0;
      if (currentCount > 0) {
        return { ...prevSelected, [product.id]: currentCount - 1 };
      }
      return prevSelected;
    });
  };

  // Função para adicionar produto ao carrinho
  const handleAddToCart = (product) => {
    const count = selectedProducts[product.id] || 0;

    if (count > 0) {
      // Atualiza a quantidade disponível após adicionar ao carrinho
      setAvailableQuantities((prevQuantities) => ({
        ...prevQuantities,
        [product.id]: prevQuantities[product.id] - count,
      }));

      setCartCount((prevCount) => prevCount + count);
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id);
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === product.id
              ? { ...item, count: item.count + count }
              : item
          );
        } else {
          return [...prevItems, { ...product, count }];
        }
      });

      setSelectedProducts((prevSelected) => ({
        ...prevSelected,
        [product.id]: 0,
      }));
    }
  };

  // Função para ajustar a quantidade de itens no carrinho
  const adjustCartItem = (item, type) => {
    setCartItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem.id === item.id
          ? {
              ...cartItem,
              count:
                type === "increase" ? cartItem.count + 1 : cartItem.count - 1,
            }
          : cartItem
      )
    );
    if (type === "increase") {
      setCartCount(cartCount + 1);
      setAvailableQuantities((prevQuantities) => ({
        ...prevQuantities,
        [item.id]: prevQuantities[item.id] - 1,
      }));
    } else {
      setCartCount(cartCount - 1);
      setAvailableQuantities((prevQuantities) => ({
        ...prevQuantities,
        [item.id]: prevQuantities[item.id] + 1,
      }));
    }
  };

  // Função para remover o item do carrinho
  const removeCartItem = (item) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
    setCartCount(cartCount - item.count);
    setAvailableQuantities((prevQuantities) => ({
      ...prevQuantities,
      [item.id]: prevQuantities[item.id] + item.count,
    }));
  };

  // Função para finalizar a compra e atualizar o banco de dados
  const handleFinalizePurchase = async () => {
    try {
      const response = await fetch("http://localhost:3000/updateStock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cartItems }),
      });

      if (!response.ok) {
        throw new Error("Erro ao finalizar a compra");
      }

      setCartItems([]);
      setCartCount(0);
      setCartModalVisible(false);
      fetchProducts();
    } catch (error) {
      console.error("Erro ao finalizar a compra:", error);
      alert("Erro ao finalizar a compra.");
    }
  };

  // Função para calcular o total do carrinho
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.valor_venda * item.count,
      0
    );
  };

  // Renderiza cada produto na lista com botões de + e -
  const renderProduct = ({ item }) => {
    const selectedCount = selectedProducts[item.id] || 0;
    const availableCount = availableQuantities[item.id] || 0;

    return (
      <View style={styles.productContainer}>
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.imagem}` }}
          style={styles.productImage}
        />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.nome}</Text>
          <Text style={styles.productDescription}>{item.descricao}</Text>
          <Text style={styles.productValue}>
            R$ {item.valor_venda.toFixed(2)}
          </Text>
          <Text style={styles.productQuantity}>
            Disponível: {availableCount}
          </Text>
        </View>
        <View style={styles.counterContainer}>
          {selectedCount > 0 && (
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => handleRemoveProduct(item)}
            >
              <Ionicons name="remove-circle-outline" size={24} color="tomato" />
            </TouchableOpacity>
          )}
          {selectedCount > 0 && (
            <Text style={styles.counterText}>{selectedCount}</Text>
          )}
          {selectedCount < availableCount && (
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => handleAddProduct(item)}
            >
              <Ionicons name="add-circle-outline" size={24} color="tomato" />
            </TouchableOpacity>
          )}
          {selectedCount > 0 && (
            <TouchableOpacity
              style={styles.checkButton}
              onPress={() => handleAddToCart(item)}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color="#4BB543"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Renderiza os itens do carrinho no modal
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.cartItemText}>{item.nome}</Text>
      <Text style={styles.cartItemText}>
        R$ {(item.valor_venda * item.count).toFixed(2)}
      </Text>
      <View style={styles.cartControls}>
        <TouchableOpacity
          onPress={() => adjustCartItem(item, "decrease")}
          disabled={item.count === 1}
        >
          <Ionicons name="remove-circle" size={24} color="tomato" />
        </TouchableOpacity>
        <Text style={styles.cartItemCount}>{item.count}</Text>
        <TouchableOpacity
          onPress={() => adjustCartItem(item, "increase")}
          disabled={item.count >= availableQuantities[item.id]}
        >
          <Ionicons name="add-circle" size={24} color="tomato" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeCartItem(item)}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text>Nenhum produto disponível para venda.</Text>}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal do Carrinho */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={cartModalVisible}
        onRequestClose={() => setCartModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Carrinho</Text>
              <TouchableOpacity
                onPress={() => setCartModalVisible(false)}
                style={styles.closeIcon}
              >
                <Ionicons name="close" size={24} color="tomato" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={cartItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCartItem}
            />
            <Text style={styles.totalText}>
              Total: R$ {calculateTotal().toFixed(2)}
            </Text>
            <TouchableOpacity
              style={styles.finalizeButton}
              onPress={handleFinalizePurchase}
            >
              <Text style={styles.finalizeButtonText}>Finalizar Compra</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.discardButton}
              onPress={() => {
                setCartItems([]);
                setCartCount(0);
                setCartModalVisible(false);
                fetchProducts();
              }}
            >
              <Text style={styles.discardButtonText}>Descartar Carrinho</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  cartContainer: {
    position: "relative",
    paddingRight: 20,
  },
  cartBadge: {
    position: "absolute",
    top: -10,
    right: 18,
    backgroundColor: "red",
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 10,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productDescription: {
    fontSize: 14,
    color: "#555",
  },
  productValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  productQuantity: {
    fontSize: 14,
    color: "#888",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterButton: {
    marginHorizontal: 5,
  },
  counterText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 5,
  },
  checkButton: {
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeIcon: {
    padding: 5,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cartItemText: {
    fontSize: 16,
  },
  cartControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartItemCount: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  finalizeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#4BB543",
    borderRadius: 5,
    alignItems: "center",
  },
  finalizeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  discardButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "tomato",
    borderRadius: 5,
    alignItems: "center",
  },
  discardButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SalesScreen;
