// 核对信息

// 平台收款填写信息

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
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { OverlaySpinner } from '../../../../component/tips';
import stylesConfig from '../../../../assets/styles'
import { ErrorHandle, showToast, Action, Header } from '../../../mesosphere';

import service from '../../../../service';
// import Spinner from '../../vendor/react-native-loading-spinner-overlay';

const { width } = Dimensions.get('window');
export default class CheckRechargeInfo extends Component {
    static navigationOptions = ({ navigation }) => {
        return ({
            title: '平台收款',
        })
    };
    constructor(props) {
        super(props)
        this.state = {
            isConnecting: false,
            disabledBtn: false
        };
        this.params = props.navigation.state.params;
    }
    componentWillUnmount () {
        clearTimeout(this.timer);
    }
    submitInfo = () => {
        this.setState({
            isConnecting: true
        });
        const { navigate } = this.props.navigation;
        const { amount, selectedAccount, selectedDate, selectedRechargeType, selectedBank, userName } = this.params;
        const params = {
            amount,
            userName,
            rechargeAccountId: selectedAccount.id,
            rechargeType: selectedRechargeType.id,
            rechargeDate: selectedDate,
            rechargeBankId: selectedBank.id
        };
        service.rechargeTransfer(params).then(res => {
            this.setState({isConnecting: false});
            showToast(res.message, {
                onHidden: () => this.backToTopUp()
            })
        }).catch(err => {
            this.setState({isConnecting: false});
            ErrorHandle(err)
        })
}
    backToTopUp = () => {
        const { navigation } = this.props;
        const routeNames = ['VirtualMain', { routeName: 'Recharge' }]
        navigation.dispatch(Action.resetRoutesByNames(routeNames));
    }
    render() {
        const { amount, selectedAccount, selectedRechargeType, selectedDate, selectedBank, userName } = this.params;
        const { isConnecting, disabledBtn } = this.state;
        return (
            <View style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    headerTitle="平台收款"
                />
                <ScrollView>
                    <View style={styles.headerTitle}>
                        <Text style={{ color: '#17A84B' }}>1 选择存款账户</Text>
                        <Icon name="angle-right" color="#CFCFCF" size={24} />
                        <Text style={{ color: '#17A84B' }}>2 填写信息</Text>
                        <Icon name="angle-right" color="#CFCFCF" size={24} />
                        <Text style={{ color: '#17A84B' }}>3 核对信息</Text>
                    </View>
                    <View style={ styles.infoListItem }>
                        <View style={styles.itemRow}>
                            <Text>存款人姓名</Text>
                            <Text>{userName}</Text>
                        </View>
                        <View style={styles.itemRow}>
                            <Text>存款金额</Text>
                            <Text>{parseFloat(amount)} 元</Text>
                        </View>
                        <View style={styles.itemRow}>
                            <Text>存入银行</Text>
                            <Text>{selectedAccount.bankName || ''}</Text>
                        </View>
                        <View style={styles.itemRow}>
                            <Text>存款方式</Text>
                            <Text>{selectedRechargeType.name}</Text>
                        </View>
                        <View style={styles.itemRow}>
                            <Text>存款时间</Text>
                            <Text>{selectedDate}</Text>
                        </View>
                        <View style={styles.itemRow}>
                            <Text>您使用的银行</Text>
                            <Text>{selectedBank.name}</Text>
                        </View>
                    </View>
                    <View style={styles.nextStep}>
                        <TouchableOpacity
                            style={[styles.nextStepInner]}
                            onPress={() => {
                                this.submitInfo()
                            }}
                            disabled={disabledBtn}
                            onPressIn={() => {
                                this.setState({
                                    disabledBtn: true
                                }, () => {
                                    this.timer = setTimeout(() => this.setState({
                                        disabledBtn: false
                                    }), 3000);
                                });
                            }}
                        >
                            <Text style={styles.nextStepTxt}>确认</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <OverlaySpinner visible={isConnecting}/>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5F9',
        flex: 1
    },
    headerTitle: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    infoListItem: {
        backgroundColor: '#fff',
        marginTop: 10,

    },
    nextStep: {
        marginTop: 50,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextStepInner: {
        flex: 1,
        width: width / 1.08,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: stylesConfig.activeBtn.bg,
        borderRadius: 5,
    },
    nextStepTxt: {
        color: stylesConfig.activeBtn.txtColor,
        fontWeight: 'bold',
        fontSize: 16,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        alignItems: 'center',
        height: 50,
        borderBottomColor: '#EFEFEF',
        borderBottomWidth: StyleSheet.hairlineWidth
    }
})

