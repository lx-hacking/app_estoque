import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";
import ReportStyle from "./ReportStyle"; // Importa os estilos de um arquivo separado
import { useFocusEffect } from "@react-navigation/native"; // Para detectar quando a tela está em foco
import { useAuth } from "../AuthContext"; // Importar o contexto de autenticação

const ReportScreen = ({ navigation }) => {
  const [activeReport, setActiveReport] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [expandedSections, setExpandedSections] = useState({}); // Estado para controlar se as seções estão expandidas ou minimizadas
  const [inventoryData, setInventoryData] = useState([]);
  const [filteredInventoryData, setFilteredInventoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const ws = useRef(null); // Usando WebSocket
  const { funcionarioId } = useAuth(); // Obter o ID do funcionário logado

  // Função para conectar ao WebSocket e ouvir atualizações de estoque e vendas
  const connectWebSocket = () => {
    ws.current = new WebSocket("ws://localhost:3000");

    ws.current.onopen = () => {
      console.log(
        "Conectado ao WebSocket para atualizações de estoque e vendas."
      );
    };

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);

      // Atualizar a lista de estoque quando houver atualizações
      if (message.type === "UPDATE_STOCK") {
        fetchInventoryData(); // Atualiza os dados de estoque automaticamente
      }

      // Atualizar a lista de vendas quando houver uma nova venda
      if (message.type === "UPDATE_SALES") {
        fetchSalesData(); // Atualiza os dados de vendas automaticamente
      }
    };

    ws.current.onclose = () => {
      console.log("Conexão ao WebSocket fechada. Tentando reconectar...");
      setTimeout(connectWebSocket, 5000); // Tentar reconectar em 5 segundos
    };

    ws.current.onerror = (e) => {
      console.error("Erro no WebSocket:", e.message);
    };
  };

  // Fechar o WebSocket quando a tela não estiver mais em foco
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Atualiza os dados de estoque automaticamente quando a tela está focada
  useFocusEffect(
    React.useCallback(() => {
      if (activeReport === "inventory") {
        fetchInventoryData(); // Recarrega os dados de estoque ao retornar à tela
      }
    }, [activeReport])
  );

  // Função para buscar o relatório de estoque
  const fetchInventoryData = async () => {
    try {
      const response = await fetch("http://localhost:3000/inventoryReport");
      if (!response.ok) {
        throw new Error("Erro ao buscar relatório de estoque");
      }
      const data = await response.json();
      setInventoryData(data);
      setFilteredInventoryData(data); // Popula a lista filtrada com os dados recebidos
    } catch (error) {
      console.error("Erro ao buscar relatório de estoque:", error);
    }
  };

  // Função para buscar o relatório de vendas
  const fetchSalesData = async () => {
    try {
      const response = await fetch("http://localhost:3000/salesReport");
      if (!response.ok) {
        throw new Error("Erro ao buscar relatório de vendas");
      }
      const data = await response.json();
      // Formata os dados para que cada seção represente um dia de vendas
      const formattedData = Object.keys(data).map((date) => ({
        title: date, // A data da seção (DD/MM/AAAA)
        data: data[date].items.map((item) => ({
          ...item,
          vendedor: item.funcionario_nome, // Adiciona o nome do vendedor ao item
        })),
        total: data[date].total, // Total do dia
      }));
      setSalesData(formattedData);
    } catch (error) {
      console.error("Erro ao buscar relatório de vendas:", error);
    }
  };

  // Função para alternar entre expandir e minimizar as seções
  const toggleSection = (date) => {
    setExpandedSections((prev) => ({
      ...prev,
      [date]: !prev[date], // Alterna o estado expandido/minimizado
    }));
  };

  // Função para ordenar os dados de estoque
  const sortInventoryData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];

      if (typeof valueA === "string" && typeof valueB === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      } else if (typeof valueA === "number" && typeof valueB === "number") {
        valueA = parseFloat(valueA);
        valueB = parseFloat(valueB);
      }

      if (valueA < valueB) return direction === "asc" ? -1 : 1;
      if (valueA > valueB) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const toggleSort = (key) => {
    const newDirection =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";

    setSortConfig({ key, direction: newDirection });

    const sortedData = sortInventoryData(
      filteredInventoryData,
      key,
      newDirection
    );
    setFilteredInventoryData(sortedData);
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text === "") {
      setFilteredInventoryData(inventoryData);
    } else {
      const filteredData = inventoryData.filter((item) =>
        item.nome.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredInventoryData(filteredData);
    }
  };

  const renderInventoryItem = ({ item }) => (
    <View style={ReportStyle.inventoryRow}>
      <Text
        style={[
          ReportStyle.inventoryColumn,
          ReportStyle.nameColumn,
          ReportStyle.boldText,
        ]}
      >
        {item.nome}
      </Text>
      <Text
        style={[ReportStyle.inventoryColumn, ReportStyle.descriptionColumn]}
      >
        {item.descricao}
      </Text>
      <Text
        style={[
          ReportStyle.inventoryColumn,
          ReportStyle.qtyColumn,
          item.quantidade < 10 && ReportStyle.lowStock,
        ]}
      >
        {item.quantidade}
      </Text>
    </View>
  );

  const generateExcel = async () => {
    const worksheet = XLSX.utils.json_to_sheet(inventoryData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

    const wbout = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });
    const uri = FileSystem.cacheDirectory + `Relatorio_${activeReport}.xlsx`;

    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(uri);
  };

  // Renderiza um item de venda
  const renderSaleItem = ({ item }) => (
    <View style={ReportStyle.saleItem}>
      <Text style={ReportStyle.saleProductName}>
        Produto: <Text style={ReportStyle.boldText}>{item.produto}</Text>
      </Text>
      <Text style={ReportStyle.saleText}>Quantidade: {item.quantidade}</Text>
      <Text style={ReportStyle.saleText}>
        Total por Produto: R$ {item.valor_total.toFixed(2)}
      </Text>
      <Text style={ReportStyle.saleText}>
        Vendedor: <Text style={ReportStyle.boldText}>{item.vendedor}</Text>
      </Text>
    </View>
  );

  // Renderiza o cabeçalho de uma seção, com a data e o total de vendas do dia
  const renderSectionHeader = ({ section }) => (
    <View style={ReportStyle.sectionHeader}>
      <TouchableOpacity onPress={() => toggleSection(section.title)}>
        <Text style={ReportStyle.sectionTitle}>
          Data: {section.title} {/* Data no formato DD/MM/AAAA */}
        </Text>
      </TouchableOpacity>
      <Text style={ReportStyle.sectionTotal}>
        Total do Dia: R$ {section.total.toFixed(2)} {/* Total do dia */}
      </Text>
      <TouchableOpacity onPress={() => toggleSection(section.title)}>
        <Ionicons
          name={expandedSections[section.title] ? "chevron-up" : "chevron-down"}
          size={24}
          color="#333"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={ReportStyle.container}>
      <View style={ReportStyle.buttonContainer}>
        <TouchableOpacity
          style={ReportStyle.button}
          onPress={() => {
            setActiveReport("sales");
            fetchSalesData(); // Chamar a função para buscar os dados
          }}
        >
          <Ionicons name="stats-chart" size={24} color="#fff" />
          <Text style={ReportStyle.buttonText}>Vendas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={ReportStyle.button}
          onPress={() => setActiveReport("inventory")}
        >
          <Ionicons name="cube" size={24} color="#fff" />
          <Text style={ReportStyle.buttonText}>Estoque</Text>
        </TouchableOpacity>
      </View>

      {activeReport && (
        <>
          <View style={ReportStyle.titleAndIcons}>
            <Text style={ReportStyle.reportTitle}>
              Relatório {activeReport === "sales" ? "Vendas" : "Estoque"}
            </Text>
            <View style={ReportStyle.iconContainer}>
              <TouchableOpacity
                onPress={generateExcel}
                style={ReportStyle.iconButton}
              >
                <Ionicons name="document-text" size={24} color="green" />
                <Text style={ReportStyle.iconLabel}>Excel</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={ReportStyle.reportContainer}>
            {activeReport === "inventory" && (
              <>
                <View style={ReportStyle.searchContainer}>
                  <Ionicons name="search" size={16} color="#888" />
                  <TextInput
                    style={ReportStyle.searchInput}
                    placeholder="Buscar produto"
                    value={searchTerm}
                    onChangeText={handleSearch}
                  />
                  {searchTerm.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearch("")}>
                      <Ionicons name="close-circle" size={16} color="#888" />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={ReportStyle.inventoryHeader}>
                  <TouchableOpacity
                    style={[
                      ReportStyle.inventoryColumnHeader,
                      ReportStyle.nameColumn,
                    ]}
                    onPress={() => toggleSort("nome")}
                  >
                    <Text style={ReportStyle.headerText}>
                      Nome{" "}
                      <Ionicons
                        name={
                          sortConfig.key === "nome" &&
                          sortConfig.direction === "asc"
                            ? "arrow-up"
                            : "arrow-down"
                        }
                        size={16}
                        color={sortConfig.key === "nome" ? "tomato" : "black"}
                      />
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      ReportStyle.inventoryColumnHeader,
                      ReportStyle.descriptionColumn,
                    ]}
                  >
                    <Text
                      style={[ReportStyle.headerText, ReportStyle.centerText]}
                    >
                      Descrição
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      ReportStyle.inventoryColumnHeader,
                      ReportStyle.qtyColumn,
                    ]}
                    onPress={() => toggleSort("quantidade")}
                  >
                    <Text
                      style={[ReportStyle.headerText, ReportStyle.centerText]}
                    >
                      Qtd{" "}
                      <Ionicons
                        name={
                          sortConfig.key === "quantidade" &&
                          sortConfig.direction === "asc"
                            ? "arrow-up"
                            : "arrow-down"
                        }
                        size={16}
                        color={
                          sortConfig.key === "quantidade" ? "tomato" : "black"
                        }
                      />
                    </Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={filteredInventoryData}
                  keyExtractor={(item, index) => `${item.nome}-${index}`}
                  renderItem={renderInventoryItem}
                  ListEmptyComponent={
                    <Text style={ReportStyle.emptyText}>
                      Nenhum produto cadastrado no estoque.
                    </Text>
                  }
                  showsVerticalScrollIndicator={false}
                />
              </>
            )}
            {activeReport === "sales" && (
              <SectionList
                sections={salesData}
                keyExtractor={(item, index) => item.produto + index}
                renderItem={({ item, section }) =>
                  expandedSections[section.title]
                    ? renderSaleItem({ item })
                    : null
                } // Renderiza os itens apenas se a seção estiver expandida
                renderSectionHeader={renderSectionHeader} // Renderizando o cabeçalho da seção
                ListEmptyComponent={
                  <Text style={ReportStyle.emptyText}>
                    Nenhuma venda registrada.
                  </Text>
                }
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default ReportScreen;
