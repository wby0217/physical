// 开户协议

import React, { Component } from 'react';
import {
    Dimensions,
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image
} from 'react-native';
import { Header } from '../mesosphere';

const { width } = Dimensions.get('window');
export default class Protocals extends Component {
        static navigationOptions = ({ navigation }) => {
        return ({
            header: null,
            headerTitle: '开户协议',
            headerBackTitle: null
        })
    }
    render() {
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <Header
                    headerTitle='开户协议'
                    navigation = {navigation}
                />
                <ScrollView style={styles.container}>
                    <Image style={styles.banner} source={require('../../assets/images/in_banner.png')}/>
                    <Text style={styles.textView}>本应用内严禁会员有重复申请账号行为，每位玩家、每一住址 、每一电子邮箱、每一电话号码、相同支付卡/信用卡号码，及共享计算机环境(例如网吧、其他公共用计算机等)只能拥有一个帐户数据。</Text>
                    <Text style={styles.textView}>本应用是提供互联网投注服务的机构。请会员在注册前参考当地政府的法律，在本应用内不被允许的地区，如有会员在本应用注册、下注，为会员个人行为，本应用不负责、承担任何相关责任。</Text>
                    <Text style={styles.textView}>无论是个人或是团体，如有任何威胁、滥用本应用名义的行为，本应用将保留杈利取消、收回玩家账号。</Text>
                    <Text style={styles.textView}>玩家注册信息有争议时，为确保双方利益、杜绝身份盗用行为，本应用保留权利要求客户向我们提供充足有效的档，并以各种方式辨别客户是否符合资格享有我们的任何优惠。</Text>
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    textView: {
        marginTop: 15,
        color: '#333333',
        lineHeight: 20,
        paddingHorizontal: 15
    },
    banner: {
        width: width,
        height: width * 240 / 750
    }
});
