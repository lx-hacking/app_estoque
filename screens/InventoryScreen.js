import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Importar a biblioteca de ícones

const InventoryScreen = ({ navigation }) => {
  // Configurações de layout do cabeçalho da tela
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center", // Centraliza o título no cabeçalho
    });
  }, [navigation]);

  // Função para navegar para a tela de Cadastrar Produto
  const handleAddProduct = () => {
    navigation.navigate("AddProduct"); // Navega para a tela AddProduct
  };

  // Função para editar produto (exemplo)
  const handleEditProduct = () => {
    console.log("Editar Produto");
    // Adicione a navegação ou ação desejada para o botão Editar
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleEditProduct}>
          <Ionicons name="create-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
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
});

export default InventoryScreen;
