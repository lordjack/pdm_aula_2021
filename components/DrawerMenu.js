import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import InicioScreens from "../screens/InicioScreens";
import ContatoForm from "../screens/ContatoForm";
import ContatoList from "../screens/ContatoList";
/* import RegistrarUsuarioForm from "../screens/RegistrarUsuarioForm";
import LoginForm from "../screens/LoginForm"; */
import ExemploMapa from "../screens/ExemploMapa";
import CameraScreen from "../screens/CameraScreen";
import LocationScreen from "../screens/LocationScreen";
import VideoScreen from "../screens/VideoScreen";

const Drawer = createDrawerNavigator();
//Colors.yellow800
function DrawerMenu() {
    return (
        <Drawer.Navigator initialRouteName="Início" screenOptions={{
            headerShown: true,
            headerStyle: {
                backgroundColor: '#a34456',
            },
            //header: (props) => header(props)
            //    header: (props) => <CustomNavigationBar {...props} />
        }}>
            {/* <Drawer.Screen name="Início" component={Root} 
<Drawer.Screen name="Login" component={LoginForm} />/> 
        <Drawer.Screen name="Início" component={InicioScreens} />
        <Drawer.Screen name="Registrar Usuário" component={RegistrarUsuarioForm} />
*/}
            <Drawer.Screen name="Início" component={InicioScreens} />
            <Drawer.Screen name="Formulário Contato" component={ContatoForm} />
            <Drawer.Screen name="Listagem de Contatos" component={ContatoList} />
            <Drawer.Screen name="Exemplo Mapa" component={ExemploMapa} />
            <Drawer.Screen name="Câmera" component={CameraScreen} />
            <Drawer.Screen name="Localização" component={LocationScreen} />
            <Drawer.Screen name="Video" component={VideoScreen} />
        </Drawer.Navigator>);
}

export default DrawerMenu;