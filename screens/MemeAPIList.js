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
import { ScrollView } from "react-native-gesture-handler";

export default class MemeAPIList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: null,
            contatoList: [],
        };
    }
    async componentDidMount() {

        await this.load();
        this.focusListener = this.props.navigation.addListener("focus", () => {
            this.load();
        });
    }
    load = async () => {

        try {

            const response = await fetch('https://api.imgflip.com/get_memes');
            const json = await response.json();
            // console.log(json.data.memes);

            this.setState({ contatoList: json.data.memes });
        } catch (error) {
            console.error(error);
        }

        //   console.log(this.state.contatoList);
    };


    pesquisar = async (text) => {
        if (text != '') {
            const newArray = this.state.contatoList.filter((item) => {
                const itemDado = item.name ? item.name.toUpperCase() : ''.toUpperCase();
                //console.log(text);
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

    }



    render() {
        return (
            <>

                <TextInput
                    label="Pesquisar"
                    value={this.state.search}
                    onChangeText={(text) => this.pesquisar(text)}
                />
                <Card>
                    <Card.Content>
                        <ScrollView>
                            <List.Section>
                                <List.Subheader>Listagem Contatos</List.Subheader>

                                {this.state.contatoList?.map((item, i) => (
                                    <>
                                        <Swipeable >
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

                                                            <Card.Cover
                                                                style={styles.imagemCard}
                                                                {...props}
                                                                source={{
                                                                    uri: item.url,
                                                                }}
                                                            />

                                                        </View>
                                                    )}
                                                />
                                                <Divider />
                                                <Card.Content style={styles.descricao}>
                                                    <Paragraph>{i + 1}</Paragraph>
                                                    <Title>{item.name}</Title>
                                                </Card.Content>
                                                <Divider />
                                            </Card>
                                        </Swipeable>
                                    </>
                                ))}
                            </List.Section>
                        </ScrollView>
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
