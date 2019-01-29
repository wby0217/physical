import React, { Component } from 'react';
import {
    View,
    Dimensions,
    WebView,
    StyleSheet
} from 'react-native';

import { OverlaySpinner } from '../tips';

const { width , height} = Dimensions.get('window');

export default class WebPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            source: props.source,
            isConnecting: false
        };
        this.toggleSpinner = this.toggleSpinner.bind(this);
    };
    toggleSpinner (status) {
        this.setState({
            isConnecting: status !== undefined ? status : !this.state.isConnecting
        });
    };
    componentWillMount() {
        this.toggleSpinner(true);
    };
    render () {
        const {isConnecting, source} = this.state;
        return (
            <View style={styles.container}>
                <WebView style={styles.webview}
                         source={source}
                         onLoadEnd={() => this.toggleSpinner(false)}
                         startInLoadingState={true}
                         domStorageEnabled={true}
                         javaScriptEnabled={true}
                >
                </WebView>
                {/* <OverlaySpinner visible={isConnecting}
                         color="#333"
                         overlayColor="transparent"
                         textContent={"正在加载"}
                         textStyle={{color: '#333', fontSize: 16}} /> */}
            </View>
        )
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        width: width,
        height: height
    }
})