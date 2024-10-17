import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../AuthContext";
import AuthStyle from "./AuthStyle"; // Importe o estilo da logo

const HomeScreen = ({ navigation }) => {
  const { funcionarioId, logout } = useAuth(); // Obtenha o ID do funcionário e a função de logout
  const [funcionario, setFuncionario] = useState(null);

  // Função para buscar os dados do funcionário logado
  const fetchFuncionarioData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/getFuncionario/${funcionarioId}`
      ); // Usando localhost
      const data = await response.json();
      setFuncionario(data); // Define os dados do funcionário
    } catch (error) {
      Alert.alert("Erro ao buscar dados do funcionário", error.message);
    }
  };

  // Chame a função de busca dos dados quando o componente for montado
  useEffect(() => {
    if (funcionarioId) {
      fetchFuncionarioData();
    }
  }, [funcionarioId]);

  // Definindo o botão de logout no header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            logout();
            navigation.navigate("Login"); // Navegar para a tela de login após o logout
          }}
          style={{ paddingRight: 20 }}
        >
          <Ionicons name="log-out-outline" size={24} color="tomato" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleLogout = () => {
    logout(); // Chama a função de logout
    navigation.navigate("Login"); // Navega para a tela de login
  };

  return (
    <View style={styles.container}>
      {/* Exibe a logo usando o estilo do AuthStyle */}
      <Image
        source={require("../assets/logo.webp")} // Caminho para a logo
        style={AuthStyle.logo} // Usando o estilo da logo já definido
      />

      {/* Exibe o restante da tela centralizado */}
      <View style={styles.contentContainer}>
        {/* Exibe a foto do usuário, se disponível */}
        {funcionario && funcionario.foto ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${funcionario.foto}` }} // Mostra a foto do funcionário em base64
            style={styles.userPhoto}
          />
        ) : (
          <Text>Carregando foto...</Text>
        )}

        {/* Mensagem de boas-vindas */}
        <Text>
          Olá, seja bem-vindo,{" "}
          {funcionario ? funcionario.nome_completo : "Usuário"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", // Alinha o conteúdo ao topo
  },
  contentContainer: {
    alignItems: "center",
  },
  userPhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20, // Espaçamento abaixo da foto
  },
});

export default HomeScreen;
