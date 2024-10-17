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

const RegisterNewPasswordScreen = ({ route, navigation }) => {
  const { email, senhaTemporaria } = route.params; // Recebe o e-mail e a senha temporária
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegisterNewPassword = async () => {
    if (!newPassword) {
      Alert.alert("Erro", "Por favor, preencha o campo de nova senha.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/salvar-senha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Senha redefinida com sucesso.");
        navigation.navigate("Login"); // Navega de volta para a tela de login
      } else {
        setError(data.error); // Atualiza a mensagem de erro
        Alert.alert("Erro", data.error);
      }
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      Alert.alert("Erro", "Não foi possível redefinir a senha.");
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
        placeholder="Nova Senha"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={AuthStyle.button}
        onPress={handleRegisterNewPassword}
      >
        <Text style={AuthStyle.buttonText}>Redefinir Senha</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterNewPasswordScreen;
