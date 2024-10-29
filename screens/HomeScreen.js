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

  // Função para capitalizar o nome do usuário
  const capitalizeName = (name) => {
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    if (funcionarioId) {
      fetchFuncionarioData();
      fetchVendas();

      const mesAtual = new Date().getMonth() + 1;
      setNomeMes(getNomeMes(mesAtual));
    }

    // Conectar ao WebSocket
    const socket = new WebSocket("ws://localhost:3000");

    socket.onopen = () => {
      console.log("Conectado ao WebSocket");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "UPDATE_SALES") {
        fetchVendas();
      }
    };

    socket.onerror = (error) => {
      console.error("Erro no WebSocket:", error);
    };

    return () => {
      socket.close();
    };
  }, [funcionarioId, navigation]);

  // Adiciona o botão de logout no cabeçalho
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            logout();
            navigation.navigate("Login");
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
        {funcionario ? (
          <Text style={{ fontWeight: "bold" }}>
            {capitalizeName(funcionario.nome_completo)}
          </Text>
        ) : (
          "Usuário"
        )}
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
    width: Dimensions.get("window").width,
    paddingBottom: 20,
  },
  userPhoto: {
    width: 170,
    height: 170,
    borderRadius: 200,
    marginBottom: 20,
    borderWidth: 5,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  vendaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: Dimensions.get("window").width * 0.9,
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
