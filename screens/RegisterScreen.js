import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  Image,
} from "react-native";
import AuthStyle from "./AuthStyle"; // Importe seu estilo
import axios from "axios"; // Certifique-se de que o axios está instalado

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loadingText, setLoadingText] = useState("Registrar"); // Texto do botão
  const [loadingDots, setLoadingDots] = useState(""); // Controle dos pontos de carregamento
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar se está carregando

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingDots((prev) => (prev.length < 3 ? prev + "." : "")); // Adiciona um ponto até 3, depois reseta
      }, 500); // Adiciona um ponto a cada 500ms
    }
    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [isLoading]);

  const handleRegister = async () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, insira um e-mail.");
      return;
    }

    setIsLoading(true); // Ativa o carregamento
    setLoadingText("Gerando Código" + loadingDots); // Muda o texto do botão

    try {
      // Verifica se o email existe e se a senha não está registrada
      const response = await axios.post("http://localhost:3000/check-email", {
        email,
      });

      console.log("Resposta do servidor:", response.data); // Log da resposta do servidor

      if (response.data.exists && !response.data.senha_registrada) {
        // Gera um código de verificação
        const codigoVerificacao = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        console.log("Código gerado:", codigoVerificacao); // Log do código gerado

        // Envia o código de verificação para o e-mail
        await axios.post("http://localhost:3000/enviar-codigo", {
          email,
          codigo: codigoVerificacao,
        });

        // Salva o código na tabela codigos_verificacao
        await axios.post("http://localhost:3000/salvar-codigo", {
          email,
          codigo: codigoVerificacao,
        });

        Alert.alert("Sucesso", "Código de verificação enviado para o e-mail.");
        navigation.navigate("VerificationCode", { email }); // Navega para a tela de verificação do código
      } else if (response.data.exists && response.data.senha_registrada) {
        Alert.alert("Erro", "Usuário já registrado com senha.");
      } else {
        Alert.alert("Erro", "E-mail não encontrado.");
      }
    } catch (error) {
      console.error("Erro:", error); // Log do erro
      Alert.alert("Erro", "Houve um problema ao processar sua solicitação.");
    } finally {
      setIsLoading(false); // Desativa o carregamento
      setLoadingText("Registrar"); // Reseta o texto do botão
      setLoadingDots(""); // Reseta os pontos de carregamento
    }
  };

  return (
    <View style={AuthStyle.container}>
      <Image
        source={require("../assets/logo.webp")} // Caminho para a logo
        style={AuthStyle.logo} // Estilo da logo
      />
      <TextInput
        style={AuthStyle.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={[
          AuthStyle.button,
          { backgroundColor: isLoading ? "gray" : "tomato" },
        ]} // Cor do botão
        onPress={handleRegister}
        disabled={isLoading} // Desabilita o botão durante o carregamento
      >
        <Text style={AuthStyle.buttonText}>
          {isLoading ? "Gerando Código" + loadingDots : "Registrar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
