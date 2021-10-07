import * as React from "react";
import { TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import {
    Card,
    Divider,
    TextInput,
    Text,
    FAB,
    Title,
    Paragraph,
    Button,
    List,
} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "../components/firebase";

let { width } = Dimensions.get("window");
let numberGrid = 2;
let widthGrid = width / numberGrid;

export default class ContatoForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            nome: null,
            telefone: null,
            dataNascimento: null,
        };
    }
    async componentDidMount() {
        await this.carrregarDados();
    }

    salvar = async () => {
        let contato = {
            id: this.state.id,
            nome: this.state.nome,
            telefone: this.state.telefone,
            dataNascimento: this.state.dataNascimento,
        };

        if (contato.id != null) {

            var usuarioRef = firebase.database().ref("usuario/" + contato.id);

            usuarioRef.update({
                nome: contato.nome,
                telefone: contato.telefone,
                dataNascimento: contato.dataNascimento,
            }).then(() => {
                console.log("Atualizado");
            }).catch((error) => {
                console.log(error);
            });

        } else {

            var usuarioRef = firebase.database().ref("usuario");

            usuarioRef.push({
                nome: contato.nome,
                telefone: contato.telefone,
                dataNascimento: contato.dataNascimento,
            }).then(() => {
                console.log("inserido");
            }).catch((error) => {
                console.log(error);
            });
        }

        alert("teste");
        console.log(usuarioRef);

        this.setState({
            nome: null,
            telefone: null,
            dataNascimento: null,
        });

        this.props.navigation.navigate("Listagem de Contatos");
    };

    carrregarDados() {
        let { route } = this.props;

        if (route.params) {
            let { contato } = route.params;

            if (contato.id != null) {
                this.setState({
                    id: contato.id,
                    nome: contato.nome,
                    telefone: contato.telefone,
                    dataNascimento: contato.dataNascimento,
                });
            }
        }
        console.log(contato);
        console.log("teste rotas");
    }

    render() {
        const { route } = this.props;
        const { key, nome } = route.params;
        if (route.params) {
            console.log(key);
            console.log(nome);
        }
        return (
            <>
                <TouchableOpacity style={{
                    alignSelf: "flex-end",
                    alignItems: "center",
                    backgroundColor: 'transparent'
                }}
                    onPress={() => alert("Selecionar Imagem")}>
                    <Image style={styles.imagem} source={require("../assets/sem_imagem.png")} />

                </TouchableOpacity>
                <FAB style={styles.fab} icon="image-plus" onPress={() => alert("Selecionar Imagem")} />
                <Title style={{ color: "red", textAlign: "center" }}>
                    Bem Vindo {nome ? nome : ""}
                </Title>
                <TextInput
                    label="Nome"
                    value={this.state.nome}
                    onChangeText={(text) => this.setState({ nome: text })}
                />
                <TextInput
                    label="Telefone"
                    value={this.state.telefone}
                    onChangeText={(text) => this.setState({ telefone: text })}
                />
                <TextInput
                    label="Data Nascimento"
                    value={this.state.dataNascimento}
                    onChangeText={(text) => this.setState({ dataNascimento: text })}
                />

                <Button mode="contained" onPress={() => this.salvar()}>
                    <Icon name="save"></Icon> Salvar
                </Button>

                <Button
                    mode="contained"
                    color="green"
                    onPress={() =>
                        this.props.navigation.navigate("Listagem de Contatos", {
                            //contatos: this.state.contatoList,
                        })
                    }
                >
                    <Icon name="arrow-left"></Icon> Voltar
                </Button>
            </>
        );
    }
}
const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: widthGrid + 230,
        backgroundColor: "#09f",
    },
    imagem: {
        width: widthGrid + 170,
        height: widthGrid + 15,
        marginTop: 5,
        marginRight: 30,
        justifyContent: "center",
        padding: 3,
        borderRadius: 10,
    },
});
/*
//exemplu usando função
function ContatoForm() {
  const [nome, setNum01] = useState(0);
  const [telefone, setNum02] = useState(0);
  const [total, setTotal] = useState(0);

  const somar = () => {
    setTotal(nome + telefone);
  };

  return (
    <View>
      <TextInput
        label="Número 01"
        name="nome"
        value={nome}
          onChange={ e => setNum01(e.target.value)}
      />
      <TextInput
        label="Número 02"
        name="nome"
        value={telefone}
        onChange={ e => setNum02(e.target.value)}
      />
      <Text>
        {total}
      </Text>
      <Button mode="contained" onPress={somar}>
        <Icon name="save" size={18} />
        Teste
      </Button>
    </View>
  );
} */
