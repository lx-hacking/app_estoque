import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

// Importando telas
import HomeScreen from "./screens/HomeScreen";
import SalesScreen from "./screens/SalesScreen";
import InventoryScreen from "./screens/InventoryScreen";
import ReportScreen from "./screens/ReportScreen";
import AddProduct from "./screens/AddProduct"; // Tela de cadastro de produto
import EditProduct from "./screens/EditProduct"; // Tela de edição de produto
import FuncionariosScreen from "./screens/FuncionariosScreen"; // Tela de funcionários
import CadastrarFuncionariosScreen from "./screens/CadastrarFuncionariosScreen"; // Tela de cadastro de funcionários

// Criando o Bottom Tab Navigator e o Stack Navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator para gerenciar as telas relacionadas ao estoque e funcionários
function InventoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          title: "Estoque",
        }}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProduct}
        options={{
          title: "Cadastrar Produto",
        }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProduct}
        options={{
          title: "Editar Produtos",
        }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator para gerenciar as telas relacionadas aos funcionários
function FuncionariosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="Funcionarios"
        component={FuncionariosScreen}
        options={{
          title: "Funcionários",
        }}
      />
      <Stack.Screen
        name="CadastrarFuncionario"
        component={CadastrarFuncionariosScreen}
        options={{
          title: "Cadastrar Funcionário",
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Vendas") {
              iconName = focused ? "cash" : "cash-outline";
            } else if (route.name === "Estoque") {
              iconName = focused ? "albums" : "albums-outline";
            } else if (route.name === "Relatório") {
              iconName = focused ? "stats-chart" : "stats-chart-outline";
            } else if (route.name === "Funcionários") {
              iconName = focused ? "people" : "people-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Vendas" component={SalesScreen} />
        <Tab.Screen name="Relatório" component={ReportScreen} />
        <Tab.Screen
          name="Estoque"
          component={InventoryStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Funcionários"
          component={FuncionariosStack} // Alteração para utilizar o Stack Navigator dos funcionários
          options={{ headerShown: false }} // Remove o cabeçalho do Stack Navigator no Tab Navigator
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
