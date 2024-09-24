import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const InventoryScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortField, setSortField] = useState("nome"); // Campo de ordenação inicial
  const [sortDirection, setSortDirection] = useState("asc"); // Direção da ordenação inicial

  // Função para buscar produtos do backend
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/products");
      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }
      const data = await response.json();
      // Ordena os produtos por nome de forma crescente como padrão
      const sortedData = data.sort((a, b) => a.nome.localeCompare(b.nome));
      setProducts(sortedData);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  // useEffect para carregar a lista de produtos ao montar o componente
  useEffect(() => {
    fetchProducts();

    // Listener para atualizar a lista sempre que a tela ganha foco
    const unsubscribe = navigation.addListener("focus", () => {
      fetchProducts();
      setSelectedProducts([]); // Reseta a seleção ao voltar para Inventory
    });

    return unsubscribe;
  }, [navigation]);

  // Função para lidar com a seleção de itens
  const handleSelectProduct = (product) => {
    if (selectedProducts.includes(product)) {
      setSelectedProducts(
        selectedProducts.filter((item) => item.id !== product.id)
      );
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  // Função para editar os produtos selecionados
  const handleEditProduct = () => {
    if (selectedProducts.length === 0) {
      Alert.alert("Aviso", "Selecione pelo menos um produto para editar.");
      return;
    }

    navigation.navigate("EditProduct", { products: selectedProducts });
  };

  // Função para ordenar os produtos com base no campo e direção
  const sortProducts = (field) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);

    const sortedProducts = [...products].sort((a, b) => {
      if (direction === "asc") {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });

    setProducts(sortedProducts);
  };

  // Função para renderizar cada item da lista de produtos
  const renderProduct = ({ item }) => {
    const isSelected = selectedProducts.includes(item);
    const isLowQuantity = item.quantidade < 10; // Verifica se a quantidade é menor que 10

    return (
      <TouchableOpacity
        style={[styles.productRow, isSelected && styles.selectedRow]}
        onPress={() => handleSelectProduct(item)}
      >
        <View style={[styles.column, { width: "20%" }]}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${item.imagem}` }}
            style={styles.productImage}
          />
        </View>
        <Text style={[styles.productText, { width: "35%" }]}>{item.nome}</Text>
        <Text style={[styles.productText, { width: "35%" }]}>
          {item.descricao}
        </Text>
        <Text
          style={[
            styles.productText,
            { width: "10%" },
            isLowQuantity && styles.lowQuantity, // Aplica estilo se quantidade for baixa
          ]}
        >
          {item.quantidade}
        </Text>
      </TouchableOpacity>
    );
  };

  // Função para renderizar o ícone de ordenação
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <Ionicons name="arrow-up" size={14} color="black" />
    ) : (
      <Ionicons name="arrow-down" size={14} color="black" />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AddProduct")}
        >
          <Ionicons name="add-circle-outline" size={28} color="#fff" />
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            selectedProducts.length === 0 && styles.disabledButton,
          ]}
          onPress={handleEditProduct}
          disabled={selectedProducts.length === 0} // Habilita o botão ao selecionar pelo menos um item
        >
          <Ionicons name="create-outline" size={28} color="#fff" />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={[styles.headerText, { width: "20%" }]}>Imagem</Text>
        <TouchableOpacity
          style={[
            styles.headerText,
            {
              width: "35%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
          onPress={() => sortProducts("nome")}
        >
          <Text style={styles.sortableText}>Nome</Text>
          {renderSortIcon("nome")}
        </TouchableOpacity>
        <Text
          style={[styles.headerText, { width: "35%", textAlign: "center" }]}
        >
          Descrição
        </Text>
        <TouchableOpacity
          style={[
            styles.headerText,
            {
              width: "10%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
          onPress={() => sortProducts("quantidade")}
        >
          <Text style={styles.sortableText}>Qtd</Text>
          {renderSortIcon("quantidade")}
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text>Nenhum produto cadastrado.</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "tomato",
    padding: 15,
    borderRadius: 10,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#f1f1f1",
    marginTop: 20,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  sortableText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "tomato",
  },
  listContainer: {
    paddingVertical: 10,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  selectedRow: {
    backgroundColor: "#e0f7fa",
  },
  column: {
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  productText: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
  },
  lowQuantity: {
    color: "red",
    fontWeight: "bold",
  },
});

export default InventoryScreen;
