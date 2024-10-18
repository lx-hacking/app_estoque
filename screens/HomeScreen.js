import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useAuth } from "../AuthContext";
import AuthStyle from "./AuthStyle";

const HomeScreen = ({ navigation }) => {
  const { funcionarioId, logout } = useAuth();
  const [funcionario, setFuncionario] = useState(null);
  const [vendas, setVendas] = useState([]);
  const [totalMes, setTotalMes] = useState(0);
  const [nomeMes, setNomeMes] = useState(""); // Novo estado para o nome do mês
  const [ws, setWs] = useState(null); // Estado para armazenar a conexão WebSocket

  // Função para buscar os dados do funcionário logado
  const fetchFuncionarioData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/getFuncionario/${funcionarioId}`
      );
      if (!response.ok) throw new Error("Erro ao buscar dados do funcionário");
      const data = await response.json();
      setFuncionario(data);
    } catch (error) {
      console.log("Erro ao buscar funcionário:", error);
      Alert.alert("Erro ao buscar dados do funcionário", error.message);
    }
  };

  // Função para buscar as vendas do mês atual
  const fetchVendas = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/salesByFuncionario/${funcionarioId}`
      );
      if (!response.ok) throw new Error("Erro ao buscar vendas");
      const data = await response.json();
      setVendas(data.vendas);
      setTotalMes(data.totalMes);
    } catch (error) {
      console.log("Erro ao buscar vendas:", error);
      Alert.alert("Erro ao buscar vendas", error.message);
    }
  };

  // Função para obter o nome do mês atual
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
    return meses[numeroMes - 1]; // Lembre-se que o mês no JavaScript começa em 0
  };

  useEffect(() => {
    if (funcionarioId) {
      fetchFuncionarioData();
      fetchVendas();

      const mesAtual = new Date().getMonth() + 1; // Mês atual (1 para Janeiro, 12 para Dezembro)
      setNomeMes(getNomeMes(mesAtual)); // Definir o nome do mês no estado

      // Conectar ao WebSocket
      const webSocket = new WebSocket("ws://localhost:3000");
      setWs(webSocket);

      webSocket.onopen = () => {
        console.log("Conectado ao WebSocket");
      };

      webSocket.onerror = (error) => {
        console.log("Erro no WebSocket: ", error);
      };

      // Escutar eventos de atualização de vendas
      webSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Mensagem do WebSocket: ", data);
        if (data.type === "UPDATE_SALES") {
          fetchVendas(); // Atualizar a lista de vendas quando uma nova venda for realizada
        }
      };

      // Fechar a conexão WebSocket quando o componente for desmontado
      return () => {
        if (webSocket) {
          webSocket.close();
        }
      };
    }
  }, [funcionarioId]);

  const renderVendaItem = (item, index) => (
    <View key={index} style={styles.vendaItem}>
      <Text style={styles.vendaData}>{item.data_formatada}</Text>
      <Text style={styles.vendaTotal}>R$ {item.total_vendas}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.webp")} style={AuthStyle.logo} />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false} // Tornar a barra de rolagem invisível
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
          {funcionario ? funcionario.nome_completo : "Usuário"}
        </Text>

        {/* Exibe o nome do mês */}
        <Text style={styles.title}>Vendas de {nomeMes}</Text>

        {/* Tabela de vendas */}
        {vendas.length > 0 ? (
          vendas.map((item, index) => renderVendaItem(item, index))
        ) : (
          <Text>Nenhuma venda registrada para este mês.</Text>
        )}

        <Text style={styles.totalMes}>
          Total de {nomeMes}: R$ {totalMes}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  contentContainer: {
    alignItems: "center",
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
