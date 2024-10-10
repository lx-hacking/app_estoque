import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { cadastrarFuncionariosStyles } from "./CadastrarFuncionariosStyle"; // Estilo específico para cadastro
import { Picker } from "@react-native-picker/picker"; // Dropdown (picker) para o cargo

export default function EditarFuncionarioScreen({ route, navigation }) {
  const { funcionario } = route.params; // Dados do funcionário a ser editado

  const [image, setImage] = useState(
    funcionario.foto ? `data:image/jpeg;base64,${funcionario.foto}` : null
  );
  const [nomeCompleto, setNomeCompleto] = useState(
    funcionario.nome_completo || ""
  );
  const [dataNascimento, setDataNascimento] = useState(
    funcionario.data_nascimento || ""
  );
  const [cpf, setCpf] = useState(funcionario.cpf || "");
  const [email, setEmail] = useState(funcionario.email || "");
  const [cargo, setCargo] = useState(funcionario.cargo || "Vendedor");
  const [salario, setSalario] = useState(funcionario.salario || "");
  const [telefone, setTelefone] = useState(funcionario.telefone || "");
  const [pix, setPix] = useState(funcionario.pix || "");
  const [dataContratacao, setDataContratacao] = useState(
    funcionario.data_contratacao || ""
  );
  const [modalVisible, setModalVisible] = useState(false); // Estado do Modal de sucesso de edição
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Estado do Modal de deleção
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false); // Modal para confirmar exclusão
  const [dataNascimentoError, setDataNascimentoError] = useState("");
  const [dataContratacaoError, setDataContratacaoError] = useState("");
  const [campoErro, setCampoErro] = useState({}); // Estado para controle dos erros de campo vazio

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
      setImage(result.assets[0].uri);
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
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    if (dataNascimentoError || dataContratacaoError) {
      alert("Corrija os erros nas datas.");
      return;
    }

    const formData = {
      id: funcionario.id,
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
        `http://localhost:3000/editarFuncionario/${funcionario.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setModalVisible(true); // Exibe o modal de sucesso ao salvar
      } else {
        alert(result.error || "Erro ao editar funcionário.");
      }
    } catch (error) {
      alert("Erro ao se conectar com o servidor.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/deleteFuncionario/${funcionario.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setConfirmDeleteVisible(false); // Fecha o modal de confirmação
        setDeleteModalVisible(true); // Abre o modal de sucesso
      } else {
        alert("Erro ao excluir funcionário.");
      }
    } catch (error) {
      alert("Erro ao se conectar com o servidor.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={cadastrarFuncionariosStyles.container}>
        <Text style={cadastrarFuncionariosStyles.sectionTitle}>
          Editar Funcionário
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
            campoErro.nomeCompleto && { borderColor: "red" },
          ]}
        />
        {campoErro.nomeCompleto && (
          <Text style={cadastrarFuncionariosStyles.errorText}>
            Campo não preenchido
          </Text>
        )}

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
            campoErro.dataNascimento && { borderColor: "red" },
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
            campoErro.cpf && { borderColor: "red" },
          ]}
          maxLength={14}
        />
        {campoErro.cpf && (
          <Text style={cadastrarFuncionariosStyles.errorText}>
            Campo não preenchido
          </Text>
        )}

        <Text style={cadastrarFuncionariosStyles.label}>Cargo</Text>
        <View
          style={[
            cadastrarFuncionariosStyles.pickerContainer,
            campoErro.cargo && { borderColor: "red" },
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
            campoErro.salario && { borderColor: "red" },
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
            campoErro.dataContratacao && { borderColor: "red" },
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

        <Text style={cadastrarFuncionariosStyles.label}>E-mail</Text>
        <TextInput
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={[
            cadastrarFuncionariosStyles.input,
            campoErro.email && { borderColor: "red" },
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
            campoErro.telefone && { borderColor: "red" },
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
            campoErro.pix && { borderColor: "red" },
          ]}
        />
        {campoErro.pix && (
          <Text style={cadastrarFuncionariosStyles.errorText}>
            Campo não preenchido
          </Text>
        )}

        {/* Botões de ação */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={[
              cadastrarFuncionariosStyles.button,
              { backgroundColor: "red" },
            ]}
            onPress={() => setConfirmDeleteVisible(true)} // Abre o modal de confirmação de exclusão
          >
            <Text style={cadastrarFuncionariosStyles.buttonText}>Deletar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              cadastrarFuncionariosStyles.button,
              { backgroundColor: "blue" },
            ]}
            onPress={handleSubmit}
          >
            <Text style={cadastrarFuncionariosStyles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de confirmação de exclusão */}
      <Modal
        transparent={true}
        visible={confirmDeleteVisible}
        animationType="fade"
        onRequestClose={() => setConfirmDeleteVisible(false)}
      >
        <View style={cadastrarFuncionariosStyles.modalContainer}>
          <View style={cadastrarFuncionariosStyles.modalContent}>
            <Text style={cadastrarFuncionariosStyles.successText}>
              Tem certeza que deseja excluir este funcionário?
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={[
                  cadastrarFuncionariosStyles.button,
                  { backgroundColor: "#4BB543" },
                ]}
                onPress={handleDelete} // Exclui o funcionário
              >
                <Text style={cadastrarFuncionariosStyles.buttonText}>OK</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  cadastrarFuncionariosStyles.button,
                  { backgroundColor: "gray" },
                ]}
                onPress={() => setConfirmDeleteVisible(false)} // Fecha o modal de confirmação
              >
                <Text style={cadastrarFuncionariosStyles.buttonText}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de sucesso na exclusão */}
      <Modal
        transparent={true}
        visible={deleteModalVisible}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={cadastrarFuncionariosStyles.modalContainer}>
          <View style={cadastrarFuncionariosStyles.modalContent}>
            <Text style={cadastrarFuncionariosStyles.successText}>
              Funcionário excluído com sucesso!
            </Text>
            <TouchableOpacity
              style={[
                cadastrarFuncionariosStyles.button,
                { backgroundColor: "#4BB543" },
              ]}
              onPress={() => {
                setDeleteModalVisible(false);
                navigation.navigate("Funcionarios"); // Volta para a lista de funcionários
              }}
            >
              <Text style={cadastrarFuncionariosStyles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de sucesso na edição */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={cadastrarFuncionariosStyles.modalContainer}>
          <View style={cadastrarFuncionariosStyles.modalContent}>
            <Text style={cadastrarFuncionariosStyles.successText}>
              Alterações salvas com sucesso!
            </Text>
            <TouchableOpacity
              style={[
                cadastrarFuncionariosStyles.button,
                { backgroundColor: "#4BB543" },
              ]}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Funcionarios"); // Volta para a lista de funcionários
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
