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
    width: "90%", // O modal agora ocupa 90% da largura da tela
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%", // Limite da altura
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
    marginBottom: 10, // Espaçamento abaixo do nome do produto
  },
  modalColumnsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%", // Ocupa a largura total do modal
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
    marginBottom: 15, // Espaço entre os itens
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 10,
    width: "100%", // Ocupa 100% da largura do modal
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    width: "100%", // Alinha o nome para ocupar a largura total do item
  },
  cartItemDetails: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%", // Garante que os detalhes ocupem 100% da largura
  },
  cartItemImage: {
    width: 150,
    height: 150,
    marginRight: 10,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemVolume: {
    fontSize: 14,
    color: "#555",
  },
  cartItemQuantityControl: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  cartItemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right", // Alinhado à direita
    marginTop: 10,
    width: "100%", // O total do item ocupa a largura total e fica alinhado à direita
  },
  modalTotalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right", // Alinhado à direita
    marginTop: 20,
    width: "100%", // O total geral ocupa a largura total e fica alinhado à direita
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
