// 在线客服

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import WebPage from '../../component/webPage';
import _ from 'lodash';
import { Icon, service, ErrorHandle, Action, constants, Header } from '../mesosphere';

export default class ContactUs extends Component {
    static navigationOptions = ({ navigation }) => {
        return ({
            header: null,
        })
    }
    render() {
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <Header
                    headerTitle={navigation.state.params && navigation.state.params.title ? navigation.state.params.title : '在线客服'}
                    navigation = {navigation}
                />
               <WebPage source= {{ uri: navigation.state.params.service }} />
            </View>
        )
    }
}