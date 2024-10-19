import { StyleSheet } from "react-native";

const AuthStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", // Mantém o conteúdo no topo
    padding: 0, // Garante que não há padding
    margin: 0, // Remove qualquer margem
  },

  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain", // Mantém a proporção da imagem
    marginTop: 0, // Garante que não há margem superior
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
