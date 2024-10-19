import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Modal,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker"; // Importando Picker para o dropdown
import { Ionicons } from "@expo/vector-icons"; // Para a seta de voltar

const EditProduct = ({ route, navigation }) => {
  const { products } = route.params;
  const [editableProducts, setEditableProducts] = useState(
    products.map((product) => ({
      ...product,
      newImage: null,
    }))
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Função para lidar com a mudança de valores nos campos editáveis
  const handleInputChange = (value, index, field) => {
    const updatedProducts = [...editableProducts];
    updatedProducts[index][field] = value;
    setEditableProducts(updatedProducts);
  };

  // Função para selecionar uma nova imagem
  const pickImage = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const updatedProducts = [...editableProducts];
      updatedProducts[index].newImage = result.assets[0].uri;
      setEditableProducts(updatedProducts);
    }
  };

  // Função para salvar as alterações no banco de dados
  const handleSave = async () => {
    try {
      const updatedProducts = await Promise.all(
        editableProducts.map(async (product) => {
          let imageBase64 = product.imagem;

          if (product.newImage) {
            const response = await fetch(product.newImage);
            const blob = await response.blob();
            imageBase64 = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result.split(",")[1]);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          }

          return {
            ...product,
            imagem: imageBase64,
          };
        })
      );

      const response = await fetch("http://localhost:3000/updateproducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: updatedProducts }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar alterações");
      }

      setModalVisible(true);
    } catch (error) {
      console.error("Erro ao salvar produtos:", error);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };

  // Função para abrir o modal de confirmação de exclusão
  const confirmDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalVisible(true);
  };

  // Função para deletar o produto do banco de dados
  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/deleteproduct/${productToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar o produto");
      }

      setDeleteModalVisible(false);
      Alert.alert("Produto deletado com sucesso.");
      navigation.navigate("Inventory"); // Volta para a tela de inventário após a exclusão
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      Alert.alert("Erro", "Não foi possível deletar o produto.");
    }
  };

  // Função para fechar o modal de sucesso
  const handleModalClose = () => {
    setModalVisible(false);
    setEditableProducts(
      products.map((product) => ({
        ...product,
        newImage: null,
      }))
    );
    navigation.goBack();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      setEditableProducts(
        products.map((product) => ({
          ...product,
          newImage: null,
        }))
      );
    });

    return unsubscribe;
  }, [navigation]);

  const renderProduct = ({ item, index }) => (
    <View style={styles.productContainer}>
      {/* Adiciona o nome do produto como título */}
      <Text style={styles.sectionTitle}>{item.nome}</Text>
      <TouchableOpacity onPress={() => pickImage(index)}>
        {item.newImage ? (
          <Image source={{ uri: item.newImage }} style={styles.image} />
        ) : (
          <Image
            source={{ uri: `data:image/jpeg;base64,${item.imagem}` }}
            style={styles.image}
          />
        )}
        <Text style={styles.imageText}>Alterar Imagem</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={item.nome}
        onChangeText={(text) => handleInputChange(text, index, "nome")}
        placeholder="Nome"
      />
      <Text style={styles.label}>Volume do Frasco</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={item.descricao}
          onValueChange={(value) =>
            handleInputChange(value, index, "descricao")
          }
          style={styles.picker}
        >
          <Picker.Item label="10ml" value="10ml" />
          <Picker.Item label="100ml" value="100ml" />
        </Picker>
      </View>
      <Text style={styles.label}>Valor</Text>
      <TextInput
        style={styles.input}
        value={item.valor_venda.toString()}
        onChangeText={(text) => handleInputChange(text, index, "valor_venda")}
        placeholder="Valor"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        style={styles.input}
        value={item.quantidade.toString()}
        onChangeText={(text) => handleInputChange(text, index, "quantidade")}
        placeholder="Quantidade"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Preço de Custo</Text>
      <TextInput
        style={styles.input}
        value={item.preco_custo.toString()}
        onChangeText={(text) => handleInputChange(text, index, "preco_custo")}
        placeholder="Custo"
        keyboardType="numeric"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Produto</Text>{" "}
        {/* Adiciona o título */}
      </View>

      <FlatList
        data={editableProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        ListEmptyComponent={<Text>Nenhum produto para editar.</Text>}
        showsVerticalScrollIndicator={false} // Oculta a barra de rolagem vertical
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDelete(editableProducts[0])}
        >
          <Text style={styles.deleteButtonText}>Deletar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para exibir mensagem de sucesso */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Alterações feitas com sucesso!</Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.successButton]}
              onPress={handleModalClose}
            >
              <Text style={styles.successButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Deseja mesmo deletar esse produto?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "red" }]}
                onPress={handleDelete}
              >
                <Text style={styles.modalButtonText}>Deletar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "blue" }]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10, // Dá espaço entre a seta e o título
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  productContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 40,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
  },
  imageText: {
    color: "#007bff",
    textAlign: "center",
    marginBottom: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff", // Se você quiser que o fundo dos botões seja branco
  },

  deleteButton: {
    backgroundColor: "red",
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#4BB543",
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
    color: "#4BB543",
  },
  modalButtonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  successButton: {
    backgroundColor: "#4BB543", // Mesma cor verde da mensagem de sucesso
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  successButtonText: {
    color: "white", // Texto branco para melhor contraste
    fontWeight: "bold",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default EditProduct;
