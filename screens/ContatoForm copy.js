import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import {
  Card,
  TextInput,
  Text,
  Button,
  List,
  Title,
  Paragraph,
  Divider,
} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ContatoForm({ route, navigation }) {
  const [id, setId] = useState(null);
  const [nome, setNome] = useState(null);
  const [telefone, setTelefone] = useState(null);
  const [dataNascimento, setDataNascimento] = useState(null);
  var [contatoList, setContatoList] = useState([]);
  var [contatoListTemp, setContatoListTemp] = useState([]);

  const salvar = async () => {
    let contato = {
      id: id,
      nome: nome,
      telefone: telefone,
      dataNascimento: dataNascimento,
    };
    let vetorCliente = [...contatoListTemp];
    if (contato.id != null) {
      vetorCliente[contato.id].nome = nome;
      vetorCliente[contato.id].telefone = telefone;
      vetorCliente[contato.id].dataNascimento = dataNascimento;

      // console.log(vetorCliente);
      setContatoList(vetorCliente);
      alert("teste2");
    } else {
      alert("teste3");
      vetorCliente.push(contato);
      /* 
      setContatoList(vetorCliente); */
      // this.forceUpdate();
      await setContatoList(vetorCliente);
      // console.log(vetorCliente);
      console.log(contatoList);

      /*  await setContatoList((prevState) => ({
        ...prevState,
        contato,
      })); */
    }

    // await console.log(contatoList);
    setNome(null);
    setTelefone(null);
    setDataNascimento(null);
  };

  useEffect(() => {
    // console.log(route.params);
    if (route.params) {
      let { contato, contatos } = route.params;

      if (contato.id != null) {
        contatos.map((item, index) => {
          if (index === contato.id) {
            setId(contato.id);
            setNome(contato.id);
            setTelefone(contato.telefone);
            setDataNascimento(contato.dataNascimento);
          }
        });
      }
      setContatoListTemp(contatos);
    }
  }, [contatoList]);

  return (
    <>
      <TextInput
        label="Nome"
        value={nome}
        onChangeText={(text) => setNome(text)}
      />
      <TextInput
        label="Telefone"
        value={telefone}
        onChangeText={(text) => setTelefone(text)}
      />
      <TextInput
        label="Data Nascimento"
        value={dataNascimento}
        onChangeText={(text) => setDataNascimento(text)}
      />
      <Text style={{ textAlign: "center", fontSize: 24 }}>
        {/*  {dataNascimento} */}
      </Text>
      <Button mode="contained" onPress={() => salvar()}>
        <Icon name="plus"></Icon> Salvar
      </Button>
      <Button
        mode="contained"
        color="green"
        onPress={() =>
          navigation.navigate("Listagem de Contatos", {
            contatos: contatoList,
          })
        }
      >
        <Icon name="arrow-left"></Icon>Voltar
      </Button>
    </>
  );
}
/* 
//exemplu usando função
function ContatoForm() {
  const [nome, setNome] = useState(0);
  const [telefone, setTelefone] = useState(0);
  const [dataNascimento, setDataNascimento] = useState(0);

  const salvar = () => {
    setDataNascimento(nome + telefone);
  };

  return (
    <View>
      <TextInput
        label="Número 01"
        name="nome"
        value={nome}
          onChange={ e => setNome(e.target.value)}
      />
      <TextInput
        label="Número 02"
        name="nome"
        value={telefone}
        onChange={ e => setTelefone(e.target.value)}
      />
      <Text>
        {dataNascimento}
      </Text>
      <Button mode="contained" onPress={salvar}>
        <Icon name="save" size={18} />
        Teste
      </Button>
    </View>
  );
} */
