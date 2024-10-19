import { StyleSheet } from "react-native";

export const funcionariosStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    marginBottom: 25,
    borderRadius: 10,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2, // Aplica sombra no topo e no bottom
    },
    shadowOpacity: 0.3,
    shadowRadius: 5, // Aumenta o raio da sombra para suavizar
    elevation: 6, // Elevação para Android (sombra no topo e embaixo)
  },
  row: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center", // Centraliza os itens verticalmente
  },
  imageColumn: {
    width: "35%",
    justifyContent: "center",
    alignItems: "center",
  },
  detailsColumn: {
    width: "50%", // Reduz a largura para acomodar a barra
    justifyContent: "space-between", // Distribui os itens igualmente na coluna
    paddingLeft: 15, // Espaçamento entre a barra e as informações
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  verticalBar: {
    width: 10,
    height: 100,
    backgroundColor: "tomato",
    marginLeft: 20, // Espaçamento à esquerda da barra
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#666",
  },
  detailRow: {
    flex: 1,
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});
