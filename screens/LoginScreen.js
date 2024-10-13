import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AuthStyle from "./AuthStyle";
import { useAuth } from "../AuthContext"; // Importa o contexto de autenticação

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth(); // Obtém a função de login do contexto
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", data.message);
        login(); // Marca o usuário como logado
        navigation.navigate("MainTabs");
      } else {
        setError(data.error);
        Alert.alert("Erro", data.error);
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      Alert.alert("Erro", "Não foi possível realizar o login.");
    }
  };

  return (
    <View style={AuthStyle.container}>
      <View style={AuthStyle.logo}>
        <Text style={{ fontSize: 24 }}>Logo Aqui</Text>
      </View>
      {error ? <Text style={AuthStyle.errorText}>{error}</Text> : null}
      <TextInput
        style={AuthStyle.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={AuthStyle.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={AuthStyle.button} onPress={handleLogin}>
        <Text style={AuthStyle.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={AuthStyle.buttonContainer}>
        <TouchableOpacity onPress={() => Alert.alert("Ir para Registro")}>
          <Text style={AuthStyle.linkText}>Registrar-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
