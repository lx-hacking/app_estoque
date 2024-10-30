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
import { cadastrarFuncionariosStyles } from "./CadastrarFuncionariosStyle";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons"; // Biblioteca para ícones

export default function CadastrarFuncionariosScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("Vendedor");
  const [salario, setSalario] = useState("");
  const [telefone, setTelefone] = useState("");
  const [pix, setPix] = useState("");
  const [dataContratacao, setDataContratacao] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [dataNascimentoError, setDataNascimentoError] = useState("");
  const [dataContratacaoError, setDataContratacaoError] = useState("");
  const [campoErro, setCampoErro] = useState({}); // Estado para controlar os erros de campo vazio

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

  const handleTelefoneChange = (text) => {
    let telefoneFormatted = text
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{4})$/, "$1-$2");
    setTelefone(telefoneFormatted);
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
    return `${year}-${month}-${day}`;
  };

  const validarCampos = () => {
    const camposVazios = {};

    if (!nomeCompleto) camposVazios.nomeCompleto = true;
    if (!dataNascimento) camposVazios.dataNascimento = true;
    if (!cpf) camposVazios.cpf = true;
    if (!email) camposVazios.email = true;
    if (!cargo) camposVazios.cargo = true;
    if (!salario) camposVazios.salario = true;
    if (!telefone) camposVazios.telefone = true;
    if (!pix) camposVazios.pix = true;
    if (!dataContratacao) camposVazios.dataContratacao = true;

    setCampoErro(camposVazios);

    return Object.keys(camposVazios).length === 0;
  };

  const handleSubmit = async () => {
    if (!validarCampos()) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    if (dataNascimentoError || dataContratacaoError) {
      Alert.alert("Erro", "Corrija os erros nas datas.");
      return;
    }

    const formData = {
      nome_completo: nomeCompleto,
      data_nascimento: formatDate(dataNascimento),
      cpf,
      email,
      cargo,
      salario,
      telefone,
      pix,
      data_contratacao: formatDate(dataContratacao),
      image: image ? image.split(",")[1] : null,
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
        {/* Adicionando a seta de voltar e o título */}
        <View style={cadastrarFuncionariosStyles.headerContainer}>
          <TouchableOpacity
            style={cadastrarFuncionariosStyles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={cadastrarFuncionariosStyles.headerTitle}>
            Cadastrar Funcionário
          </Text>
        </View>

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
              source={{ uri: image }}
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
          style={[
            cadastrarFuncionariosStyles.input,
            campoErro.nomeCompleto && cadastrarFuncionariosStyles.errorInput,
          ]}
        />
        {campoErro.nomeCompleto && (
          <Text style={cadastrarFuncionariosStyles.errorText}>
            Campo não preenchido
          </Text>
        )}

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
          style={[
            cadastrarFuncionariosStyles.input,
            campoErro.dataNascimento && cadastrarFuncionariosStyles.errorInput,
          ]}
          maxLength={10}
          keyboardType="numeric"
        />
        {campoErro.dataNascimento && (
          <Text style={cadastrarFuncionariosStyles.errorText}>
            Campo não preenchido
          </Text>
        )}
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
          style={[
            cadastrarFuncionariosStyles.input,
            campoErro.cpf && cadastrarFuncionariosStyles.errorInput,
          ]}
          maxLength={14}
        />
        {campoErro.cpf && (
          <Text style={cadastrarFuncionariosStyles.errorText}>
            Campo não preenchido
          </Text>
        )}

        {/* Seção: Informações Cargo */}
        <Text style={cadastrarFuncionariosStyles.sectionTitle}>
          Informações Cargo
        </Text>

        <Text style={cadastrarFuncionariosStyles.label}>Cargo</Text>
        <View
          style={[
            cadastrarFuncionariosStyles.pickerContainer,
            campoErro.cargo && cadastrarFuncionariosStyles.errorInput,
          ]}
        >
          <Picker
            selectedValue={cargo}
            onValueChange={(itemValue) => setCargo(itemValue)}
            style={cadastrarFuncionariosStyles.picker}
          >
            <Picker.Item label="Gerente" value="Gerente" />
            <Picker.Item label="Vendedor" value="Vendedor" />
          </Picker>
        </View>
        {campoErro.cargo && (
          <Text style={cadastrarFuncionariosStyles.errorText}>
            Campo não preenchido
          </Text>
        )}

        <Text style={cadastrarFuncionariosStyles.label}>Salário</Text>
        <TextInput
          placeholder="Salário"
          value={salario}
          onChangeText={setSalario}
          keyboardType="numeric"
          style={[
            cadastrarFuncionariosStyles.input,
            campoErro.salario && cadastrarFuncionariosStyles.errorInput,
          ]}
        />
        {campoErro.salario && (
          <Text style={cadastrarFuncionariosStyles.errorText}>
            Campo não preenchido
          </Text>
        )}

        <Text style={cadastrarFuncionariosStyles.label}>
          Data de Contratação
        </Text>
        <TextInput
          placeholder="__/__/____"
          value={dataContratacao}
          onChangeText={(text) =>
            handleDateChange(text, setDataContratacao, setDataContratacaoError)
          }
          style={[
            cadastrarFuncionariosStyles.input,
            campoErro.dataContratacao && cadastrarFuncionariosStyles.errorInput,
          ]}
          maxLength={10}
          keyboardType="numeric"
        />
        {campoErro.dataContratacao && (
          <Text style={cadastrarFuncionariosStyles.errorText}>
            Campo não preenchido
          </Text>
        )}
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
          style={[
            cadastrarFuncionariosStyles.input,
            campoErro.email && cadastrarFuncionariosStyles.errorInput,
          ]}
        />
        {campoErro.email && (
          <Text style={cadastrarFuncionariosStyles.errorText}>
            Campo não preenchido
          </Text>
        )}

        <Text style={cadastrarFuncionariosStyles.label}>Telefone</Text>
        <TextInput
          placeholder="(xx) xxxxx-xxxx"
          value={telefone}
          onChangeText={handleTelefoneChange}
          keyboardType="phone-pad"
          style={[
            cadastrarFuncionariosStyles.input,
            campoErro.telefone && cadastrarFuncionariosStyles.errorInput,
          ]}
          maxLength={15}
        />
        {campoErro.telefone && (
          <Text style={cadastrarFuncionariosStyles.errorText}>
            Campo não preenchido
          </Text>
        )}

        <Text style={cadastrarFuncionariosStyles.label}>PIX</Text>
        <TextInput
          placeholder="Chave PIX"
          value={pix}
          onChangeText={setPix}
          style={[
            cadastrarFuncionariosStyles.input,
            campoErro.pix && cadastrarFuncionariosStyles.errorInput,
          ]}
        />
        {campoErro.pix && (
          <Text style={cadastrarFuncionariosStyles.errorText}>
            Campo não preenchido
          </Text>
        )}

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
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={cadastrarFuncionariosStyles.modalContainer}>
          <View style={cadastrarFuncionariosStyles.modalContent}>
            <Text style={cadastrarFuncionariosStyles.successText}>
              Cadastrado com sucesso!
            </Text>
            <TouchableOpacity
              style={[
                cadastrarFuncionariosStyles.button,
                { backgroundColor: "#4BB543", width: "100px" },
              ]}
              onPress={() => {
                setModalVisible(false);
                navigation.goBack();
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
