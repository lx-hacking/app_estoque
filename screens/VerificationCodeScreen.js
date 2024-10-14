import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  Image,
} from "react-native";
import AuthStyle from "./AuthStyle"; // Importe seu estilo

const VerificationCodeScreen = ({ route, navigation }) => {
  const { email } = route.params; // Recebe o e-mail passado na navegação
  const [codigo, setCodigo] = useState("");

  const handleSubmit = () => {
    // Aqui você pode implementar a lógica para validar o código
    Alert.alert("Código recebido!", `Código inserido: ${codigo}`);
    // Navegue para a próxima tela ou faça a ação desejada
  };

  return (
    <View style={AuthStyle.container}>
      <Image
        source={require("../assets/logo.webp")} // Caminho para a logo
        style={AuthStyle.logo} // Estilo da logo (defina o estilo no seu AuthStyle)
      />
      <TextInput
        style={AuthStyle.input}
        placeholder="Insira o código de verificação"
        value={codigo}
        onChangeText={setCodigo}
        keyboardType="numeric"
        autoCapitalize="none"
      />
      <TouchableOpacity style={AuthStyle.button} onPress={handleSubmit}>
        <Text style={AuthStyle.buttonText}>Enviar Código</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerificationCodeScreen;
