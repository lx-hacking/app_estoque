import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productValue, setProductValue] = useState("");
  const [productCost, setProductCost] = useState("");
  const [productQty, setProductQty] = useState("");
  const [image, setImage] = useState(null);

  // Função para selecionar uma imagem da galeria
  const pickImage = async () => {
    // Solicita permissão para acessar a galeria
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Função para salvar o produto (pode ser adaptada para conectar com backend)
  const handleSaveProduct = () => {
    // Aqui você pode adicionar a lógica para salvar o produto no banco de dados
    console.log({
      productName,
      productDescription,
      productValue,
      productCost,
      productQty,
      image,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome do Produto</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do produto"
        value={productName}
        onChangeText={setProductName}
      />

      <Text style={styles.label}>Descrição do Produto</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a descrição do produto"
        value={productDescription}
        onChangeText={setProductDescription}
      />

      <Text style={styles.label}>Valor</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o valor do produto"
        value={productValue}
        onChangeText={setProductValue}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Preço de Custo</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o preço de custo"
        value={productCost}
        onChangeText={setProductCost}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a quantidade"
        value={productQty}
        onChangeText={setProductQty}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Selecionar Imagem</Text>
        )}
      </TouchableOpacity>

      <Button title="Salvar Produto" onPress={handleSaveProduct} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
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
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
});

export default AddProduct;
