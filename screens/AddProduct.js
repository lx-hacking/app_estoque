import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const AddProduct = ({ navigation }) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productValue, setProductValue] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productCost, setProductCost] = useState("");
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  // Função para selecionar uma imagem da galeria e converter para base64
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true, // Importante para habilitar a captura em base64
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setBase64Image(result.assets[0].base64); // Captura a imagem em base64
    }
  };

  // Função para salvar o produto no banco de dados
  const saveProduct = async () => {
    if (!productName || !productValue || !productQuantity || !productCost) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    if (!base64Image) {
      Alert.alert("Erro", "Selecione uma imagem.");
      return;
    }

    const data = {
      nome: productName,
      descricao: productDescription,
      valor_venda: productValue,
      quantidade: productQuantity,
      preco_custo: productCost,
      image: base64Image, // Envia a imagem em formato base64
    };

    try {
      const response = await fetch("http://localhost:3000/addproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        Alert.alert("Erro", `Falha ao salvar o produto: ${errorText}`);
        console.log("Erro:", errorText);
        return;
      }

      Alert.alert("Sucesso", "Produto salvo com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar o produto:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do Produto</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do produto"
        value={productName}
        onChangeText={setProductName}
        returnKeyType="done"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a descrição"
        value={productDescription}
        onChangeText={setProductDescription}
        returnKeyType="done"
      />

      <Text style={styles.label}>Valor de venda</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o valor"
        value={productValue}
        onChangeText={setProductValue}
        keyboardType="numeric"
        returnKeyType="done"
      />

      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a quantidade"
        value={productQuantity}
        onChangeText={setProductQuantity}
        keyboardType="numeric"
        returnKeyType="done"
      />

      <Text style={styles.label}>Preço de Custo</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o custo"
        value={productCost}
        onChangeText={setProductCost}
        keyboardType="numeric"
        returnKeyType="done"
      />

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.thumbnail} />
        ) : (
          <Text style={styles.imagePickerText}>Selecionar Imagem</Text>
        )}
      </TouchableOpacity>

      <Button title="Salvar Produto" onPress={saveProduct} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
  },
  imagePickerText: {
    color: "#888",
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
});

export default AddProduct;
