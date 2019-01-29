// 我的银行卡

import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { OverlaySpinner } from '../../component/tips';
import { service, ErrorHandle, Action, constants, showToast, Config, Icons, Header } from '../mesosphere';

class MyBankCardList extends Component {
    static navigationOptions = ({ navigation }) => {
        return ({
            header: null
        })
    }
    constructor(props) {
        super(props)
        const { navigation } = props;
        this.state = {
            bankInfo: navigation.state.params && navigation.state.params.bankInfo || [],
            isConnecting: false
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        if(!(params && params.bankInfo)) {
            this.toggleOverlay();
            service.getUserBanksService()
            .then(res => {
                this.toggleOverlay();
                this.setState({ bankInfo: res.data })
            })
            .catch(err => {
                this.toggleOverlay();
                ErrorHandle(err);
            })
        }
    }
    toggleOverlay = () => {
        // loading层开关
        this.setState({
            isConnecting: !this.state.isConnecting
        })
    }
    headerLeft = () => {
        const { navigation } = this.props;
        const { params } = navigation.state;
        return (
            <TouchableOpacity
                onPress={async () => {
                    if(params && params.key) {
                        navigation.goBack(params.key);
                        navigation.state.params && navigation.state.params.reloadCardInfo && await navigation.state.params.reloadCardInfo();
                    } else {
                        navigation.dispatch(Action.resetRoutesByNames(['VirtualMain', 'SecurityCenter']));
                    }
                }}
                style={{ backgroundColor: 'transparent' }}
            >
                <Icons name="icon-back-normal" color="#ffffff" size={22} />
            </TouchableOpacity>
        )
    }
    render() {
        const { saveUpdateUser, navigation } = this.props;
        const { bankInfo, isConnecting } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Header
                    headerTitle="我的银行卡"
                    navigation = {navigation}
                    headerLeft = {this.headerLeft}
                />
                <View style={{ flex: 1, backgroundColor: '#F5F5F9', paddingHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', height: 30, alignItems: 'center' }}>
                        <Text style={{ color: '#666' }} >持卡人: {saveUpdateUser.realName}</Text>
                    </View>
                    {bankInfo.length ? bankInfo.map((item, index) => 
                        <View key={index} style={{ backgroundColor: '#fff', borderRadius: 10, flexDirection: 'row', paddingVertical: 10 }}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={{ width: 50, height: 50, resizeMode: 'contain' }}
                                />
                            </View>
                            <View style={{ flex: 4, justifyContent: 'center', }}>
                                <Text style={{ lineHeight: 30, fontSize: 16 }}>{item.name}</Text>
                                <Text style={{ color: '#666666' }}>{item.account.replace(/[\s]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ")}</Text>
                            </View>
                        </View>
                    ): null}
                    <View style={{ height: 40, justifyContent: 'center' }}>
                        <Text style={{ color: '#999999', fontSize: 12 }}>如要解绑,请到会员中心联系客服</Text>
                    </View>
                    <OverlaySpinner
                            visible= {isConnecting}
                            cancelable= {true}
                            onTouchShade={this.toggleOverlay}
                        />
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLogin: state.match.saveUpdateUser.isLogin,
        saveUpdateUser: state.match.saveUpdateUser,
    }
}

export default connect(mapStateToProps)(MyBankCardList);
