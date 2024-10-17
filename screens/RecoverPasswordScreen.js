import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
  Image,
} from "react-native";
import AuthStyle from "./AuthStyle"; // Importa o estilo

const RecoverPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleRecoverPassword = async () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, preencha o campo de e-mail.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/recover-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", data.message);
        navigation.navigate("Login"); // Navega de volta para a tela de login
      } else {
        setError(data.error); // Atualiza a mensagem de erro
        Alert.alert("Erro", data.error);
      }
    } catch (error) {
      console.error("Erro ao recuperar senha:", error);
      Alert.alert("Erro", "Não foi possível recuperar a senha.");
    }
  };

  return (
    <View style={AuthStyle.container}>
      <Image
        source={require("../assets/logo.webp")} // Adiciona a logo aqui
        style={AuthStyle.logo} // Ajuste para o estilo da logo
      />
      {error ? <Text style={AuthStyle.errorText}>{error}</Text> : null}
      <TextInput
        style={AuthStyle.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={AuthStyle.button}
        onPress={handleRecoverPassword}
      >
        <Text style={AuthStyle.buttonText}>Recuperar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecoverPasswordScreen;
