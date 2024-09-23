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

  // Função para cadastrar produto
  const handleAddProduct = () => {
    console.log("Cadastrar Produto");
    // Adicione a navegação para a tela de cadastrar produto, se necessário
  };

  // Função para editar produto
  const handleEditProduct = () => {
    console.log("Editar Produto");
    // Adicione a navegação para a tela de editar produto, se necessário
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
    justifyContent: "flex-start", // Alinha o conteúdo ao topo
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%", // Define a largura total dos botões juntos
    marginTop: 20, // Espaçamento do topo para os botões
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
