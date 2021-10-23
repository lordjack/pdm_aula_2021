import * as React from "react";
import { StyleSheet, TouchableOpacity, Alert, View, Animated } from "react-native";
import {
    Card,
    Divider,
    TextInput,
    Text,
    Title,
    Paragraph,
    Button,
    List,
    FAB, IconButton
} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "../components/firebase";
import Swipeable from 'react-native-gesture-handler/Swipeable'

export default class ContatoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: null,
            contatoList: [],
        };
    }
    async componentDidMount() {

        await this.getData();
        this.focusListener = this.props.navigation.addListener("focus", () => {
            this.getData();
        });
    }
    getData = async () => {

        var ref = firebase.database().ref("usuario");
        var vetorTemp = [];

        await ref.on("value", function (snapshot) {
            if (snapshot) {
                snapshot.forEach((child) => {
                    vetorTemp.push({
                        id: child.key,
                        nome: child.val().nome,
                        telefone: child.val().telefone,
                        image: child.val().image,
                        dataNascimento: child.val().dataNascimento
                    });
                    console.log(vetorTemp);
                })

            }
        }, (error) => {
            console.log("Error: " + error.code);
        });
        this.setState({ contatoList: vetorTemp });


        console.log(this.state.contatoList);
    };

    filtrar = () => {
        let novoContato = this.state.contatoList.filter(
            (item) => item.nome.length > 4
        );

        this.setState({ contatoList: novoContato });
    };

    remover = (key) => {
        var usuarioRef = firebase.database().ref("usuario/" + key);

        usuarioRef.remove().then(() => {
            console.log("Removido" + key);
        }).catch((error) => {
            console.log(error);
        });

        this.getData();
    };

    pesquisar = async (text) => {
        if (text != '') {
            const newArray = this.state.contatoList.filter((item) => {
                const itemDado = item.nome ? item.nome.toUpperCase() : ''.toUpperCase();
                //console.log(text);
                const textDado = text.toUpperCase();

                return itemDado.indexOf(textDado) > -1;
            });
            this.setState({
                contatoList: newArray,
                search: text,
            });
        } else {
            await this.getData();
            this.setState({ search: null });
        }

    }

    leftActions = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        });
        return (
            <View
                style={{ flex: 1, backgroundColor: 'blue', justifyContent: 'center' }}>
                <Animated.Text
                    style={{
                        color: 'white',
                        paddingHorizontal: 10,
                        fontWeight: '600',
                        transform: [{ scale }]
                    }}>
                    Ação Esquerda
                </Animated.Text>
            </View>
        )
    }

    rightActions = (progress, dragX, objContato) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [0.7, 0]
        })
        return (
            <>
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            "Remover Usuário",
                            "Deseja realmente remover o registro?",
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                },
                                { text: "OK", onPress: () => this.remover(objContato.id) }
                            ]
                        );
                    }
                    }
                >
                    <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center' }}>
                        <Animated.Text
                            style={{
                                color: 'white',
                                paddingHorizontal: 10,
                                fontWeight: '600',
                                transform: [{ scale }]
                            }}>
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
                    <View style={{ flex: 1, backgroundColor: 'green', justifyContent: 'center' }}>
                        <Animated.Text
                            style={{
                                color: 'white',
                                paddingHorizontal: 10,
                                fontWeight: '600',
                                transform: [{ scale }]
                            }}>
                            Editar
                        </Animated.Text>
                    </View>
                </TouchableOpacity>
            </>
        )
    }

    render() {
        return (
            <>


                {/*              <Button mode="contained" color="red" onPress={() => this.filtrar()}>
                    <Icon name="filter"></Icon> Filtrar
        </Button>

                <Button mode="contained" color="green" onPress={() => this.getData()}>
                    <Icon name="retweet"></Icon> Atualizar
        </Button> */}
                <TextInput
                    label="Pesquisar"
                    value={this.state.search}
                    onChangeText={(text) => this.pesquisar(text)}
                />
                <Card>
                    <Card.Content>
                        <List.Section>
                            <List.Subheader>Listagem Contatos</List.Subheader>

                            {this.state.contatoList?.map((item, i) => (
                                <>
                                    <Swipeable renderLeftActions={(progress, dragX) => this.leftActions(progress, dragX, item.id)}
                                        renderRightActions={(progress, dragX) => {
                                            let objContato = {
                                                id: item.id,
                                                nome: item.nome,
                                                telefone: item.telefone,
                                                dataNascimento: item.dataNascimento,
                                            };

                                            return this.rightActions(progress, dragX, objContato)
                                        }}>
                                        <Card>
                                            <Card.Title
                                                style={{ height: 150, backgroundColor: "#f8f9fa" }}
                                                right={(props) => (
                                                    <IconButton
                                                        {...props}
                                                        icon="dots-vertical"
                                                        onPress={() => {
                                                            Alert.alert(
                                                                "Informações",
                                                                "Arraste para o lado direito Edite ou Exclua, esquerdo para ver detalhes."
                                                            );
                                                        }}
                                                    />
                                                )}
                                                left={(props) => (
                                                    <View>
                                                        {item.image === 0 || item.image === undefined ? (
                                                            <Card.Cover
                                                                style={styles.imagemCard}
                                                                {...props}
                                                                source={require("../assets/favicon.png")}
                                                            />
                                                        ) : (
                                                            <Card.Cover
                                                                style={styles.imagemCard}
                                                                {...props}
                                                                source={{
                                                                    uri: item.image.uri,
                                                                }}
                                                            />
                                                        )}
                                                    </View>
                                                )}
                                            />
                                            {console.log(item.imagem)}
                                            <Divider />
                                            <Card.Content style={styles.descricao}>
                                                <Paragraph>{i + 1}</Paragraph>
                                                <Title>{item.nome}</Title>
                                                <Paragraph>{item.telefone}</Paragraph>
                                                <Paragraph>{item.dataNascimento}</Paragraph>
                                            </Card.Content>
                                            <Divider />
                                        </Card>
                                    </Swipeable>
                                </>
                            ))}
                        </List.Section>
                    </Card.Content>
                </Card>
                <FAB
                    style={styles.fab}
                    small
                    icon="plus"
                    onPress={() =>
                        this.props.navigation.navigate("Formulário Contato", {
                            key: "",
                            nome: "Jackson",
                            contato: "",
                            contatos: this.state.contatoList,
                        })
                    }
                />
            </>
        );
    }
}

const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "orange",
    },
    descricao: {
        marginLeft: 130,
        marginTop: 5,
        position: "absolute"
    },
    imagemCard: {
        width: 140,
        height: 140,
        marginLeft: -20
    }
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
