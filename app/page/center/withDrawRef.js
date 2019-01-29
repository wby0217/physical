import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
} from 'react-native';
import { showToast, ErrorHandle, Header } from '../mesosphere';
const { width , height} = Dimensions.get('window');

export default class WithDrawRef extends Component {
    static navigationOptions = ({ navigation }) =>  ({
        header: null,
    });
    constructor(props){
        super(props);
        this.state = {
        };
        this.navigation = props.navigation;
    };
    render () {
        const { state } = this.props.navigation;
        return (
            <View style={{height:height}}>
                <Header headerTitle = "限额说明"
                        navigation = {this.navigation}/>
                <ScrollView style={styles.container}>
                    <View style={styles.wrap}>
                        <Text style={[styles.title,{marginBottom:8}]}>温馨提示：</Text>
                        <Text style={[styles.tip,{marginBottom:10}]}>请确认提款时提交的银行信息的正确性；银行卡用户名与注册时提交的用户真实姓名必须一致。</Text>
                        <View style={styles.list}><Text style={styles.round}>●</Text><Text style={styles.text}>单笔提款金额最低为100元。</Text></View>
                        <View style={styles.list}><Text style={styles.round}>●</Text><Text style={styles.text}>您今日已提款次数为0次，已提现金额为0元。</Text></View>
                    </View>
                </ScrollView>
            </View>
        )
    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        height: height
    },
    wrap: {
        paddingHorizontal: 10,
        paddingVertical: 15
    },
    titleTip: {
        lineHeight: 16,
        marginBottom: 14,
    },
    title: {
        color: '#000',
        fontSize: 14,
        lineHeight: 24,
    },
    tip: {
        lineHeight: 18,
        color: '#666',
    },
    list: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    way: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    wayTitle: {
        fontSize: 14,
        color: '#17A84B',
        lineHeight: 24,
        marginVertical: 8,
    },
    wayContent: {
        fontSize: 14,
        color: '#333',
        lineHeight: 24,
    },
    round: {
        width:8,
        height: 9,
        marginRight: 7,
        marginTop: 7,
        color: '#17A84B',
        fontSize: 10,
        lineHeight: 10,
    },
    text: {
        width: (width-35),
        lineHeight: 24,
        color: '#666'
    },
    heart: {
        lineHeight: 20,
        color: '#666666',
        marginBottom: 10,
    },
})

