import * as React from "react";
import { View } from "react-native";
import {
    Card,
    Divider,
    TextInput,
    Text,
    Title,
    Paragraph,
    Button,
    List, Snackbar, ActivityIndicator, Colors
} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "../components/firebase";

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: 'lordjackson@gmail.com', password: '123456', msg: null, visibleMsg: false, loading: false, };
    }
    async componentDidMount() {
        await this.carrregarDados();
    }
    onToggleSnackBar = () => {
        this.setState({ visibleMsg: !this.state.visibleMsg });
    }

    onDismissSnackBar = () => { this.setState({ visibleMsg: false }) };

    logar = async () => {
        const { email, password } = this.state;
        let msg = "";

        this.setState({
            loading: true
        });

        if (email !== null && password !== null) {
            await firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    console.log('Login ok');
                    this.props.navigation.navigate('Início');
                   /*  this.props.navigation.navigate('Root', {
                        screen: 'Início',
                    }); */
                    this.setState({ email: null, password: null, loading: false });
                })
                .catch((error) => {
                    console.log(error.code);
                    console.log(error.message);
                    if (error.code === 'auth/invalid-email') {
                        msg = "Email ou senha invalido, tenten novamente!";

                    } else if (error.code === 'auth/user-not-found') {
                        msg = "Usuário não encontrado!";

                    } else if (error.code === 'auth/wrong-password') {
                        msg = "Senha invalida, tenten novamente!";

                    } else if (error.code === 'auth/email-already-in-use') {
                        msg = "Email já esta cadastrado!";

                    } else if (error.code === 'auth/invalid-email') {
                        msg = "Email esta fora do formato padrão ou senha errada!";

                    } else if (error.code === 'auth/too-many-requests') {
                        msg = "O acesso a esta conta foi temporariamente desativado devido a muitas tentativas de login com falha. Você pode imediatamente restaurá-lo redefinindo sua senha ou você pode tentar novamente mais tarde.";

                    } else {
                        msg = error.message;
                    }
                    this.setState({ visibleMsg: true, msg: msg, loading: false });

                });
        } else {
            this.setState({ visibleMsg: true, msg: "Email ou senha vazios!", loading: false });
        }
    };
    render() {

        if (this.state.loading) {
            return <View style={{
                flex: 1,
                justifyContent: 'center',
                alignSelf: 'center',
            }}>
                <Button mode="contained" loading={true} color={Colors.blue800} >
                    Carregando
                </Button>
            </View>;
        }

        return (
            <>
                <Title style={{ color: "red", textAlign: "center" }}>
                    Bem Vindo ao nosso App
                </Title>
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

                <Button mode="contained" onPress={() => this.logar()}>
                    <Icon name="save"></Icon> Logar
                </Button>

                <Button
                    mode="contained"
                    color="green"
                    onPress={() =>
                        this.props.navigation.navigate("Registrar Usuário")
                    }
                >
                    <Icon name="user-plus"></Icon> Registrar
                </Button>
                <Snackbar
                    visible={this.state.visibleMsg}
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