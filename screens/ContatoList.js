import * as React from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
    Animated,
} from "react-native";
import {
    Card,
    FAB,
    List,
    Title,
    Paragraph,
    Button,
    Divider, TextInput, Searchbar
} from "react-native-paper";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Icon from "react-native-vector-icons/FontAwesome";

import firebase from "../components/firebase";

export default class ContatoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            nome: null,
            telefone: null,
            dataNascimento: null,
            contatoList: [],
            search: null,
            loaded: false,
        };
    }
    async componentDidMount() {
        await this.load();
        //https://reactnativeforyou.com/how-to-make-the-screen-refresh-when-navigating-back-in-react-native/
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.load();
        });
    }
    load = async () => {
        var ref = firebase.database().ref("usuario");
        var vetorTemp = [];

        await ref.on("value", function (snapshot) {
            if (snapshot) {
                snapshot.forEach((child) => {
                    vetorTemp.push({
                        id: child.key,
                        nome: child.val().nome,
                        telefone: child.val().telefone,
                        dataNascimento: child.val().dataNascimento
                    });
                    //  console.log(vetorTemp);
                })
            }
        }, (error) => {
            console.log("Error: " + error.code);
        });
        await this.setState({ contatoList: vetorTemp });

        //   this.forceUpdate();
        console.log(this.state.contatoList);
    };


    pesquisar = async (text) => {
        if (text != '') {
            //alert('Pesquisando... ' + text);
            const newArray = this.state.contatoList.filter((item) => {
                const itemDado = item.nome ? item.nome.toUpperCase() : ''.toUpperCase();
                console.log(text);
                const textDado = text.toUpperCase();

                return itemDado.indexOf(textDado) > -1;
            });

            this.setState({
                contatoList: newArray,
                search: text,
            });
        } else {
            await this.load();
            this.setState({ search: null });
        }
    };

    /*
        async componentDidUpdate() {
            if (!loaded) {
                await this.load();
            }
        }
         async componentDidUpdate() {
          await this.carregarData();
        } */
    carregarData = async () => {
        let { route } = this.props;

        if (route.params) {
            let { contatos } = route.params;
            // console.log(contatos);

            await this.setState({
                contatoList: contatos,
            });
            this.forceUpdate();
            route.params = null;
            //   console.log(route.params);
        }
        // await console.log(this.state.contatoList);
        // await console.log(route.params);
    };

    filterDataContato = async () => {
        let novoContatos = await this.state.contatoList.filter((item) => {
            return item.nome.length > 4;
        });
        console.log(novoContatos);

        this.setState({
            contatoList: novoContatos,
        });
    };

    remover = async (key) => {
        //  const vetorCliente = this.state.contatoList;

        // vetorCliente.splice(key, 1);
        console.log(key);
        await firebase
            .database()
            .ref('usuario/' + key)
            .remove()
            .then(() => {
                console.log('Removido..');
            })
            .catch((error) => {
                console.log(error);
            });
        this.load();
    };
    leftActions = (progress, dragX, key) => {
        const scale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
            extrapolate: "clamp",
        });
        return (
            <View
                style={{ flex: 1, backgroundColor: "#09f", justifyContent: "center" }}
            >
                <Animated.Text
                    style={{
                        color: "white",
                        paddingHorizontal: 10,
                        fontWeight: "600",
                        transform: [{ scale }],
                    }}
                >
                    Detalhes
                </Animated.Text>
            </View>
        );
    };

    rightActions = (progress, dragX, objContato) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [0.7, 0],
        });
        return (
            <>
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            "Remover",
                            "Deseja realmente remover o registro?",
                            [
                                {
                                    text: "Cancelar",
                                    onPress: () => console.log("Cancelar Pressed"),
                                    style: "cancel",
                                },
                                {
                                    text: "OK",
                                    onPress: () => this.remover(objContato.id),
                                },
                            ],
                            { cancelable: false }
                        );
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "red",
                            justifyContent: "center",
                        }}
                    >
                        <Animated.Text
                            style={{
                                color: "white",
                                paddingHorizontal: 10,
                                fontWeight: "600",
                                transform: [{ scale }],
                            }}
                        >
                            Deletar
                        </Animated.Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate("Formulário Contato", {
                            contato: objContato
                        });
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "green",
                            justifyContent: "center",
                        }}
                    >
                        <Animated.Text
                            style={{
                                color: "white",
                                paddingHorizontal: 10,
                                fontWeight: "600",
                                transform: [{ scale }],
                            }}
                        >
                            Editar
                        </Animated.Text>
                    </View>
                </TouchableOpacity>
            </>
        );
    };

    render() {
        return (
            <>
                <TextInput
                    label="Pesquisar"
                    value={this.state.search}
                    onChangeText={(text) => this.pesquisar(text)}
                />

                {/*   <Searchbar
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                /> */}
                {/*
                <Button
                    mode="contained"
                    color="red"
                    onPress={() => this.filterDataContato()}
                >
                    <Icon name="plus"></Icon> Filtrar
        </Button>
                         <Button
                    mode="contained"
                    color="green"
                    onPress={() => this.load()}
                >
                    <Icon name="plus"></Icon> Atualizar
        </Button>

https://blog.jscrambler.com/creating-swipeable-gestures-with-react-native-gesture-handler/
 */}
                <Card>
                    <Card.Content>
                        <ScrollView>
                            <List.Section>
                                {this.state.contatoList.map((item, i) => (
                                    <>
                                        <Swipeable
                                            renderLeftActions={(progress, dragX) =>
                                                this.leftActions(progress, dragX, item.id)
                                            }
                                            renderRightActions={(progress, dragX) => {
                                                let objContato = {
                                                    id: item.id,
                                                    nome: item.nome,
                                                    telefone: item.telefone,
                                                    dataNascimento: item.dataNascimento,
                                                };

                                                return this.rightActions(progress, dragX, objContato)
                                            }
                                            }
                                        >
                                            <RectButton style={styles.leftAction} onPress={this.close}>
                                                <Divider />
                                                <Paragraph>{i + 1}</Paragraph>
                                                <Title>{item.nome}</Title>
                                                <Paragraph>{item.telefone}</Paragraph>
                                                <Paragraph>{item.dataNascimento}</Paragraph>
                                                <Divider />
                                            </RectButton>
                                        </Swipeable>
                                    </>
                                ))}
                            </List.Section>
                        </ScrollView>
                    </Card.Content>
                </Card>
                <FAB
                    style={styles.fab}
                    icon="plus"
                    onPress={() => {
                        this.props.navigation.navigate("Formulário Contato", {
                            contato: "",
                            contatos: this.state.contatoList,
                        });
                    }}
                />
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#fff",
        alignItems: "stretch",
        justifyContent: "flex-start",
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#09f",
    },
    imagemCard: {
        height: 50,
        width: 50,
        marginLeft: -10,
    },
    descricao: {
        marginLeft: 60,
        marginTop: -5,
        position: "absolute",
    },
    titulo: {
        fontWeight: "bold",
        fontSize: 20,
    },
});
/*

 <FlatList
  data={this.state.contatoList}
  keyExtractor={(index) => index.toString()}
  renderItem={({ item, index }) => (
    <>
      <TouchableOpacity onPress={() => this.remover(index)}>
        <Divider />
        <Title>{item.nome}</Title>
        <Paragraph>{item.telefone}</Paragraph>
        <Paragraph>{item.dataNascimento}</Paragraph>
        <Divider />
      </TouchableOpacity>
    </>
  )}
></FlatList>
//exemplu usando função
function ContatoList() {
  const [nome, setNome] = useState(0);
  const [telefone, setTelefone] = useState(0);
  const [dataNascimento, setDataNascimento] = useState(0);

  const dataContato = () => {
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
      <Button mode="contained" onPress={dataContato}>
        <Icon name="save" size={18} />
        Teste
      </Button>
    </View>
  );
} */
