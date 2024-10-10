import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { funcionariosStyles } from "./FuncionariosStyle"; // Importa os estilos de FuncionariosStyle.js

// Função para capitalizar as iniciais de cada palavra
const capitalizeFirstLetter = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function FuncionariosScreen({ navigation }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para mostrar indicador de carregamento
  const [selectedFuncionario, setSelectedFuncionario] = useState(null); // Estado para armazenar o funcionário selecionado
  const ws = useRef(null); // Referência para WebSocket

  // Função para buscar os funcionários do backend
  const fetchFuncionarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/getFuncionarios"); // URL do endpoint que retorna a lista de funcionários
      const result = await response.json();

      if (response.ok) {
        setFuncionarios(result); // Armazena os dados dos funcionários
      } else {
        Alert.alert("Erro", "Erro ao buscar funcionários.");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao se conectar com o servidor.");
    } finally {
      setLoading(false); // Parar o indicador de carregamento
    }
  };

  // Função para configurar o WebSocket
  const setupWebSocket = () => {
    ws.current = new WebSocket("ws://localhost:3000"); // WebSocket conectado ao servidor

    ws.current.onopen = () => {
      console.log("Conectado ao WebSocket");
    };

    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "UPDATE_FUNCIONARIO") {
        // Quando um novo funcionário for cadastrado, atualiza a lista
        fetchFuncionarios();
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket desconectado");
    };
  };

  // Buscar funcionários e configurar WebSocket ao montar o componente
  useEffect(() => {
    fetchFuncionarios();
    setupWebSocket();

    // Limpa o WebSocket ao desmontar o componente
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleCadastrar = () => {
    navigation.navigate("CadastrarFuncionario");
  };

  const handleEditar = () => {
    if (selectedFuncionario) {
      navigation.navigate("EditarFuncionario", {
        funcionario: selectedFuncionario,
      });
    }
  };

  const renderFuncionario = ({ item }) => {
    const isSelected =
      selectedFuncionario && selectedFuncionario.id === item.id;

    return (
      <TouchableOpacity
        style={[
          funcionariosStyles.card,
          isSelected && { backgroundColor: "#e3f7fa" }, // Aplica o fundo azul claro se o item estiver selecionado
        ]}
        onPress={() =>
          setSelectedFuncionario(
            isSelected ? null : item // Desmarca se for o mesmo item
          )
        } // Alterna a seleção do funcionário
      >
        <View style={funcionariosStyles.row}>
          {/* Coluna 1: Foto */}
          <View style={funcionariosStyles.imageColumn}>
            <Image
              source={{ uri: `data:image/jpeg;base64,${item.foto}` }}
              style={funcionariosStyles.thumbnail}
            />
          </View>

          {/* Barra Vertical */}
          <View style={funcionariosStyles.verticalBar}></View>

          {/* Coluna 2: Informações */}
          <View style={funcionariosStyles.detailsColumn}>
            <Text style={funcionariosStyles.label}>
              Nome:{" "}
              <Text style={funcionariosStyles.value}>
                {capitalizeFirstLetter(item.nome_completo)}
              </Text>
            </Text>
            <Text style={funcionariosStyles.label}>
              Cargo:{" "}
              <Text style={funcionariosStyles.value}>
                {capitalizeFirstLetter(item.cargo)}
              </Text>
            </Text>
            <Text style={funcionariosStyles.label}>
              Salário:{" "}
              <Text style={funcionariosStyles.value}>
                R$ {parseFloat(item.salario).toFixed(2)}
              </Text>
            </Text>
            <Text style={funcionariosStyles.label}>
              CPF: <Text style={funcionariosStyles.value}>{item.cpf}</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={funcionariosStyles.container}>
      {/* Botões Cadastrar e Editar */}
      <View style={funcionariosStyles.buttonContainer}>
        <TouchableOpacity
          style={funcionariosStyles.button}
          onPress={handleCadastrar}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={funcionariosStyles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            funcionariosStyles.button,
            !selectedFuncionario && funcionariosStyles.disabledButton,
          ]} // Aplica a cor cinza quando o botão está desabilitado
          onPress={handleEditar}
          disabled={!selectedFuncionario} // Desabilita o botão quando nenhum funcionário está selecionado
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={funcionariosStyles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>

      {/* Título da lista de funcionários */}
      <Text style={funcionariosStyles.title}>Lista de Funcionários</Text>

      {/* Lista de Funcionários */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={funcionarios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFuncionario}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
