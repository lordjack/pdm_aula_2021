import * as React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';

export default class VideoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { status: {} };
    }

    render() {
        const { status } = this.state;
        var video; 
        return ( 
            <View style={styles.container}>
                <Video
                  //  ref={video}
                    style={styles.video}
                    source={{
                        uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
                    }}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                    onPlaybackStatusUpdate={(status) => this.setState({ status: status })}
                />
                <View style={styles.buttons}>
                   {/*  <Button
                        title={status.isPlaying ? 'Pause' : 'Play'}
                        onPress={() =>
                            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                        }
                    /> */}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    video: {
        alignSelf: 'center',
        width: 320,
        height: 200,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
