import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../AuthContext";
import AuthStyle from "./AuthStyle";

const HomeScreen = ({ navigation }) => {
  const { funcionarioId, logout } = useAuth();
  const [funcionario, setFuncionario] = useState(null);
  const [vendas, setVendas] = useState([]);
  const [totalMes, setTotalMes] = useState(0);
  const [nomeMes, setNomeMes] = useState("");

  const fetchFuncionarioData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/getFuncionario/${funcionarioId}`
      );
      const data = await response.json();
      setFuncionario(data);
    } catch (error) {
      Alert.alert("Erro ao buscar dados do funcionário", error.message);
    }
  };

  const fetchVendas = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/salesByFuncionario/${funcionarioId}`
      );
      const data = await response.json();
      setVendas(data.vendas);
      setTotalMes(data.totalMes);
    } catch (error) {
      Alert.alert("Erro ao buscar vendas", error.message);
    }
  };

  const getNomeMes = (numeroMes) => {
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return meses[numeroMes - 1];
  };

  useEffect(() => {
    if (funcionarioId) {
      fetchFuncionarioData();
      fetchVendas();

      const mesAtual = new Date().getMonth() + 1;
      setNomeMes(getNomeMes(mesAtual));
    }
  }, [funcionarioId]);

  // Adiciona o botão de logout no cabeçalho
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            logout(); // Função de logout do contexto de autenticação
            navigation.navigate("Login"); // Redireciona para a tela de login após logout
          }}
          style={{ paddingRight: 20 }}
        >
          <Ionicons name="log-out-outline" size={24} color="tomato" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderVendaItem = (item, index) => (
    <View key={index} style={styles.vendaItem}>
      <Text style={styles.vendaData}>{item.data_formatada}</Text>
      <Text style={styles.vendaTotal}>R$ {item.total_vendas}</Text>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Image source={require("../assets/logo.png")} style={AuthStyle.logo} />

      {funcionario && funcionario.foto ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${funcionario.foto}` }}
          style={styles.userPhoto}
        />
      ) : (
        <Text>Carregando foto...</Text>
      )}

      <Text>
        Olá, seja bem-vindo,{" "}
        {funcionario ? funcionario.nome_completo : "Usuário"}
      </Text>

      <Text style={styles.title}>Vendas de {nomeMes}</Text>

      {vendas.map((item, index) => renderVendaItem(item, index))}

      <Text style={styles.totalMes}>
        Total de {nomeMes}: R$ {totalMes}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: Dimensions.get("window").width, // Largura total da tela
    paddingBottom: 20, // Adicionando espaçamento no final para melhorar o scroll
  },
  userPhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  vendaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: Dimensions.get("window").width * 0.9, // 90% da largura da tela
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  vendaData: {
    fontSize: 16,
  },
  vendaTotal: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalMes: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
});

export default HomeScreen;
