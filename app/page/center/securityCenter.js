// 安全中心

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { Icons, service, ErrorHandle, Action, constants, Config, cleanCache, showToast, Header } from '../mesosphere';
import securityList from './securityBtnList';
import { logout } from '../../service/authService';

class SecurityCenter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            existBank: false,
            bankInfo: []
        }
    }
    componentDidMount() {
        this.loadBankCard();
    }
    loadBankCard = async () => {
        // service.getUserBanksService()
        // .then(res => {
        //     if(!res.data || res.data.length === 0 ) {
        //         this.setState({ existBank: false })
        //     } else {
        //         this.setState({ existBank: true, bankInfo: res.data })
        //     }
        // })
        // .catch(ErrorHandle)
       const res = await service.getUserBanksService();
            if(!res.data || res.data.length === 0 ) {
                await this.setState({ existBank: false })
            } else {
                await this.setState({ existBank: true, bankInfo: res.data })
            }
    }
    toJump = (item) => {
        const { existBank, bankInfo } = this.state;
        const { navigation, saveUpdateUser } = this.props;
        if(!saveUpdateUser.realName && item.routeName === 'UpdFundPwd') {
            navigation.navigate('SettingFundPwd', { title: item.name, reloadCardInfo: this.loadBankCard, prevRouteName: 'fundPwd'  })
        } else if( saveUpdateUser.realName && item.routeName === 'SettingFundPwd' && !existBank) {
            navigation.navigate('AddBankCard', { title: item.name, reloadCardInfo: this.loadBankCard })
        } else if( item.routeName === 'SettingFundPwd' && existBank ) {
            navigation.navigate('MyBankCard', { bankInfo });
        } else {
            navigation.navigate(item.routeName, { title: item.name, reloadCardInfo: this.loadBankCard })
        }
    }
    render() {
        const { isLogin, navigation, accountType, saveUpdateUser } = this.props;
        return (
            <View style={styles.container}>
                <Header
                    headerTitle="安全中心"
                    navigation = {navigation}
                />
                 {
                    securityList.length ? securityList.map((item, index) => {
                        if(accountType === 'guest' && ['SettingFundPwd', 'UpdFundPwd'].includes(item.routeName)) {
                            return;
                        }
                        return (
                            <View key={index}>
                                <TouchableOpacity
                                    style={styles.listItem}
                                    activeOpacity={0.6}
                                    key={index}
                                    onPress={this.toJump.bind(this, item)}
                                >
                                    <Text>{item.name}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        {item.routeName == 'UpdFundPwd' ?<Text style={{ color: '#666666' }}>{saveUpdateUser.isSetFundPassword ? '已设置':'未设置'}</Text> : <Text style={{ color: '#666666' }}>{item.desc}</Text>}
                                        <Text style={{ color: '#666666' }}>{item.desc}</Text>
                                        <Icons name="icon-right-arrow-normal" color="#D8D8D8" size={16} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    }): <View/>
                } 
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F9'
    },
    listItem: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth
    }
})

const mapStateToProps = (state) => {
    return {
        saveUpdateUser: state.match.saveUpdateUser,
        accountType: state.match.saveAcountType.type
    }
}

export default connect(mapStateToProps)(SecurityCenter);
