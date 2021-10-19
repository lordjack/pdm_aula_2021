import React, { useCallback, useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import {
    Button,
    Colors
} from "react-native-paper";
import {
    Provider as PaperProvider,
    DefaultTheme,
    Appbar,
    Menu,
} from "react-native-paper";
import { NavigationContainer, useRoute, useFocusEffect } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from '@react-navigation/drawer';

import LoginForm from "./screens/LoginForm";
import RegistrarUsuarioForm from "./screens/RegistrarUsuarioForm";

import { DrawerContent } from './screens/DrawerContent';
import InicioScreens from "./screens/InicioScreens";
import ContatoForm from "./screens/ContatoForm";
import ContatoList from "./screens/ContatoList";
import ExemploMapa from "./screens/ExemploMapa";
import CameraScreen from "./screens/CameraScreen";
import LocationScreen from "./screens/LocationScreen";
import VideoScreen from "./screens/VideoScreen";
//import DrawerMenu from "./components/DrawerMenu";

import firebase from "./components/firebase";

function SplashScreen() {
    return (
        <View>
            <Text>Loading...</Text>
        </View>
    );
}
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
    console.log("Menu2");
    console.log(route);
    console.log((route.name != "Login" || route.name != "Registrar Usuário"));
    return (
        <Appbar.Header>
            {previous ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title={route.name} />
            {(route.name != "Login" || route.name != "Registrar Usuário") ? (
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

function Root() {
    return (<Stack.Navigator
        initialRouteName="Início"
        screenOptions={{
            header: (props) => <CustomNavigationBar {...props} />,
        }}
    >
        <Stack.Screen name="Início" component={InicioScreens} />
        <Stack.Screen name="Formulário Contato" component={ContatoForm} />
        <Stack.Screen name="Listagem de Contatos" component={ContatoList} />
        <Stack.Screen name="Registrar Usuário" component={RegistrarUsuarioForm} />
        <Stack.Screen name="Login" component={LoginForm} />
        <Stack.Screen name="Exemplo Mapa" component={ExemploMapa} />
        <Stack.Screen name="Câmera" component={CameraScreen} />
        <Stack.Screen name="Localização" component={LocationScreen} />
        <Stack.Screen name="Video" component={VideoScreen} />

    </Stack.Navigator>);
}
/* const authScreens = {
    Login: LoginForm,
    'Registrar Usuário': RegistrarUsuarioForm,
};

const commonScreens = {
    Início: InicioScreens,
    'Formulário Contato': ContatoForm,
};
 */

function DrawerMenu() {
    return (
        <Drawer.Navigator initialRouteName="Login" screenOptions={{
            headerShown: true,
            headerStyle: {
                backgroundColor: Colors.yellow800,
            },
            header: (props) => <CustomNavigationBar {...props} />
        }}>
            <Drawer.Screen name="Início" component={InicioScreens} />
            <Drawer.Screen name="Formulário Contato" component={ContatoForm} />
            <Drawer.Screen name="Listagem de Contatos" component={ContatoList} />
            <Drawer.Screen name="Exemplo Mapa" component={ExemploMapa} />
            <Drawer.Screen name="Câmera" component={CameraScreen} />
            <Drawer.Screen name="Localização" component={LocationScreen} />
            <Drawer.Screen name="Video" component={VideoScreen} />
        </Drawer.Navigator>);
}

function DrawerMenuLogin() {
    return (
        <Drawer.Navigator screenOptions={{
            headerShown: true,
            headerStyle: {
                backgroundColor: Colors.yellow800,
            },
        }}>
            <Drawer.Screen name="Login" component={LoginForm} />
            <Drawer.Screen name="Registrar Usuário" component={RegistrarUsuarioForm} />
        </Drawer.Navigator>
    );
}
function header({ scene }) {
    const { options } = scene.descriptor;
    const title =
        options.headerTitle !== undefined
            ? options.headerTitle
            : options.title !== undefined
                ? options.title
                : scene.route.name;
    console.log(scene)
    console.log(title)

    return (
        <Appbar.Header>
            {scene ? <Appbar.BackAction onPress={() => alert("teste1")} /> : null}
            <Appbar.Content title={scene.route.name} />
            {(scene.route.name != "Login" || scene.route.name != "Registrar Usuário") ? (
                <Menu
                    visible={true}
                    onDismiss={false}
                    anchor={
                        <Appbar.Action icon="menu" color="white" onPress={() => alert("teste2")} />
                    }
                >
                </Menu>
            ) : null}
        </Appbar.Header>
        /*  <Header
             title={title}
             leftButton={
                 <DrawerToggleButton
                     onPress={scene.descriptor.navigation.toggleDrawer}
                 />
             }
             style={options.headerStyle}
         /> */
    );
};


function Logout(props) {

    firebase.auth().signOut().then(() => {
        setAppIsReady(false);

    }).catch((error) => {
        console.log(error);
    });

    props.navigation.navigate('Login');
    return null;
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator()
const RootStack = createStackNavigator();

export default function App({ navigation }) {
    const [appIsReady, setAppIsReady] = useState(false);

    /*  const user = firebase.auth().currentUser;
     if (user !== null) {
         console.log("teste_useeffect");
 
         setAppIsReady(true);
         console.log(user.displayName);
     } */
    React.useEffect((props) => {
        /*  console.log("teste_useeffect_off1");
         const user = firebase.auth().currentUser;
         console.log(user);
         if (user != null) {
 
             const unsubscribe = props.navigation.addListener('focus', () => {
                 console.log("teste_useeffect_on1");
 
                 setAppIsReady(true);
                 console.log(user.displayName);
             });
             return unsubscribe;
 
         } */

    });

    console.log(appIsReady);

    const authScreens = {
        Login: LoginForm,
        'Registrar Usuário': RegistrarUsuarioForm,
    };

    const userScreens = {
        Início: InicioScreens,
        'Formulário Contato': ContatoForm,
    };

    /*   <Drawer.Screen name="Início" component={InicioScreens} />
                <Drawer.Screen name="Formulário Contato" component={ContatoForm} />
                <Drawer.Screen name="Listagem de Contatos" component={ContatoList} />
                <Drawer.Screen name="Exemplo Mapa" component={ExemploMapa} />
                <Drawer.Screen name="Câmera" component={CameraScreen} />
                <Drawer.Screen name="Localização" component={LocationScreen} />
                <Drawer.Screen name="Video" component={VideoScreen} />
     */
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
            }}>
            {/*   {!appIsReady ?
                (<View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignSelf: 'center',
                }}>
                    <Button loading={true} color={Colors.blue800} >
                        Carregando
                    </Button>
                    <Image source={require('./assets/star-wars-cat-vs-dog.gif')} />
                </View>
                )
                : */}
            <PaperProvider theme={theme}>
                <NavigationContainer>
                    <Root />
                    {/*      <Drawer.Navigator initialRouteName="Login" screenOptions={{
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: Colors.yellow800,
                        },
                        header: (props) => <CustomNavigationBar {...props} />
                    }}>
                        {Object.entries({
                            // Use the screens normally
                            //  ...commonScreens,
                            // Use some screens conditionally based on some condition
                            ...(appIsReady ? userScreens : authScreens),
                        }).map(([name, component]) => (
                            <Drawer.Screen name={name} component={component} />
                        ))}
                    </Drawer.Navigator> */}
                </NavigationContainer>
            </PaperProvider>
            {/*   } */}
        </View>
    );
}
