import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Text, View, Image, TextInput, StyleSheet } from "react-native";
//import Hello from "./screens/Hello";
//import Flex from "./Flex";
import {
    Avatar,
    Button,
    Card,
    Title,
    Paragraph,
    Provider as PaperProvider,
    DefaultTheme,
} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "red",
        accent: "blue",
    },
};

export default function App(props) {
    /*  const { route } = this.props;
  
    if (route.params) {
      const { key, nome } = route.params;
      console.log(key);
      console.log(nome);
    } */

    return (
        <>
            <Card>
                <Card.Title
                    title="Card Title"
                    subtitle="Card Subtitle"
                    left={LeftContent}
                />
                <Card.Content>
                    <Title>Card Vitoria</Title>
                    <Paragraph>Card content</Paragraph>
                </Card.Content>
                <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
                <Card.Actions>
                    <Button>Cancel</Button>
                    <Button>
                        <Icon name="address-card" color="blue" size={24} /> Ok
                    </Button>
                </Card.Actions>
            </Card>
            <Button
                mode="contained"
                onPress={() =>
                    props.navigation.navigate("Listagem de Contatos", {
                        key: 2,
                        nome: "Jackson",
                    })
                }
            >
                <Icon name="user" color="white" size={24} /> Contato
            </Button>
            <Button
                mode="contained"
                onPress={() =>
                    props.navigation.navigate("Exemplo Mapa")
                }
            >
                <Icon name="map" color="white" size={24} /> Mapa
            </Button>
            <Button
                mode="contained"
                onPress={() =>
                    props.navigation.navigate("Câmera")
                }
            >
                <Icon name="map" color="white" size={24} /> Câmera
            </Button>
            <Button
                mode="contained"
                onPress={() =>
                    props.navigation.navigate("Localização")
                }
            >
                <Icon name="map-marker" color="white" size={24} /> Localização
            </Button>
            <Button
                mode="contained"
                onPress={() =>
                    props.navigation.navigate("Video")
                }
            >
                <Icon name="play" color="white" size={24} /> Video
            </Button>
        </>
    );
}