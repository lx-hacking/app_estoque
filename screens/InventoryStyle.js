import { StyleSheet } from "react-native";

const InventoryStyle = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    padding: 10,
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
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  resetIcon: {
    marginLeft: 10,
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
  disabledButton: {
    backgroundColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "left",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f1f1f1",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  headerTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
  },
  flatListContainer: {
    paddingVertical: 10,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingLeft: 5,
  },
  selectedRow: {
    backgroundColor: "#e3f7fa",
  },
  column: {
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  productText: {
    fontSize: 14,
    paddingHorizontal: 5,
  },
  leftAlignedText: {
    textAlign: "left",
    paddingLeft: 5,
  },
  centerAlignedText: {
    textAlign: "center",
  },
  borderRight: {
    borderRightWidth: 0.5,
    borderRightColor: "#ccc",
  },
  lowQuantity: {
    color: "red",
    fontWeight: "bold",
  },
});

export default InventoryStyle;
