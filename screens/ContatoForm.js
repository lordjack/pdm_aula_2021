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
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

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
            image: null,
            hasPermission: null,
        };
    }
    async componentDidMount() {
        await this.carrregarDados();
        this.getPermission();
    }

    getPermission = async () => {
        if (Platform.OS === 'ios') {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Hey! You might want to enable notifications for my app, they are good.');
            }
        }
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasPermission: status === "granted" });
    };

    selecionarImagem = async () => {
        this.getPermission();

        if (this.state.hasPermission) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            console.log(result);

            if (!result.cancelled) {
                console.log(result.uri);
                this.setState({ image: result.uri });
            }
        }

    }

    uploadImage = async (uri, tipoImagem) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob(uri);

            var now = new Date();

            var datetime = now.getFullYear() + '_' + (now.getMonth() + 1) + '_' + now.getDate();
            datetime += '_' + now.getHours() + '_' + now.getMinutes() + '_' + now.getSeconds();

            let path = "imagem/" + tipoImagem + '_' + datetime + ".jpg";

            return new Promise((res, rej) => {
                firebase.storage().ref()
                    .child(path)
                    .put(blob)
                    .then((snapshot) => {
                        snapshot.ref.getDownloadURL().then((downloadUrl) => {
                            res({ uri: downloadUrl, path: path })
                        })
                    })
                    .catch((error) => {
                        rej(error)
                    })
            })
        }
        catch (error) {
            console.error(error);
        }
    }

    salvar = async () => {
        let contato = {
            id: this.state.id,
            nome: this.state.nome,
            telefone: this.state.telefone,
            dataNascimento: this.state.dataNascimento,
            imagem: this.state.image,
        };

        if (contato.imagem) {

            contato.imagem = await this.uploadImage(this.state.image, "contato");
        }

        if (contato.id != null) {

            var usuarioRef = firebase.database().ref("usuario/" + contato.id);

            usuarioRef.update({
                nome: contato.nome,
                telefone: contato.telefone,
                dataNascimento: contato.dataNascimento,
                image: contato.imagem,
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
                image: contato.imagem,
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
                    image: contato.image,
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
                {console.log(this.state.image)}
                <TouchableOpacity style={{
                    alignSelf: "flex-end",
                    alignItems: "center",
                    backgroundColor: 'transparent'
                }}
                    onPress={() => this.selecionarImagem()}>

                    {this.state.image === null || this.state.image === undefined ?
                        <Image style={styles.imagem} source={require("../assets/sem_imagem.png")} />
                        :
                        <Image style={styles.imagem} source={{ uri: this.state.image.uri === undefined ? this.state.image : this.state.image.uri }} />

                    }

                </TouchableOpacity>
                <FAB style={styles.fab} icon="image-plus" onPress={() => this.selecionarImagem()} />
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
