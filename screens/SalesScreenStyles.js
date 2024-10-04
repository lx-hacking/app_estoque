import { StyleSheet } from "react-native";

const SalesScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#d3d3d3",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
  },
  productItem: {
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    position: "relative",
  },
  outOfStockItem: {
    backgroundColor: "#f0f0f0",
  },
  outOfStockBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderBottomLeftRadius: 8,
  },
  outOfStockText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  column: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  productText: {
    fontSize: 14,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%", // Garante que o modal ocupe a largura total da tela
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalProductName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  modalColumnsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  leftColumn: {
    marginRight: 10,
  },
  rightColumn: {
    flex: 1,
  },
  productImageModal: {
    width: 100,
    height: 100,
    borderRadius: 8,
    alignItems: "left",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  quantityButton: {
    padding: 6,
    borderRadius: 20,
  },
  increaseButton: {
    backgroundColor: "green",
  },
  decreaseButton: {
    backgroundColor: "red",
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  cartBadgeContainer: {
    position: "absolute",
    top: -10,
    right: 10,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadge: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  cartItemContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 10,
    width: "100%", // Garante que o item use toda a largura do modal
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left",
  },
  cartItemDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
    width: "100%", // Garante que as colunas da segunda linha ocupem toda a largura
  },
  cartItemImage: {
    width: 100,
    height: 100,
    marginRight: 10, // Espaçamento entre a imagem e o texto
  },
  cartItemVolume: {
    fontSize: 14,
    color: "#555",
    textAlign: "center", // Centraliza o texto na coluna
    flex: 1, // Faz com que o texto ocupe o espaço central
  },
  cartItemQuantityControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end", // Alinha os controles de quantidade à direita
  },
  cartItemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 10,
    width: "100%",
  },
  modalTotalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 20,
    width: "100%",
  },
  cartButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  clearCartButton: {
    backgroundColor: "tomato",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  clearCartButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  finalizeButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  finalizeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  updateButton: {
    backgroundColor: "tomato",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SalesScreenStyles;
