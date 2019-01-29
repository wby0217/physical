import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
} from 'react-native';
import { showToast, ErrorHandle, Header } from '../../mesosphere';
const { width , height} = Dimensions.get('window');
export default class RechargeRef extends Component {
    static navigationOptions={
        header: null,
    };
    render() {
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <Header headerTitle="充值说明" navigation = {navigation}/>
                <ScrollView style={styles.container}>

                    <View style={styles.wrap}>
                        <Text style={styles.titleTip}>为防止少数用户利用信用卡套现和洗钱的行为，保护正常用户资金安全，充值时请注意</Text>
                        <Text style={styles.tip}>(单笔充值金额消费未达到一倍有效投注，只可提取盈利金额，不可提取本金)</Text>
                        <View style={styles.way}><Text style={styles.wayTitle}>方式A:</Text><Text style={styles.wayContent}>公司入款-网银转账</Text></View>
                        <Text style={styles.heart}>（更划算/可享受优惠返利2%，次次存，次次送)</Text>
                        <View style={styles.list}>
                            <Text style={styles.round}>●</Text>
                            <Text style={styles.text}>为确保财务及时帮您查账，添加游戏额度，请您每次存款使用小数点的方式（例: 欲入￥5000，请转￥5000.08) 谢谢！</Text>
                        </View>
                        <View style={styles.list}>
                            <Text style={styles.round}>●</Text>
                            <Text style={styles.text}>什么是银行转账？通过网银转账、ATM/柜台存入、手机网银转账等方式汇款。</Text>
                        </View>
                        <View style={styles.list}>
                            <Text style={styles.round}>●</Text>
                            <Text style={styles.text}>公司入款银行帐号不定时更换, 请在每次存款前,进入存款页面查询 最新收款账号(若误入到公司停用账户，公司恕不负责)</Text>
                        </View>
                        <View style={styles.way}><Text style={styles.wayTitle}>方式B:</Text><Text style={styles.wayContent}>网银-在线支付</Text></View>
                        <Text style={styles.heart}>QQ钱包/银联钱包/微信/东京钱包-扫码支付</Text>
                        <View style={styles.list}>
                            <Text style={styles.round}>●</Text>
                            <Text style={styles.text}>按页面步骤完成操作，方式支付成功后无需经过客服，额度自动添加至会员账号！</Text>
                        </View>
                        <View style={styles.way}><Text style={styles.wayTitle}>方式C:</Text><Text style={styles.wayContent}>QQ钱包/东京钱包-一键支付</Text></View>
                        <View style={styles.list}>
                            <Text style={styles.round}>●</Text>
                            <Text style={styles.text}>目前只支持app版与手机网页版</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
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

