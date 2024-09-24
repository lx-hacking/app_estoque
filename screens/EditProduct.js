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
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const EditProduct = ({ route, navigation }) => {
  const { products } = route.params; // Recebe os produtos selecionados da tela anterior
  const [editableProducts, setEditableProducts] = useState(
    products.map((product) => ({
      ...product,
      newImage: null, // Campo para armazenar a nova imagem selecionada
    }))
  );
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal

  // Função para lidar com a mudança de valores nos campos editáveis
  const handleInputChange = (text, index, field) => {
    const updatedProducts = [...editableProducts];
    updatedProducts[index][field] = text;
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
      updatedProducts[index].newImage = result.assets[0].uri; // Armazena o URI da nova imagem
      setEditableProducts(updatedProducts);
    }
  };

  // Função para salvar as alterações no banco de dados
  const handleSave = async () => {
    try {
      // Prepara os produtos para envio ao backend, incluindo a conversão da imagem para base64
      const updatedProducts = await Promise.all(
        editableProducts.map(async (product) => {
          let imageBase64 = product.imagem; // Imagem atual do produto em base64

          // Se uma nova imagem foi selecionada, converte-a para base64
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
            imagem: imageBase64, // Atualiza a imagem para enviar ao backend
          };
        })
      );

      // Envia os produtos atualizados para o backend
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

      // Exibe o modal de sucesso
      setModalVisible(true);
    } catch (error) {
      console.error("Erro ao salvar produtos:", error);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };

  // Função para fechar o modal e redirecionar para a tela de Inventory
  const handleModalClose = () => {
    setModalVisible(false);
    setEditableProducts(
      products.map((product) => ({
        ...product,
        newImage: null,
      }))
    ); // Reseta os produtos para o estado inicial
    navigation.goBack(); // Fecha a tela de EditProduct após o modal
  };

  // Limpa os dados ao sair da tela
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      setEditableProducts(
        products.map((product) => ({
          ...product,
          newImage: null,
        }))
      );
    });

    return unsubscribe; // Remove o listener quando o componente é desmontado
  }, [navigation]);

  // Renderiza cada produto na lista com campos editáveis
  const renderProduct = ({ item, index }) => (
    <View style={styles.productContainer}>
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
      <TextInput
        style={styles.input}
        value={item.nome}
        onChangeText={(text) => handleInputChange(text, index, "nome")}
        placeholder="Nome"
      />
      <TextInput
        style={styles.input}
        value={item.descricao}
        onChangeText={(text) => handleInputChange(text, index, "descricao")}
        placeholder="Descrição"
      />
      <TextInput
        style={styles.input}
        value={item.valor_venda.toString()}
        onChangeText={(text) => handleInputChange(text, index, "valor_venda")}
        placeholder="Valor"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={item.quantidade.toString()}
        onChangeText={(text) => handleInputChange(text, index, "quantidade")}
        placeholder="Quantidade"
        keyboardType="numeric"
      />
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
      <FlatList
        data={editableProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        ListEmptyComponent={<Text>Nenhum produto para editar.</Text>}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>

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
              style={styles.modalButton}
              onPress={handleModalClose}
            >
              <Text style={styles.modalButtonText}>OK</Text>
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
  productContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
  },
  imageText: {
    color: "#007bff",
    textAlign: "center",
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "tomato",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
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
  modalButton: {
    backgroundColor: "#4BB543",
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default EditProduct;
