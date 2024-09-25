import React from "react";
import { View, Text } from "react-native";

const ReportScreen = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center", // Centraliza o título no cabeçalho
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Relatório Screen</Text>
    </View>
  );
};

export default ReportScreen;
