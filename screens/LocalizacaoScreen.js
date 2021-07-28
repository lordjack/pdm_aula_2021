import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

export default class LocalizacaoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { location: null, errorMsg: null };
    }
    async componentDidMount() {
        this.getPermission();
    }

    getPermission = async () => {

        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMsg:
                    'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
            });
            return;
        }
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            this.setState({ errorMsg: 'Permission to access location was denied' });
            return;
        }

        let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
        this.setState({ location: location });
    };


    render() {
        const { errorMsg, location } = this.state;

        let text = 'Waiting..';
        if (errorMsg) {
            text = errorMsg;
        } else if (location) {
            text = JSON.stringify(location);
        }
        return (
            <View style={styles.container}>
                <Text style={styles.paragraph}>{text}</Text>
                {location ? <Text>{location.coords.latitude}</Text> : null}
                {location ? <Text>{location.coords.longitude}</Text> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    paragraph: {
        fontSize: 18,
        textAlign: 'center',
    },
});
