import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
    Linking,
} from 'react-native';


import { showToast } from '../../../utils'

const { width, height } = Dimensions.get('window');


export default class RechargeTypeItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            bankId: '',
            bankList: [],
            isShowBankList: false,
            isConnecting: false,
        };
        this.rechargeTypeList = props.params;
        this.userInfo = props.userInfo;
        this.navigate  = props.navigation.navigate;
        this.selectRechargeType = this.selectRechargeType.bind(this);
        // this.checkAmount = this.checkAmount.bind(this);
    }
    // checkAmount (actionType) {
    //     const { payInMount} = this.props;
    //     if(Number(payInMount) <= 0) {
    //         return showToast('请输入充值金额!');
    //     }
    //     if (actionType === 3) {
    //         if (payInMount > this.userInfo.companyRechargeMaxAmount) {
    //             return showToast(`充值金额不能超过 ${this.userInfo.companyRechargeMaxAmount} 元`);
    //         }
    //         if (payInMount < this.userInfo.companyRechargeMinAmount) {
    //             return showToast(`充值金额不能小于 ${this.userInfo.companyRechargeMinAmount} 元`);
    //         }
    //     } else if (actionType === 1 || actionType === 2) {
    //         if (payInMount > this.userInfo.onlineRechargeMaxAmount) {
    //             return showToast(`充值金额不能超过 ${this.userInfo.onlineRechargeMaxAmount} 元`);
    //         }
    //         if (payInMount < this.userInfo.onlineRechargeMinAmount) {
    //             return showToast(`充值金额不能小于 ${this.userInfo.onlineRechargeMinAmount} 元`);
    //         }
    //     }
    //     return 'success';
    // }

    selectRechargeType (rechargeType) {
        // if (this.checkAmount(rechargeType.actionType) !== 'success') return false;
        this.props.onSelected(rechargeType)
    }
    render () {
        return (
            <ScrollView style={styles.payTypeListWarp}>
                {!!this.rechargeTypeList && this.rechargeTypeList.map( item => {
                    return ( <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.5}
                        onPress={() => this.selectRechargeType(item)}>
                        <View style={styles.payTypeItem}>
                            <Image source={!!item.image ? {uri: item.image} : require('../../../assets/images/icon_bank.png')}
                                   style={{width: 26, height: 26, borderRadius: 13, marginLeft: 18, marginRight: 15}}/>
                            <View style={styles.payTypeDesc}>
                                <Text>{item.name ? item.name : item.bankName}  {!item.maxAmount ? null : parseInt(item.maxAmount) === 0 ? `￥${item.minAmount}起` : `￥${item.minAmount}-${item.maxAmount}元`}</Text>
                                <Text style={{fontSize: 12, color: '#999'}}>{item.description}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>)
                })}
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    payTypeListWarp: {
        flex:1,
        backgroundColor: '#fff',
        // borderTopColor: '#E5E5E5',
        // borderTopWidth: StyleSheet.hairlineWidth
    },
    payTypeItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    payTypeDesc: {
        flex:1,
        flexDirection: 'column',
        height: 40,
        // paddingVertical: 5,
        justifyContent: 'space-around'
    },
    center: {
        justifyContent:'center',
        alignItems: 'center',
    },

});