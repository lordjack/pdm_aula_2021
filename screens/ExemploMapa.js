import * as React from "react";
import * as Location from "expo-location";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
    Animated, Linking,
    Dimensions
} from "react-native";
import {
    Card,
    FAB,
    List,
    Title,
    Paragraph,
    Button, Text,
    Divider, TextInput, Searchbar
} from "react-native-paper";
import MapView, {
    Callout,
    Marker,
    PROVIDER_GOOGLE,
    Region,
} from "react-native-maps";

export default class ExemploMapa extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            nome: null,
            region: {
                latitude: -27.5959906,
                longitude: -48.5420084,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            devs: [],
            initialRegion: {
                latitude: -27.5959906,
                longitude: -48.5420084,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            coordinate: { latitude: -27.5959906, longitude: -48.5420084 },
            coordinate2: { latitude: -27.5969, longitude: -48.5495 },
        };
    }
    async componentDidMount() {
        this.getCurrentPosition();
        /* await this.load();
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.load(); 
        }); */
    }
    onRegionChange(region) {
        console.log(region)
        this.setState({ region });
    }
    openLink = (url) => {
        console.log(url)
        Linking.openURL(url);
    }
    getCurrentPosition = async () => {
        let { status } = await Location.requestPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Ops!", "Permissão de acesso a localização negada.");
        }

        /*  let {
             coords: { latitude, longitude },
         } = await Location.getCurrentPositionAsync();
 
         console.log(latitude);
         console.log(longitude);
         this.setState({ region: { latitude, longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 } }); */
    };

    render() {
        return (
            <View>
                <FAB
                    style={styles.fab}
                    icon="plus"
                    onPress={() => {
                        this.props.navigation.navigate("Formulário Contato", {
                            contato: "",
                            contatos: this.state.contatoList,
                        });
                    }}
                />
                <MapView
                    initialRegion={this.state.initialRegion}
                    // region={this.state.region}
                    showsUserLocation={true}		//destacando a localização do usuário no mapa
                    //   showsMyLocationButton={false} 	//ocultando o botão que move o mapa para a localização do usuário
                    toolbarEnabled={true}	//ocultando opções do google maps ao clicar em objetos do mapa
                    onRegionChange={() => this.onRegionChange()}
                    onPress={e =>
                        this.setState({
                            region: {
                                ...this.state.region,
                                latitude: e.nativeEvent.coordinate.latitude,
                                longitude: e.nativeEvent.coordinate.longitude,
                            }
                        })
                    }
                    style={styles.map}>
                    <Marker coordinate={this.state.coordinate}
                        title={'IFSC - está em todo lugar'}
                        tracksViewChanges={false}	//propriedade que melhora muito a performance do nosso aplicativo, mantendo os marcadores fixados no mapa e eliminando a renderização continua.
                        description={'Teste, descriao teste teste'}>
                        <TouchableOpacity onPress={() => this.openLink("https://www.ifsc.edu.br")}><Text
                            style={{
                                backgroundColor: '#FF5A5F',
                                padding: 2,
                                borderColor: '#D23F44',
                                color: '#FFFFFF',
                                fontSize: 20,
                            }}>
                            IFSC
                        </Text>
                        </TouchableOpacity>
                    </Marker>
                    <Marker coordinate={this.state.coordinate2}
                        title={'Rocket Seat - está em todo lugar'}
                        description={'Teste, descriao teste teste'}>
                        <TouchableOpacity onPress={() => this.openURL("https://blog.rocketseat.com.br")}><Text
                            style={{
                                backgroundColor: '#FF5A5F',
                                padding: 2,
                                borderColor: '#D23F44',
                                color: '#FFFFFF',
                                fontSize: 20,
                            }}>
                            Google-BR
                        </Text>
                        </TouchableOpacity>
                    </Marker>
                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#09f",
    },
});