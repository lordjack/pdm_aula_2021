import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
    Card,
    Divider,
    TextInput,
    Text,
    Title,
    Paragraph,
    Button,
    List,
    FAB,
} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "../components/firebase";

export default class ContatoList2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contatoList: [],
        };
    }
    async componentDidMount() {
        await this.getData();
    }
    getData = async () => {

        var ref = firebase.database().ref("usuario");
        var vetorTemp = [];

        await ref.on("value", function (snapshot) {
            if (snapshot) {
                snapshot.forEach((child) => {
                    vetorTemp.push({
                        nome: child.val().nome,
                        telefone: child.val().telefone,
                        dataNascimento: child.val().dataNascimentos
                    });
                    console.log(vetorTemp);
                })

            }
        }, (error) => {
            console.log("Error: " + error.code);
        });
        this.setState({ contatoList: vetorTemp });

        this.forceUpdate();
        console.log(this.state.contatoList);
        return vetorTemp;
    };

    filtrar = () => {
        let novoContato = this.state.contatoList.filter(
            (item) => item.nome.length > 4
        );

        this.setState({ contatoList: novoContato });
    };

    remover = (key) => {
        let vetorContato = this.state.contatoList;

        vetorContato.splice(key, 1);

        alert("removendo..." + key);

        this.forceUpdate();
    };

    render() {
        return (
            <>
                <Button mode="contained" color="red" onPress={() => this.filtrar()}>
                    <Icon name="filter"></Icon> Filtrar
        </Button>

                <Button mode="contained" color="green" onPress={() => this.getData()}>
                    <Icon name="retweet"></Icon> Atualizar
        </Button>
                <Card>
                    <Card.Content>
                        <List.Section>
                            <List.Subheader>Listagem Contatos</List.Subheader>

                            {this.state.contatoList?.map((item, i) => (
                                <>
                                    <TouchableOpacity
                                        onLongPress={() => this.remover(i)}
                                        onPress={() => {
                                            let objContato = {
                                                id: i,
                                                nome: item.nome,
                                                telefone: item.telefone,
                                                dataNascimento: item.dataNascimento,
                                            };

                                            this.props.navigation.navigate("Formulário Contato", {
                                                contato: objContato,
                                                contatos: this.state.contatoList,
                                            });
                                        }}
                                    >
                                        <Divider />
                                        <Paragraph>{i + 1}</Paragraph>
                                        <Title>{item.nome}</Title>
                                        <Paragraph>{item.telefone}</Paragraph>
                                        <Paragraph>{item.dataNascimento}</Paragraph>
                                        <Divider />
                                    </TouchableOpacity>
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
