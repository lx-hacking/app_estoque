import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const InventoryScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);

  // Função para buscar produtos do backend
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/products");
      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  // useEffect para carregar a lista de produtos ao montar o componente
  useEffect(() => {
    fetchProducts(); // Chama a função para buscar produtos quando o componente é montado

    // Listener para atualizar a lista sempre que a tela ganha foco
    const unsubscribe = navigation.addListener("focus", () => {
      fetchProducts(); // Atualiza os produtos quando a tela é focada
    });

    return unsubscribe; // Remove o listener ao desmontar o componente
  }, [navigation]);

  // Função para navegar para a tela de cadastro de produtos
  const handleAddProduct = () => {
    navigation.navigate("AddProduct");
  };

  // Função para editar produto (a implementação pode ser ajustada conforme necessário)
  const handleEditProduct = () => {
    console.log("Editar Produto");
  };

  // Renderiza cada item da lista de produtos
  const renderProduct = ({ item }) => (
    <View style={styles.productRow}>
      <Image
        source={{ uri: `data:image/jpeg;base64,${item.imagem}` }}
        style={styles.productImage}
      />
      <Text style={styles.productText}>{item.nome}</Text>
      <Text style={styles.productText}>{item.descricao}</Text>
      <Text style={styles.productText}>{item.valor_venda}</Text>
      <Text style={styles.productText}>{item.quantidade}</Text>
      <Text style={styles.productText}>{item.preco_custo}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
          <Ionicons name="add-circle-outline" size={28} color="#fff" />
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleEditProduct}>
          <Ionicons name="create-outline" size={28} color="#fff" />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerText}>Imagem</Text>
        <Text style={styles.headerText}>Nome</Text>
        <Text style={styles.headerText}>Descrição</Text>
        <Text style={styles.headerText}>Valor</Text>
        <Text style={styles.headerText}>Qtd</Text>
        <Text style={styles.headerText}>Custo</Text>
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
    width: "60%",
    marginTop: 20,
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
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  productText: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
  },
});

export default InventoryScreen;
