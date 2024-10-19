import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const InventoryScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortField, setSortField] = useState("nome");
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/products");
      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }
      const data = await response.json();
      const sortedData = data.sort((a, b) => a.nome.localeCompare(b.nome));
      setProducts(sortedData);
      setFilteredProducts(sortedData);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    const unsubscribe = navigation.addListener("focus", () => {
      fetchProducts();
      setSelectedProducts([]);
    });
    return unsubscribe;
  }, [navigation]);

  const handleSelectProduct = (product) => {
    if (selectedProducts.includes(product)) {
      setSelectedProducts(
        selectedProducts.filter((item) => item.id !== product.id)
      );
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleEditProduct = () => {
    if (selectedProducts.length === 0) {
      Alert.alert("Aviso", "Selecione pelo menos um produto para editar.");
      return;
    }
    navigation.navigate("EditProduct", { products: selectedProducts });
  };

  const sortProducts = (field) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);

    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (direction === "asc") {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });

    setFilteredProducts(sortedProducts);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.nome.toLowerCase().includes(text.toLowerCase()) ||
          product.descricao.toLowerCase().includes(text.toLowerCase()) ||
          product.valor_venda.toString().includes(text) ||
          product.preco_custo.toString().includes(text) ||
          product.quantidade.toString().includes(text)
      );
      setFilteredProducts(filtered);
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setFilteredProducts(products);
  };

  const renderProduct = ({ item }) => {
    const isSelected = selectedProducts.includes(item);
    const isLowQuantity = item.quantidade < 10;

    return (
      <TouchableOpacity
        style={[styles.productRow, isSelected && styles.selectedRow]}
        onPress={() => handleSelectProduct(item)}
      >
        <View style={[styles.column, styles.borderRight, { width: "10%" }]}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${item.imagem}` }}
            style={styles.productImage}
          />
        </View>
        <Text
          style={[
            styles.productText,
            styles.leftAlignedText,
            styles.borderRight,
            { width: "30%" },
          ]}
        >
          {item.nome}
        </Text>
        <Text
          style={[
            styles.productText,
            styles.centerAlignedText,
            styles.borderRight,
            { width: "20%" },
          ]}
        >
          Frasco de {item.descricao}
        </Text>
        <Text
          style={[
            styles.productText,
            styles.centerAlignedText,
            styles.borderRight,
            { width: "13.33%" },
          ]}
        >
          {parseFloat(item.valor_venda).toFixed(2)}
        </Text>
        <Text
          style={[
            styles.productText,
            styles.centerAlignedText,
            styles.borderRight,
            { width: "13.33%" },
          ]}
        >
          {parseFloat(item.preco_custo).toFixed(2)}
        </Text>
        <Text
          style={[
            styles.productText,
            styles.centerAlignedText,
            { width: "13.33%" },
            isLowQuantity && styles.lowQuantity,
          ]}
        >
          {item.quantidade}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text
        style={[
          styles.headerText,
          styles.centerAlignedText,
          styles.borderRight,
          { width: "10%" },
        ]}
      >
        Foto
      </Text>
      <TouchableOpacity
        style={[
          styles.headerTextContainer,
          styles.borderRight,
          { width: "30%" },
        ]}
        onPress={() => sortProducts("nome")}
      >
        <Text style={styles.headerText}>Nome</Text>
        {renderSortIcon("nome")}
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.headerTextContainer,
          styles.borderRight,
          { width: "20%" },
        ]}
        onPress={() => sortProducts("descricao")}
      >
        <Text style={styles.headerText}>Descrição</Text>
        {renderSortIcon("descricao")}
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.headerTextContainer,
          styles.borderRight,
          { width: "13.33%" },
        ]}
        onPress={() => sortProducts("valor_venda")}
      >
        <Text style={styles.headerText}>Valor</Text>
        {renderSortIcon("valor_venda")}
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.headerTextContainer,
          styles.borderRight,
          { width: "13.33%" },
        ]}
        onPress={() => sortProducts("preco_custo")}
      >
        <Text style={styles.headerText}>Custo</Text>
        {renderSortIcon("preco_custo")}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.headerTextContainer, { width: "13.33%" }]}
        onPress={() => sortProducts("quantidade")}
      >
        <Text style={styles.headerText}>Qtd</Text>
        {renderSortIcon("quantidade")}
      </TouchableOpacity>
    </View>
  );

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <Ionicons name="arrow-up" size={14} color="black" />
    ) : (
      <Ionicons name="arrow-down" size={14} color="black" />
    );
  };

  return (
    <View style={styles.outerContainer}>
      {/* Botões fora do container branco */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AddProduct")}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            selectedProducts.length === 0 && styles.disabledButton,
          ]}
          onPress={handleEditProduct}
          disabled={selectedProducts.length === 0}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>

      {/* Título abaixo dos botões */}
      <Text style={styles.title}>Controle de Estoque</Text>

      {/* Container branco com campo de busca e lista */}
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#888"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar produto"
              value={searchQuery}
              onChangeText={handleSearch}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="done"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={resetSearch} style={styles.resetIcon}>
                <Ionicons name="close-circle" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProduct}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.flatListContainer}
            ListEmptyComponent={<Text>Nenhum produto cadastrado.</Text>}
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[0]} // Adiciona essa linha para fixar o cabeçalho
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 5,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  resetIcon: {
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "tomato",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f1f1f1",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  headerTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
  },
  flatListContainer: {
    paddingVertical: 10,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingLeft: 5,
  },
  selectedRow: {
    backgroundColor: "#e3f7fa",
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
    fontSize: 14,
    paddingHorizontal: 5,
  },
  leftAlignedText: {
    textAlign: "left",
    paddingLeft: 5,
  },
  centerAlignedText: {
    textAlign: "center",
  },
  borderRight: {
    borderRightWidth: 0.5,
    borderRightColor: "#ccc",
  },
  lowQuantity: {
    color: "red",
    fontWeight: "bold",
  },
});

export default InventoryScreen;
