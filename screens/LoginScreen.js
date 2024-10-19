// screens/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
  Image,
} from "react-native";
import AuthStyle from "./AuthStyle";
import { useAuth } from "../AuthContext";

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
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
        login(data.funcionario.id); // Passar o ID do funcionário para o contexto
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
      <Image
        source={require("../assets/logo.png")} // Verifique se a imagem está correta
        style={[
          AuthStyle.logo,
          { marginTop: 0, paddingTop: 0 }, // Garante que não há padding ou margem
        ]}
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
      <View style={AuthStyle.linkContainer}>
        <TouchableOpacity onPress={() => Alert.alert("Recuperar Senha")}>
          <Text
            style={[
              AuthStyle.linkText,
              { color: "tomato", fontWeight: "bold", marginBottom: 5 },
            ]}
          >
            Esqueceu a senha?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text
            style={{
              color: "tomato",
              fontWeight: "bold",
              textAlign: "center",
              marginVertical: 5,
            }}
          >
            Não possui login? Registre-se
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
