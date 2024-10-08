import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { cadastrarFuncionariosStyles } from "./CadastrarFuncionariosStyle"; // Estilo específico para cadastro
import { Picker } from "@react-native-picker/picker"; // Dropdown (picker) para o cargo

export default function CadastrarFuncionariosScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("Vendedor");
  const [salario, setSalario] = useState("");
  const [dataContratacao, setDataContratacao] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // Estado do Modal
  const [dataNascimentoError, setDataNascimentoError] = useState(""); // Erro da data de nascimento
  const [dataContratacaoError, setDataContratacaoError] = useState(""); // Erro da data de contratação

  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri); // Ajuste para garantir que o URI correto seja capturado
    }
  };

  const handleCpfChange = (text) => {
    let cpfFormatted = text
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setCpf(cpfFormatted);
  };

  const handleDateChange = (text, setDate, setError) => {
    const dateFormatted = text
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{4})\d+?$/, "$1");
    setDate(dateFormatted);

    // Validação da data
    const [day, month, year] = dateFormatted.split("/").map(Number);
    const currentYear = new Date().getFullYear();

    let errorMessage = "";

    if (month > 12 || month < 1) {
      errorMessage = "Mês inválido.";
    } else if (day > 31 || day < 1) {
      errorMessage = "Dia inválido.";
    } else if (month === 2 && day > (isLeapYear(year) ? 29 : 28)) {
      errorMessage = "Fevereiro tem no máximo 29 dias.";
    } else if (
      (month === 4 || month === 6 || month === 9 || month === 11) &&
      day > 30
    ) {
      errorMessage = "Este mês tem no máximo 30 dias.";
    } else if (year > currentYear) {
      errorMessage = "Ano inválido.";
    }

    setError(errorMessage);
  };

  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const formatDate = (date) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`; // Formato YYYY-MM-DD
  };

  const handleSubmit = async () => {
    if (
      !nomeCompleto ||
      !dataNascimento ||
      !cpf ||
      !email ||
      !cargo ||
      !salario ||
      !dataContratacao ||
      !image
    ) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    if (dataNascimentoError || dataContratacaoError) {
      Alert.alert("Erro", "Corrija os erros nas datas.");
      return;
    }

    const formData = {
      nome_completo: nomeCompleto,
      data_nascimento: formatDate(dataNascimento), // Formata a data de nascimento
      cpf,
      email,
      cargo,
      salario,
      data_contratacao: formatDate(dataContratacao), // Formata a data de contratação
      image: image ? image.split(",")[1] : null, // Remove o prefixo base64
    };

    try {
      const response = await fetch(
        "http://localhost:3000/cadastrarFuncionario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setModalVisible(true); // Exibe o modal de sucesso
      } else {
        Alert.alert("Erro", result.error || "Erro ao cadastrar funcionário.");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao se conectar com o servidor.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={cadastrarFuncionariosStyles.container}>
        {/* Seção: Informações Pessoais */}
        <Text style={cadastrarFuncionariosStyles.sectionTitle}>
          Informações Pessoais
        </Text>
        <Text style={cadastrarFuncionariosStyles.label}>Foto</Text>
        <TouchableOpacity
          onPress={pickImage}
          style={cadastrarFuncionariosStyles.imagePicker}
        >
          {image ? (
            <Image
              source={{ uri: image }} // Mostra o thumbnail quando uma imagem é selecionada
              style={cadastrarFuncionariosStyles.thumbnail}
            />
          ) : (
            <Text style={cadastrarFuncionariosStyles.imagePickerText}>
              Escolher Foto
            </Text>
          )}
        </TouchableOpacity>

        <Text style={cadastrarFuncionariosStyles.label}>Nome Completo</Text>
        <TextInput
          placeholder="Nome Completo"
          value={nomeCompleto}
          onChangeText={setNomeCompleto}
          style={cadastrarFuncionariosStyles.input}
        />

        {/* Campo de Data de Nascimento */}
        <Text style={cadastrarFuncionariosStyles.label}>
          Data de Nascimento
        </Text>
        <TextInput
          placeholder="__/__/____"
          value={dataNascimento}
          onChangeText={(text) =>
            handleDateChange(text, setDataNascimento, setDataNascimentoError)
          }
          style={cadastrarFuncionariosStyles.input}
          maxLength={10}
          keyboardType="numeric"
        />
        {dataNascimentoError ? (
          <Text style={cadastrarFuncionariosStyles.errorText}>
            {dataNascimentoError}
          </Text>
        ) : null}

        <Text style={cadastrarFuncionariosStyles.label}>CPF</Text>
        <TextInput
          placeholder="___.___.___-__"
          value={cpf}
          onChangeText={handleCpfChange}
          keyboardType="numeric"
          style={cadastrarFuncionariosStyles.input}
          maxLength={14}
        />

        {/* Seção: Informações Cargo */}
        <Text style={cadastrarFuncionariosStyles.sectionTitle}>
          Informações Cargo
        </Text>

        <Text style={cadastrarFuncionariosStyles.label}>Cargo</Text>
        <View style={cadastrarFuncionariosStyles.pickerContainer}>
          <Picker
            selectedValue={cargo}
            onValueChange={(itemValue) => setCargo(itemValue)}
            style={cadastrarFuncionariosStyles.picker}
          >
            <Picker.Item label="Gerente" value="Gerente" />
            <Picker.Item label="Vendedor" value="Vendedor" />
          </Picker>
        </View>

        <Text style={cadastrarFuncionariosStyles.label}>Salário</Text>
        <TextInput
          placeholder="Salário"
          value={salario}
          onChangeText={setSalario}
          keyboardType="numeric"
          style={cadastrarFuncionariosStyles.input}
        />

        <Text style={cadastrarFuncionariosStyles.label}>
          Data de Contratação
        </Text>
        <TextInput
          placeholder="__/__/____"
          value={dataContratacao}
          onChangeText={(text) =>
            handleDateChange(text, setDataContratacao, setDataContratacaoError)
          }
          style={cadastrarFuncionariosStyles.input}
          maxLength={10}
          keyboardType="numeric"
        />
        {dataContratacaoError ? (
          <Text style={cadastrarFuncionariosStyles.errorText}>
            {dataContratacaoError}
          </Text>
        ) : null}

        {/* Seção: Outras Informações */}
        <Text style={cadastrarFuncionariosStyles.sectionTitle}>
          Outras Informações
        </Text>

        <Text style={cadastrarFuncionariosStyles.label}>E-mail</Text>
        <TextInput
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={cadastrarFuncionariosStyles.input}
        />

        {/* Botão Cadastrar */}
        <TouchableOpacity
          style={cadastrarFuncionariosStyles.button}
          onPress={handleSubmit}
        >
          <Text style={cadastrarFuncionariosStyles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de sucesso */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)} // Fecha o modal ao clicar fora
      >
        <View style={cadastrarFuncionariosStyles.modalContainer}>
          <View style={cadastrarFuncionariosStyles.modalContent}>
            <Text style={cadastrarFuncionariosStyles.successText}>
              Cadastrado com sucesso!
            </Text>
            <TouchableOpacity
              style={[
                cadastrarFuncionariosStyles.button,
                { backgroundColor: "#4BB543" }, // Definindo a cor do botão OK
              ]}
              onPress={() => {
                setModalVisible(false);
                navigation.goBack(); // Fecha o modal e volta para a tela anterior
              }}
            >
              <Text style={cadastrarFuncionariosStyles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
