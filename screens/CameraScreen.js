import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    Alert,
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import firebase from "../components/firebase";

export default class CameraScreen extends Component {
    state = {
        hasPermission: null,
        cameraType: Camera.Constants.Type.back,
		 image: null,
    };

    async componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Platform.OS === 'ios') {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Desculpe, Nos precisamos da permissão da camera para funcionar');
            }
        }
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasPermission: status === 'granted' });
    };

    selecionarImagem = async () => {
        this.getPermissionAsync();
        if (this.state.hasPermission) {
            let foto = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });

            console.log(foto);
            if (!foto.cancelled) {
                this.uploadImage(foto.uri, "ImagemTeste");
            }
        }
    };

    tirarFoto = async () => {
        this.getPermissionAsync();

        if (this.state.hasPermission) {
            const options = { quality: 0.5, base64: true };
            const foto = await this.camera.takePictureAsync(options);

            console.log(foto.uri);

            this.uploadImage(foto.uri, "ImagemTesteTirarFoto")
                .then(() => {
                    Alert.alert("Sucesso", "Imagem enviada com sucesso!");
                }).catch((error) => {
                    Alert.alert(error);
                })
        }
    };

    uploadImage = async (uri, nomeImagem) => {
        const responde = await fetch(uri);
        const blob = await responde.fetch(uri);

        var ref = firebase.storage().ref().child('images/' + nomeImagem);
        return ref.put(blob);
    };

    mudarCamera = async () => {
        const { cameraType } = this.state;
        this.setState({
            cameraType: cameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back,
        });
    };

    render() {
        const { hasPermission } = this.state;

        if (hasPermission === null) {
            return <View />;
        } else if (hasPermission === false) {
            return <Text>Sem acesso a Camera </Text>;
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <Camera
                        style={{ flex: 1 }}
                        type={this.state.cameraType}
                        ref={(ref) => {
                            this.camera = ref;
                        }}>
						 <View style={{ flex: 1,margin: 30 }}>
                            {this.state.image ? <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} /> : <View />}

                        </View>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                margin: 30,
                            }}>
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',
                                }}
                                onPress={() => this.selecionarImagem()}>
                                <Icon
                                    name="image"
                                    style={{ color: '#fff', fontSize: 40 }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',
                                }}
                                onPress={() => alert('Tirando foto...')}>
                                <Icon
                                    name='circle'
                                    style={{ color: '#fff', fontSize: 50 }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',
                                }}
                                onPress={() => this.mudarCamera()}>
                                <Icon
                                    name='random'
                                    style={{ color: 'white', fontSize: 40 }}
                                />
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            );
        }
    }
}
