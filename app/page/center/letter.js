// 站内信详情
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import moment from 'moment';
import { service, showToast, Header, LoadMoreFooter, Icons } from '../mesosphere';

export default class Letter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            letterInfo: {}
        }
    }
    componentDidMount() {
        const { navigation } = this.props;
        const { letter } = navigation.state.params; 
        service.getMsgInfoService({
            messageId: letter.messageId
        })
        .then(res => {
            this.setState({
                letterInfo: res.data
            })
        })
        .catch(err => {
            showToast(err);
        })
    }
    headerRightHander = () => {
        const { navigation } = this.props;
        const { messageId } = navigation.state.params && navigation.state.params.letter;
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.state.params && navigation.state.params.removeItem && navigation.state.params.removeItem(messageId);
                    navigation.goBack();
                }}
            >
                <Text style={{ color: '#fff' }}>删除</Text>
            </TouchableOpacity>
        )
    }
    headerLeft = () => {
        const { navigation } = this.props;
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.state.params && navigation.state.params.backHandler && navigation.state.params.backHandler();
                    navigation.goBack();
                }}
                style={{ backgroundColor: 'transparent' }}
            >
                <Icons name="icon-back-normal" color="#ffffff" size={22} />
            </TouchableOpacity>
        )
    }
    render() {
        const { navigation } = this.props;
        const { letter } = navigation.state.params;
        const { letterInfo } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Header
                    headerTitle="站内信详情"
                    headerLeft={this.headerLeft}
                    navigation={navigation}
                    headerRight={this.headerRightHander}
                />
                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                >
                    <View>
                        <Text style={{ fontSize: 14, lineHeight: 30, color: '#333', fontWeight: 'bold' }}>{letter.title}</Text>
                        <Text style={{ fontSize: 12, color: '#999', lineHeight: 30 }}>{letter.createTime}</Text>
                    </View>
                    <Text style={{ color:'#333' }}>{letter.content}</Text>
                </ScrollView>
            </View>
        )
    }
}