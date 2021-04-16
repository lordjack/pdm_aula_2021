import React, { useState } from "react";
import {
  Provider as PaperProvider,
  DefaultTheme,
  Appbar,
  Menu,
} from "react-native-paper";
import { NavigationContainer, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import InicioScreens from "./screens/InicioScreens";
import ContatoForm from "./screens/ContatoForm";

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "red",
    accent: "blue",
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
      {!previous ? (
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
  return (
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
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
