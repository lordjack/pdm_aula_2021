import React, {useState, useEffect} from "react";
import {TouchableOpacity, View, Image, StyleSheet, Dimensions,} from "react-native";
import {
    Card,
    TextInput,
    Text,
    Button,
    FAB,
    List,
    Title,
    Paragraph,
    Divider,
} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import firebase from "../components/firebase";

let {width} = Dimensions.get("window");
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
            contatoList: [],
            image: null,
            hasPermission: null,
        };
    }

    async componentDidMount() {
        await this.carregarDados();
        this.getPermissionAsync();

    }

    getPermissionAsync = async () => {
        if (Platform.OS === "ios") {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        }
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasPermission: status === "granted"});
    };


    selecionarImagem = async () => {
        this.getPermissionAsync();
        if (this.state.hasPermission) {
            let foto = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });

            console.log(foto);
            if (!foto.cancelled) {
                this.setState({image: foto.uri});
            }
        }
    };


    uploadImage = async (uri, tipoImagem /*, id */) => {
        //o fetch API fornece uma interface para buscar recursos como sistemas externos
        const responde = await fetch(uri);
        //representa um objeto do tipo arquivo referente a imagem que será salva
        const blob = await responde.blob(uri);
        //cria a url da imagem que será salva no firebase
        //  let path = "images/" + tipoImagem + "_" + id + ".jpg";
        let path = "images/" + tipoImagem + ".jpg";

        return new Promise((res, rej) => {
            firebase.storage().ref()
                .child(path) //passa a url onde será salvo a imagem
                .put(blob) // passa o arquivo que será salvo
                .then(function (snapshot) {
                    snapshot.ref.getDownloadURL().then(function (downloadUrl) {
                        //retorna um objeto com a url do arquivo e o endereço onde está a imagem
                        res({uri: downloadUrl, path: path});
                    });
                })
                .catch((error) => {
                    rej(error);
                });
        });
    };

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
            console.log("imagem");
            console.log(contato.imagem);
        }

        if (contato.id != null) {

            firebase
                .database()
                .ref('usuario/' + contato.id)
                .update({
                    nome: contato.nome,
                    telefone: contato.telefone,
                    dataNascimento: contato.dataNascimento,
                    imagem: contato.imagem,
                })
                .then((snapshot) => {
                    console.log("Atualizado! - " + snapshot.key);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {

            var usuarioRef = firebase.database().ref("usuario");

            usuarioRef.push({
                nome: contato.nome,
                telefone: contato.telefone,
                dataNascimento: contato.dataNascimento,
                imagem: contato.imagem,
            }).then((snapshot) => {
                    console.log("Inserido! - " + snapshot.key);
                }
            ).catch(
                (error) => console.log(error)
            );
        }


        //documentação: https://firebase.google.com/docs/database/admin/save-data#node.js
        /*
        set 	Gravar ou substituir dados em um caminho definido, como messages/users/<username>
        update 	Atualize algumas das chaves de um caminho definido sem substituir todos os dados.
        push 	Adicione a uma lista de dados no banco de dados. Sempre que um novo nó é enviado para uma lista, seu banco de dados gera uma chave única, como messages/users/<unique-user-id>/<username>
        */

        console.log(contato);

        //  await console.log(contato);
        //    await console.log(this.state.contatoList);
        this.setState({
            id: null,
            nome: null,
            telefone: null,
            dataNascimento: null,
        });

        this.props.navigation.navigate("Listagem de Contatos", {
            onGoBack: () => this.load(),
        });
    };

    carregarDados = async () => {
        let {route} = this.props;
        if (route.params) {
            let {contato, contatos} = route.params;

            if (contato.id != null) {
                // contatos.map((item, index) => {
                // if (index === contato.id) {
                this.setState({
                    id: contato.id,
                    nome: contato.nome,
                    telefone: contato.telefone,
                    dataNascimento: contato.dataNascimento,
                });
                //  }
                //  });
            }
            //  await this.setState({ contatoList: contatos });
            //    await console.log(contatos);
            //   await console.log("teste rotas");
        }
    };

    render() {
        return (
            <>
                {console.log(this.state.image)}
                <TouchableOpacity
                    style={{
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                    }}
                    onPress={() => this.selecionarImagem()}>
                    {this.state.image === null || this.state.image === undefined ? (
                        <Image
                            style={styles.imagem}
                            source={require("../assets/1024px-Item_sem_imagem.png")}
                        />
                    ) : (

                        <Image
                            style={styles.imagem}
                            source={{uri: this.state.image}}
                        />
                    )}
                </TouchableOpacity>
                <FAB
                    style={styles.fab}
                    icon="image-plus"
                    onPress={() => this.selecionarImagem()}
                />
                <TextInput
                    label="Nome"
                    value={this.state.nome}
                    onChangeText={(text) => this.setState({nome: text})}
                />
                <TextInput
                    label="Telefone"
                    value={this.state.telefone}
                    onChangeText={(text) => this.setState({telefone: text})}
                />
                <TextInput
                    label="Data Nascimento"
                    value={this.state.dataNascimento}
                    onChangeText={(text) => this.setState({dataNascimento: text})}
                />
                <Text style={{textAlign: "center", fontSize: 24}}>
                    {/*  {dataNascimento} */}
                </Text>
                <Button mode="contained" onPress={() => this.salvar()}>
                    <Icon name="plus"></Icon> Salvar
                </Button>
                <Button
                    mode="contained"
                    color="green"
                    onPress={() =>
                        this.props.navigation.navigate("Listagem de Contatos",
                            {contatos: "",}
                            // {contatos: this.state.contatoList, }
                        )
                        // this.props.navigation.goBack()
                    }
                >
                    <Icon name="arrow-left"></Icon>Voltar
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
function ContatoForm()
    {
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
                    onChange={e => setNome(e.target.value)}
                />
                <TextInput
                    label="Número 02"
                    name="nome"
                    value={telefone}
                    onChange={e => setTelefone(e.target.value)}
                />
                <Text>
                    {dataNascimento}
                </Text>
                <Button mode="contained" onPress={salvar}>
                    <Icon name="save" size={18}/>
                    Teste
                </Button>
            </View>
        );
    }
*/
