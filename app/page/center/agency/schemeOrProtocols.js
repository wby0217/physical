// 协议与方案

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    WebView,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import HTML from 'react-native-render-html';
import { Header } from '../../mesosphere';
import NavTitle from './navTitle';

const { width, height } = Dimensions.get('window');
const isIos = Platform.OS === 'ios';
export default class SchemeProtocols extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return ({
            header: null,
        })
    }
    constructor(props) {
        super(props)
        this.state = {
            protocol: {}
        }
    }
    renderData = (data) => {
        this.setState({
            protocol: data
        })
    }
    centerView = () => {
        return (
            <NavTitle renderData= {this.renderData} />
        )
    }
    render() {
        const { navigation } = this.props;
        const { protocol } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Header
                    headerCenter={this.centerView}
                    navigation={navigation}
                />
                <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 10 }}>
                    {protocol.image ? 
                        <Image source={{ uri: protocol.image }} style={{ resizeMode: 'contain', alignSelf: 'center', width }}/>
                        :
                        null
                    }
                    {/* <HTML
                        html={protocol.content}
                        imagesMaxWidth={width}
                        ignoredStyles={['font-family', 'font-variant-numeric', 'font-weight']}
                    /> */}
                    <WebView
                        source={{ html: protocol.content, baseUrl: '' }}
                        style={{ width, height: isIos ? height-100: height, fontSize: 14,  }}
                        scalesPageToFit
                        automaticallyAdjustContentInsets
                        domStorageEnabled={true}
                        javaScriptEnabled={true}
                    />
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    titleView: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#fff',
        flexDirection: 'row',
        width: 160
    },
    titleCol: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 5
    },
    activeView: {
        backgroundColor: '#fff'
    },
    activeText: {
        color: '#17A84B'
    },
    p: {

    },
    h1: {

    },
    h2: {

    },
    h3: {

    },
    h4: {

    },
    h5: {

    }
})
