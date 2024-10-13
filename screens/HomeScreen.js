import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../AuthContext"; // Importe o contexto de autenticação

const HomeScreen = ({ navigation }) => {
  const { logout } = useAuth(); // Obtenha a função de logout do contexto

  const handleLogout = () => {
    logout(); // Chama a função de logout
    navigation.navigate("Login"); // Navega para a tela de login
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Bem-vindo à HomeScreen!</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={{ color: "blue", marginTop: 20 }}>Logout</Text>{" "}
        {/* Texto de logout */}
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
