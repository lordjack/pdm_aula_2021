import * as React from "react";
import {
    Card,
    Divider,
    TextInput,
    Text,
    Title,
    Paragraph,
    Button,
    List, Snackbar
} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "../components/firebase";

export default class RegistrarUsuarioForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { nome: '', cpf: '', telefone: '', email: '', password: '', visible: false, msg: "" };
    }

    onToggleSnackBar = () => {
        this.setState({ visible: !this.state.visible });
    }

    onDismissSnackBar = () => { this.setState({ visible: false }) };

    cadastrar = async () => {
        const { nome, cpf, telefone, email, password } = this.state;
        console.log(email);
        await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((registeredUser) => {
                firebase
                    .database()
                    .ref('usuario')
                    .push({
                        uid: registeredUser.user.uid,
                        nome: nome,
                        cpf: cpf,
                        telefone: telefone,
                        email: email,
                    })
                    .then(() => {
                        console.log('Inserido!');
                        this.forceUpdate();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                console.log('Criado com sucesso!');
                this.props.navigation.navigate('Login');
            })
            .catch((error) => {
                console.log(error.code);
                console.log(error.message);

                if (error.code === 'auth/email-already-in-use') {
                    this.setState({ visible: true, msg: "Email já esta cadastrado!" });

                } else if (error.code === 'auth/invalid-email') {
                    this.setState({ visible: true, msg: "Email esta fora do formato padrão!" });

                } else {
                    this.setState({ visible: true, msg: error.message });
                }
            });
    };
    render() {

        return (
            <>
                <TextInput
                    label="Nome"
                    value={this.state.nome}
                    onChangeText={(text) => this.setState({ nome: text })}
                />
                <TextInput
                    label="CPF"
                    value={this.state.cpf}
                    onChangeText={(text) => this.setState({ cpf: text })}
                />
                <TextInput
                    label="Telefone"
                    value={this.state.telefone}
                    onChangeText={(text) => this.setState({ telefone: text })}
                />
                <TextInput
                    label="Login Email"
                    value={this.state.email}
                    onChangeText={(text) => this.setState({ email: text })}
                />
                <TextInput
                    label="Senha"
                    value={this.state.password}
                    secureTextEntry={true}
                    onChangeText={(text) => this.setState({ password: text })}
                />
                <Button mode="contained" onPress={() => this.cadastrar()}>
                    <Icon name="save"></Icon> Cadastrar
                 </Button>

                <Button
                    mode="contained"
                    color="green"
                    onPress={() =>
                        this.props.navigation.goBack()
                    }
                >
                    <Icon name="arrow-left"></Icon> Voltar
                 </Button>
                <Snackbar
                    visible={this.state.visible}
                    onDismiss={() => this.onDismissSnackBar()}
                    action={{
                        label: 'Ok',
                        onPress: () => {
                            // Do something
                        },
                    }}>
                    {this.state.msg}
                </Snackbar>
            </>
        );
    }
}