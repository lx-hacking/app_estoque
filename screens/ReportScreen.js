import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";
import RNHTMLtoPDF from "react-native-html-to-pdf";

const ReportScreen = ({ navigation }) => {
  const [activeReport, setActiveReport] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [filteredInventoryData, setFilteredInventoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Relatórios",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const fetchSalesData = async () => {
    try {
      const response = await fetch("http://localhost:3000/salesReport");
      if (!response.ok) {
        throw new Error("Erro ao buscar relatório de vendas");
      }
      const data = await response.json();
      const formattedData = Object.keys(data).map((date) => ({
        title: date,
        data: data[date].items,
        total: data[date].total,
      }));
      setSalesData(formattedData);
    } catch (error) {
      console.error("Erro ao buscar relatório de vendas:", error);
    }
  };

  const fetchInventoryData = async () => {
    try {
      const response = await fetch("http://localhost:3000/inventoryReport");
      if (!response.ok) {
        throw new Error("Erro ao buscar relatório de estoque");
      }
      const data = await response.json();
      setInventoryData(data);
      setFilteredInventoryData(data);
    } catch (error) {
      console.error("Erro ao buscar relatório de estoque:", error);
    }
  };

  const fetchFinancialReport = async () => {
    try {
      console.log("Buscando relatório financeiro...");
    } catch (error) {
      console.error("Erro ao buscar relatório financeiro:", error);
    }
  };

  useEffect(() => {
    if (activeReport === "sales") {
      fetchSalesData();
    } else if (activeReport === "inventory") {
      fetchInventoryData();
    } else if (activeReport === "financial") {
      fetchFinancialReport();
    }
  }, [activeReport]);

  const sortInventoryData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];

      // Tratamento de ordenação específica para strings (alfabética) e números
      if (typeof valueA === "string" && typeof valueB === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      } else if (typeof valueA === "number" && typeof valueB === "number") {
        // Comparação numérica
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

    // Ordena a lista com base na nova configuração
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

  const renderSaleItem = ({ item }) => (
    <View style={styles.saleItem}>
      <Text style={styles.saleProductName}>
        Produto: <Text style={styles.boldText}>{item.produto}</Text>
      </Text>
      <Text style={styles.saleDescription}>Descrição: {item.descricao}</Text>
      <Text style={styles.saleText}>Quantidade: {item.quantidade}</Text>
      <Text style={styles.saleText}>
        Valor Total: R$ {item.valor_total.toFixed(2)}
      </Text>
    </View>
  );

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionTotal}>
        Total: R$ {section.total.toFixed(2)}
      </Text>
    </View>
  );

  const renderInventoryItem = ({ item }) => (
    <View style={styles.inventoryRow}>
      <Text
        style={[styles.inventoryColumn, styles.nameColumn, styles.boldText]}
      >
        {item.nome}
      </Text>
      <Text style={[styles.inventoryColumn, styles.descriptionColumn]}>
        {item.descricao}
      </Text>
      <Text
        style={[
          styles.inventoryColumn,
          styles.qtyColumn,
          item.quantidade < 10 && styles.lowStock,
        ]}
      >
        {item.quantidade}
      </Text>
    </View>
  );

  const getReportTitle = () => {
    switch (activeReport) {
      case "sales":
        return "Vendas";
      case "inventory":
        return "Estoque";
      case "financial":
        return "Financeiro";
      default:
        return "";
    }
  };

  const generatePDF = async () => {
    const htmlContent = `
      <h1>Relatório ${getReportTitle()}</h1>
      <p>Conteúdo do relatório...</p>
    `;

    try {
      const { uri } = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: `Relatorio_${getReportTitle()}`,
        base64: true,
      });

      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível gerar o PDF.");
    }
  };

  const generateExcel = async () => {
    const worksheet = XLSX.utils.json_to_sheet(inventoryData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

    const wbout = XLSX.write(workbook, {
      type: "base64",
      bookType: "xlsx",
    });

    const uri =
      FileSystem.cacheDirectory + `Relatorio_${getReportTitle()}.xlsx`;

    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(uri);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setActiveReport("sales")}
        >
          <Ionicons name="stats-chart" size={24} color="#fff" />
          <Text style={styles.buttonText}>Vendas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setActiveReport("inventory")}
        >
          <Ionicons name="cube" size={24} color="#fff" />
          <Text style={styles.buttonText}>Estoque</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setActiveReport("financial")}
        >
          <Ionicons name="wallet" size={24} color="#fff" />
          <Text style={styles.buttonText}>Financeiro</Text>
        </TouchableOpacity>
      </View>

      {activeReport && (
        <>
          <View style={styles.titleAndIcons}>
            <Text style={styles.reportTitle}>Relatório {getReportTitle()}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={generatePDF} style={styles.iconButton}>
                <Ionicons name="document" size={24} color="red" />
                <Text style={styles.iconLabel}>PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={generateExcel}
                style={styles.iconButton}
              >
                <Ionicons name="document-text" size={24} color="green" />
                <Text style={styles.iconLabel}>Excel</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.reportContainer}>
            {activeReport === "sales" && (
              <SectionList
                sections={salesData}
                keyExtractor={(item, index) => item.produto + index}
                renderItem={renderSaleItem}
                renderSectionHeader={renderSectionHeader}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    Nenhuma venda registrada.
                  </Text>
                }
                showsVerticalScrollIndicator={false}
              />
            )}
            {activeReport === "inventory" && (
              <>
                <View style={styles.searchContainer}>
                  <Ionicons name="search" size={16} color="#888" />
                  <TextInput
                    style={styles.searchInput}
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
                <View style={styles.inventoryHeader}>
                  <TouchableOpacity
                    style={[styles.inventoryColumnHeader, styles.nameColumn]}
                    onPress={() => toggleSort("nome")}
                  >
                    <Text style={styles.headerText}>
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
                      styles.inventoryColumnHeader,
                      styles.descriptionColumn,
                    ]}
                  >
                    <Text style={[styles.headerText, styles.centerText]}>
                      Descrição
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.inventoryColumnHeader, styles.qtyColumn]}
                    onPress={() => toggleSort("quantidade")}
                  >
                    <Text style={[styles.headerText, styles.centerText]}>
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
                    <Text style={styles.emptyText}>
                      Nenhum produto cadastrado no estoque.
                    </Text>
                  }
                  showsVerticalScrollIndicator={false}
                />
              </>
            )}
            {activeReport === "financial" && (
              <View style={styles.centeredText}>
                <Text>Relatório Financeiro ainda não implementado.</Text>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "tomato",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  titleAndIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: "row",
    gap: 15,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconLabel: {
    marginLeft: 5,
    fontSize: 14,
    color: "black",
  },
  reportTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  reportContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 5,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f1f1f1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  saleItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  saleProductName: {
    fontSize: 14,
    color: "#333",
  },
  boldText: {
    fontWeight: "bold",
  },
  saleDescription: {
    fontSize: 14,
    color: "#555",
    marginVertical: 2,
  },
  saleText: {
    fontSize: 14,
    color: "#333",
  },
  inventoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    backgroundColor: "#ececec",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  inventoryColumnHeader: {
    fontWeight: "bold",
    textAlign: "center",
  },
  inventoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  inventoryColumn: {
    textAlign: "center",
  },
  nameColumn: {
    width: "50%",
    textAlign: "left",
    paddingHorizontal: 5,
  },
  descriptionColumn: {
    width: "30%",
    textAlign: "center",
    paddingHorizontal: 5,
  },
  qtyColumn: {
    width: "20%",
    textAlign: "center",
  },
  lowStock: {
    color: "red",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  centeredText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    textAlign: "center",
  },
});

export default ReportScreen;
