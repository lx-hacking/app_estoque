import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Importando telas
import HomeScreen from "./screens/HomeScreen";
import SalesScreen from "./screens/SalesScreen";
import InventoryScreen from "./screens/InventoryScreen";
import ReportScreen from "./screens/ReportScreen";

// Criando o Bottom Tab Navigator
const Tab = createBottomTabNavigator();

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
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Vendas" component={SalesScreen} />
        {/* Invertendo a ordem de "Estoque" e "Relatório" */}
        <Tab.Screen name="Relatório" component={ReportScreen} />
        <Tab.Screen name="Estoque" component={InventoryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
