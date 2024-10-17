import { StyleSheet } from "react-native";

const AuthStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", // Muda para flex-start para alinhar ao topo
  },
  logo: {
    width: 200,
    height: 200,
    paddingTop: 50, // Adiciona paddingTop de 50
    resizeMode: "contain",
  },
  input: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "80%",
  },
  button: {
    backgroundColor: "tomato",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
    width: "80%",
    justifyContent: "center",
    alignSelf: "center", // Centraliza o botão
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  linkText: {
    color: "blue",
    marginVertical: 5,
    textDecorationLine: "underline",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  errorText: {
    color: "red", // Cor da mensagem de erro
    marginBottom: 8,
    fontSize: 14, // Tamanho da fonte
  },
  linkContainer: {
    alignItems: "center", // Centraliza os textos
    marginVertical: 10, // Adiciona espaço vertical ao redor dos links
  },
});

export default AuthStyle;
