import { StyleSheet } from "react-native";

export const cadastrarFuncionariosStyles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  errorInput: {
    borderColor: "red",
  },
  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 40,
  },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
  },
  imagePickerText: {
    color: "#888",
  },
  thumbnail: {
    width: 150,
    height: 150,
    borderRadius: 5,
  },
  button: {
    height: 40,
    backgroundColor: "tomato",
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  successText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#4BB543",
  },
  errorText: {
    color: "red",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1, // Isso garante que o título ocupe todo o espaço e seja centralizado
  },
  backButton: {
    paddingRight: 10,
  },
});
