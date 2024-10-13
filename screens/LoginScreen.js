import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native"; // Importa o componente Image
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
        <Image
          source={require("../assets/logo.webp")} // Adiciona a logo aqui
          style={{ width: "100%", height: "100%", resizeMode: "contain" }} // Ajusta o estilo da imagem
        />
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
        <TouchableOpacity onPress={() => Alert.alert("Ir para Registro")}>
          {" "}
          {/* Tornando todo o texto clicável */}
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
