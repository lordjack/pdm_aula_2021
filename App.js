import React, { useEffect, useState } from "react";
import { View, Image } from 'react-native';
import {
    Provider as PaperProvider,
    DefaultTheme,
    Appbar,
    Menu, Button, Colors
} from "react-native-paper";
import { NavigationContainer, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import InicioScreens from "./screens/InicioScreens";
import ContatoForm from "./screens/ContatoForm";
import ContatoList from "./screens/ContatoList";
import RegistrarUsuarioForm from "./screens/RegistrarUsuarioForm";
import LoginForm from "./screens/LoginForm";
import MapaScreens from "./screens/MapaScreens";
import CameraScreen from "./screens/CameraScreen";
import LocalizacaoScreen from "./screens/LocalizacaoScreen";
import VideoScreen from "./screens/VideoScreen";


const Stack = createStackNavigator();

const theme = {
    ...DefaultTheme,
    //  dark: true,
    colors: {
        ...DefaultTheme.colors,
        primary: "orange",
        accent: "green",
    },
};

function CustomNavigationBar({ navigation, previous }) {
    const route = useRoute();
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <Appbar.Header>
            {previous ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title={route.name} />
            {previous && route.name != "Registrar Usuário" ? (
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <Appbar.Action icon="menu" color="white" onPress={openMenu} />
                    }
                >
                    <Menu.Item
                        onPress={() => {
                            console.log("Option 1 was pressed");
                        }}
                        title="Option 1"
                    />
                    <Menu.Item
                        onPress={() => {
                            console.log("Option 2 was pressed");
                        }}
                        title="Option 2"
                    />
                    <Menu.Item
                        onPress={() => {
                            console.log("Option 3 was pressed");
                        }}
                        title="Option 3"
                        disabled
                    />
                </Menu>
            ) : null}
        </Appbar.Header>
    );
}

export default function App() {

    const [appIsReady, setAppIsReady] = useState(true);

    useEffect(() => {
        try {
            setTimeout(() => setAppIsReady(false), 2000);
        } catch (error) {
            console.warn(e)
        }

    }, []);
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center'
            }}
        >
            {appIsReady ? <View
                style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}>
                <Button mode="contained" loading={true} color={Colors.blue800}>
                    Carredando
                </Button>
                <Image source={require('./assets/star-wars-cat-vs-dog.gif')} />
            </View> :
                <PaperProvider theme={theme}>
                    <NavigationContainer>
                        <Stack.Navigator
                            initialRouteName="Início"
                            screenOptions={{
                                header: (props) => <CustomNavigationBar {...props} />,
                            }}
                        >  
                            <Stack.Screen name="Início" component={InicioScreens} />
                            <Stack.Screen name="Formulário Contato" component={ContatoForm} />
                            <Stack.Screen name="Registrar Usuário" component={RegistrarUsuarioForm} />
                            <Stack.Screen name="Login" component={LoginForm} />
                            <Stack.Screen name="Listagem de Contatos" component={ContatoList} />
                            <Stack.Screen name="Mapa" component={MapaScreens} />
                            <Stack.Screen name="Camera" component={CameraScreen} />
                            <Stack.Screen name="Localização" component={LocalizacaoScreen} />
                            <Stack.Screen name="Video" component={VideoScreen} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </PaperProvider>
            }
        </View>

    );
}
