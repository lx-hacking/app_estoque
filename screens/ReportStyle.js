import { StyleSheet } from "react-native";

const ReportStyle = StyleSheet.create({
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

export default ReportStyle;
