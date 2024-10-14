import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  Modal,
} from "react-native";
import AuthStyle from "./AuthStyle"; // Importe seu estilo
import axios from "axios"; // Certifique-se de que o axios está instalado
import bcrypt from "bcryptjs"; // Importando bcrypt para hash de senhas
import { Ionicons } from "@expo/vector-icons"; // Importando ícones

const RegisterPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params; // Recebe o e-mail passado na navegação
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Estado para a mensagem de erro
  const [modalVisible, setModalVisible] = useState(false); // Estado do modal

  const validatePassword = (senha) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(senha);
    const hasNumber = /\d/.test(senha);
    const hasSpecialChar = /[!@#\$%\^&\*]/.test(senha);

    return (
      senha.length >= minLength && hasUpperCase && hasNumber && hasSpecialChar
    );
  };

  const handleSubmit = async () => {
    if (senha === "") {
      Alert.alert("Erro", "Por favor, insira uma senha.");
      return;
    }

    if (!validatePassword(senha)) {
      Alert.alert(
        "Erro",
        "A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, números e um caractere especial."
      );
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      // Criptografa a senha antes de salvar
      const hashedPassword = await bcrypt.hash(senha, 10);

      // Salva a senha no banco de dados e atualiza a coluna senha_cadastrada
      const response = await axios.post("http://localhost:3000/salvar-senha", {
        email,
        senha: hashedPassword,
      });

      if (response.data.success) {
        setModalVisible(true); // Abre o modal de sucesso
      } else {
        setErrorMessage("Erro ao cadastrar a senha."); // Define a mensagem de erro
      }
    } catch (error) {
      console.error("Erro:", error); // Log do erro
      Alert.alert("Erro", "Houve um problema ao cadastrar a senha.");
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
        placeholder="Nova Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TextInput
        style={AuthStyle.input}
        placeholder="Confirmar Senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />
      <TouchableOpacity style={AuthStyle.button} onPress={handleSubmit}>
        <Text style={AuthStyle.buttonText}>Cadastrar Senha</Text>
      </TouchableOpacity>

      <Text style={{ color: "tomato", fontWeight: "bold", marginTop: 20 }}>
        Regras para criação de senha:
      </Text>
      <View style={{ marginTop: 10 }}>
        <Text style={{ color: senha.length >= 8 ? "green" : "red" }}>
          {senha.length >= 8 && (
            <Ionicons name="checkmark-circle" size={16} color="green" />
          )}
          Mínimo de 8 caracteres
        </Text>
        <Text style={{ color: /[A-Z]/.test(senha) ? "green" : "red" }}>
          {/[A-Z]/.test(senha) && (
            <Ionicons name="checkmark-circle" size={16} color="green" />
          )}
          Pelo menos uma letra maiúscula
        </Text>
        <Text style={{ color: /\d/.test(senha) ? "green" : "red" }}>
          {/\d/.test(senha) && (
            <Ionicons name="checkmark-circle" size={16} color="green" />
          )}
          Deve conter números
        </Text>
        <Text style={{ color: /[!@#\$%\^&\*]/.test(senha) ? "green" : "red" }}>
          {/[!@#\$%\^&\*]/.test(senha) && (
            <Ionicons name="checkmark-circle" size={16} color="green" />
          )}
          Deve conter no mínimo um caractere especial (ex: !@#)
        </Text>
      </View>

      {errorMessage ? (
        <Text style={{ color: "red", marginTop: 10 }}>{errorMessage}</Text>
      ) : null}

      {/* Modal de Sucesso */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            <Text style={{ marginBottom: 15, textAlign: "center" }}>
              {" "}
              {/* Adicione textAlign: "center" */}
              Usuário cadastrado com sucesso!
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "tomato",
                padding: 10,
                borderRadius: 5,
              }}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Login"); // Navega para a tela de login
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RegisterPasswordScreen;
