import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker"; // Corrigindo a importação do Picker

const AddProduct = ({ navigation }) => {
  const [productName, setProductName] = useState("");
  const [productVolume, setProductVolume] = useState("10ml"); // Estado para o volume selecionado
  const [productValue, setProductValue] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productCost, setProductCost] = useState("");
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setBase64Image(result.assets[0].base64);
    }
  };

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
      descricao: productVolume, // Salva o volume selecionado na descrição
      valor_venda: productValue,
      quantidade: productQuantity,
      preco_custo: productCost,
      image: base64Image,
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
        return;
      }

      setShowSuccessModal(true);
      resetForm();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  const resetForm = () => {
    setProductName("");
    setProductVolume("10ml");
    setProductValue("");
    setProductQuantity("");
    setProductCost("");
    setImage(null);
    setBase64Image(null);
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.successText}>Produto salvo com sucesso!</Text>
            <Button
              title="OK"
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate("Estoque", { refresh: true });
              }}
            />
          </View>
        </View>
      </Modal>

      <Text style={styles.label}>Nome do Produto</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do produto"
        value={productName}
        onChangeText={setProductName}
        returnKeyType="done"
      />

      <Text style={styles.label}>Volume do frasco</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={productVolume}
          onValueChange={(itemValue) => setProductVolume(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="10ml" value="10ml" />
          <Picker.Item label="100ml" value="100ml" />
        </Picker>
      </View>

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
  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 40,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  successText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#4BB543",
  },
});

export default AddProduct;
