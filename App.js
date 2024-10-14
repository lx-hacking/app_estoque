import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider } from "./AuthContext";

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
import RegisterScreen from "./screens/RegisterScreen";
import VerificationCodeScreen from "./screens/VerificationCodeScreen"; // Importando a tela de verificação

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack de autenticação com título centralizado e seta de retorno
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Login" }} // Título da tela de login
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Registrar" }} // Título da tela de registro
      />
      <Stack.Screen
        name="VerificationCode" // Adicionando a tela de verificação
        component={VerificationCodeScreen}
        options={{ title: "Verificação" }} // Título da tela de verificação
      />
    </Stack.Navigator>
  );
}

// Stack para as telas de Funcionários
function FuncionariosStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerTitleAlign: "center", headerShown: false }}
    >
      <Stack.Screen
        name="Funcionarios"
        component={FuncionariosScreen}
        options={{ title: "Funcionários" }} // Título da tela de funcionários
      />
      <Stack.Screen
        name="CadastrarFuncionario"
        component={CadastrarFuncionariosScreen}
        options={{ title: "Cadastrar Funcionário" }} // Título da tela de cadastro
      />
      <Stack.Screen
        name="EditarFuncionario"
        component={EditarFuncionarioScreen}
        options={{ title: "Editar Funcionário" }} // Título da tela de edição
      />
    </Stack.Navigator>
  );
}

// Stack para as telas de Estoque
function InventoryStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerTitleAlign: "center", headerShown: false }}
    >
      <Stack.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{ title: "Estoque" }} // Título da tela de estoque
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProduct}
        options={{ title: "Cadastrar Produto" }} // Título da tela de cadastro de produto
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProduct}
        options={{ title: "Editar Produtos" }} // Título da tela de edição de produtos
      />
    </Stack.Navigator>
  );
}

// Tabs principais do aplicativo
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
      <Tab.Screen name="Estoque" component={InventoryStack} />
      <Tab.Screen name="Funcionários" component={FuncionariosStack} />
    </Tab.Navigator>
  );
}

// Componente principal do aplicativo
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthStack} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
