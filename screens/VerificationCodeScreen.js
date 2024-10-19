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
import axios from "axios"; // Certifique-se de que o axios está instalado

const VerificationCodeScreen = ({ route, navigation }) => {
  const { email, codigoEnviado } = route.params; // Recebe o e-mail e o código enviado
  const [codigo, setCodigo] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Estado para a mensagem de erro

  const handleSubmit = async () => {
    if (codigo !== codigoEnviado) {
      setErrorMessage("Código inválido."); // Define a mensagem de erro se o código não coincidir
      return;
    }

    // Se o código for correto, navegue para a tela de cadastro de senha
    navigation.navigate("RegisterPassword", { email });
  };

  return (
    <View style={AuthStyle.container}>
      <Image
        source={require("../assets/logo.png")} // Caminho para a logo
        style={AuthStyle.logo} // Estilo da logo
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
        <Text style={AuthStyle.buttonText}>Validar Código</Text>
      </TouchableOpacity>

      {errorMessage ? ( // Exibe a mensagem de erro se existir
        <Text style={{ color: "red", marginTop: 10 }}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

export default VerificationCodeScreen;
