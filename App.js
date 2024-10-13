import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider } from "./AuthContext"; // Certifique-se de que o caminho está correto

// Importando telas
import HomeScreen from "./screens/HomeScreen";
import SalesScreen from "./screens/SalesScreen";
import InventoryScreen from "./screens/InventoryScreen";
import ReportScreen from "./screens/ReportScreen";
import AddProduct from "./screens/AddProduct";
import EditProduct from "./screens/EditProduct";
import FuncionariosScreen from "./screens/FuncionariosScreen";
import CadastrarFuncionariosScreen from "./screens/CadastrarFuncionariosScreen";
import EditarFuncionarioScreen from "./screens/EditarFuncionarioScreen";
import LoginScreen from "./screens/LoginScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function InventoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          title: "Estoque", // Exibe o título
          headerLeft: () => null, // Remove a seta de voltar
        }}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProduct}
        options={{ title: "Cadastrar Produto" }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProduct}
        options={{ title: "Editar Produtos" }}
      />
    </Stack.Navigator>
  );
}

function FuncionariosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="Funcionarios"
        component={FuncionariosScreen}
        options={{
          title: "Funcionários", // Exibe o título
          headerLeft: () => null, // Remove a seta de voltar
        }}
      />
      <Stack.Screen
        name="CadastrarFuncionario"
        component={CadastrarFuncionariosScreen}
        options={{ title: "Cadastrar Funcionário" }}
      />
      <Stack.Screen
        name="EditarFuncionario"
        component={EditarFuncionarioScreen}
        options={{ title: "Editar Funcionário" }}
      />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </AuthProvider>
  );
}

function MainTabs() {
  return (
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
        component={FuncionariosStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
