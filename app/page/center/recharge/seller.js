// 商户中心

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Linking,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import { OverlaySpinner } from '../../../component/tips';
import { saveBankList } from "../../../action/common"
import ScrollableTabView from 'react-native-scrollable-tab-view';
import CustomKeyboard from 'react-native-custom-keyboard';
import ScrollableTabBar from './scrollerTabBar';
import { amountList } from '../../../config/appMenuList';
import service from '../../../service';
import RechargeTypeItem from './rechargeTypeItem';
import { showToast, ErrorHandle, Header, Icons } from '../../mesosphere';
const { width, height } = Dimensions.get('window');

class Seller extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            selected: false,
            userInfo: '',
            amount: '',
            isShowBankList: false,
            isOpenKeyboard: false,
            isConnecting: false,
            rechargeGroup: [],
        };
        this.selectedRechargeType = {};
        this.selectedBankId = '';
        this.navigate = props.navigation.navigate;

        this.toggleCustomKeyboard = this.toggleCustomKeyboard.bind(this);
        this.onKeyboardPress = this.onKeyboardPress.bind(this);
        this.getRechargeType = this.getRechargeType.bind(this);
        this.selectRechargeType = this.selectRechargeType.bind(this);
        this.getBankList = this.getBankList.bind(this);
        this.toggleShowBankList = this.toggleShowBankList.bind(this);
        this.toggleSpinner = this.toggleSpinner.bind(this);
        this.renderBankList = this.renderBankList.bind(this);
        this.onPressBankHandle = this.onPressBankHandle.bind(this);
        this.checkAmount = this.checkAmount.bind(this);
        this.requestOnlineRecharge = this.requestOnlineRecharge.bind(this);
        this.requestOfflineQRPay = this.requestOfflineQRPay.bind(this);
    }
    componentWillMount () {
        const { navigation: {state: {params: { groupId }}} } = this.props;
        this.getRechargeType()
            .then(() => this.getBankList())
            .catch(err => {
                ErrorHandle(err).then(res => {
                    console.log('errorhandle ====',res);
                })
            })
        service.getMerchantListService({
            terminal: Platform.OS,
            groupId
        })
        .then(res => {
            this.setState({ rechargeGroup: res.data })
        })
        .catch(ErrorHandle)
    }
    renderBankList (bankList) {
        return !!bankList && bankList.map((item, index) => {
            return (
                <TouchableOpacity style={styles.bankItem}
                                  onPress={() => this.onPressBankHandle(item)}
                                  key={index}>
                    <Image style={styles.bankIcon}
                           source={!item.bankImage ? require('../../../assets/images/icon_bank.png') : {uri: item.bankImage}}/>
                    <Text style={styles.bankName}>{item.bankName}</Text>
                </TouchableOpacity>
            )
        })
    };
    toggleShowBankList (status, callback) {
        this.setState ({
            isShowBankList: status ? status : !this.state.isShowBankList
        }, () => {
            callback && callback();
        })
    };
    toggleCustomKeyboard (status, done) {
        this.setState({
            isOpenKeyboard: status !== undefined ? status : !this.state.isOpenKeyboard
        }, () => {
            done && done()
        })
    }
    onKeyboardPress (text) {
        const inputArr = text.split('.');
        if((inputArr.length > 1) && inputArr[1].length > 2) return;
        this.setState({ amount: text.replace(/^(\.)/, '').replace(/^([0])/, '').replace(/(\.{2})/g, '.') })
    }
    getRechargeType () {
        const { accountType } = this.props;
        let rechargeFn = null;
        if( accountType === 'special' ) {
            const rechargeTypeJson = require('../../../data/get_recharge_type.json');
            this.setState({ rechargeType: rechargeTypeJson.data })
            return Promise.resolve(rechargeTypeJson)
        } else {
            // return service.getRechargeType()
            // .then(res => this.setState({rechargeType: res.data}, () => console.log('获取充值渠道===', res)))
            // .then(() => Promise.resolve())
            // .catch(err => Promise.reject(err))
            return Promise.resolve();
        }
    }
    getBankList () {
        const { bankList, saveBankList } = this.props;
        if (!bankList.length) {
            return service.getBankList()
                .then(res => {
                    console.log(res)
                    this.setState({bankList: res.data});
                    saveBankList(res.data);
                    return Promise.resolve();
                })
                .catch(err => Promise.reject(err))
        } else {
            this.setState({bankList});
            return Promise.resolve();
        }

    };
    toggleSpinner (status, callback) {
        this.setState({
            isConnecting: status !== undefined ? status : !this.state.isConnecting
        }, () => {
            callback && callback()
        });
    };
    toggleShowBankList (status, callback) {
        this.setState ({
            isShowBankList: status ? status : !this.state.isShowBankList
        }, () => {
            callback && callback();
        })
    };
    onPressBankHandle (item) {
        this.selectedBankId = item.bankCode;
        this.toggleShowBankList(false, () => {
            setTimeout(this.requestOnlineRecharge, 400);
        });
    };
    requestOnlineRecharge () {
        const { amount } = this.state;
        const data = {
            amount,
            merchantId: this.selectedRechargeType.id
        };
        const actionType = this.selectedRechargeType.actionType;
        if ( this.selectedBankId ) { data.bankCode = this.selectedBankId};
        this.toggleSpinner(true);
        service.onlineRecharge(data).then(res => {
            this.toggleSpinner(false);
            this.rechargeInfo = Object.assign(res.data, this.selectedRechargeType);
            console.log('recharge info ========', this.rechargeInfo);
            //操作类型 1、在线扫码支付，2、网银支付、3、公司入账，4、 线下二维码支付 6、通用支付 7、一键支付
            if (actionType === 2 || actionType === 7) {
                Linking.canOpenURL(res.data.rechargeUrl).then(supported => {
                    if (supported) {
                        return Linking.openURL(res.data.rechargeUrl);
                    } else {
                        return showToast('不能打开该网址!', {
                            onHide: () => Promise.reject()
                        });
                    }
                }).then(() => {
                    this.navigate('RechargeResult', {...this.rechargeInfo })
                }).catch(err => {
                    console.log('canOpenURL', err);
                })
            } else if (actionType === 1) {
                this.navigate('ShowRechargeCode', {rechargeInfo: this.rechargeInfo})
            }
        }).catch(err => {
            this.toggleSpinner(false);
            console.log('rechargeOnline err', err);
            ErrorHandle(err)
        })
    };
    requestOfflineQRPay () {
        this.toggleSpinner(true);
        const { amount } = this.state;
        const rechargeInfo = Object.assign({amount: parseFloat(amount)}, this.selectedRechargeType);
        service.getFriendsPayAccount({payTypeId: this.selectedRechargeType.id}).then(res => {
            this.toggleSpinner(false);
            this.navigate('FriendPay', {rechargeInfo: rechargeInfo, payAccount: res.data});
        }).catch(err => {
            this.toggleSpinner(false);
            console.log('responsive======err', err);
            ErrorHandle(err)
        })
    }
    selectRechargeType (rechargeType) {
        this.selectedRechargeType = rechargeType;
        this.selectedBankId = '';
        const { amount } = this.state;
        const { accountType, navigation } = this.props;
        this.setState({ bankList: rechargeType.bank })
        //操作类型 1、在线扫码支付，2、网银支付、3、公司入账，4、好友支付，7、快捷支
        console.log('selected rechargeType===',rechargeType);
        console.log('===========', rechargeType.actionType)
        if (this.checkAmount(rechargeType) !== 'success') return false;
        if( accountType === 'special' ) {
            return service.specialAgentPayService({ payTypeId: rechargeType.id, amount })
            .then(res => {
                showToast('充值成功!', {
                    onHidden: () => {
                        navigation.goBack();
                    }
                })
            })
            .catch(ErrorHandle);
        }
        switch (rechargeType.actionType) {
            case 3:
                this.navigate('RecipientAccount', { amount, rechargeType });
                break;
            case 2:
                this.toggleShowBankList(true);
                break;
            case 1:
            case 7:
                this.requestOnlineRecharge();
                break;
            default:
                this.requestOfflineQRPay();
                break;
        }
    };
    checkAmount (rechargeType) {
        const max = rechargeType.maxAmount ? parseInt(rechargeType.maxAmount) : 999999;
        const min = rechargeType.minAmount ? parseInt(rechargeType.minAmount) : 0.01;
        const { amount } = this.state;
        if (amount > 0) {
            if(amount >= min && (amount <= max || max == 0)) {
                return 'success'
            } else {
                const maxInfo = (parseInt(max) < 1) ? '' : `,最高${max}元!`;
                return showToast(`充值限额最低${min}元${maxInfo}`);
            }
        } else {
            return showToast('请输入充值金额！')
        }
    }
    headerRight = () => {
        const { navigation } = this.props;
        return (
            <TouchableOpacity  onPress={() => navigation.navigate('TopUpRecord')}>
                <Text style={styles.headerRightText}>充值明细</Text>
            </TouchableOpacity>
        )
    }
    headerLeft = () => {
        const { navigation } = this.props;
        const { params } = navigation.state;
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.goBack();
                    params && params.countDown && params.countDown();
                }}
                style={{ backgroundColor: 'transparent' }}
            >
                <Icons name="icon-back-normal" color="#ffffff" size={22} />
            </TouchableOpacity>
        )
    }
    render() {
        const { isLogin, saveUpdateUser, navigation } = this.props;
        const { amount, isOpenKeyboard, rechargeType, isShowBankList, isConnecting, bankList, rechargeGroup } = this.state;
        const { merchant } = navigation.state.params;
        return (
            <View style={styles.container}>
                <Header
                    headerTitle="充值"
                    headerRight={this.headerRight}
                    navigation = {navigation}
                    headerLeft={this.headerLeft}
                />
                <View style={styles.amountInput}>
                    <Text style={{ flex: 1.1, paddingBottom: 0 }}>充值金额:</Text>
                    <Text style={[styles.amountText,  {color: !!amount ? '#333' : '#999'}]}
                          onPress={() => this.toggleCustomKeyboard(true)}>
                        {!!amount ? amount : '请输入充值金额'}
                    </Text>
                </View>
                <View style={styles.amountList}>
                    {!!amountList && amountList.map((item, index) =>
                        <TouchableOpacity
                            onPress={() => this.setState({ amount: item.value})}
                            key={index}
                            style={[styles.cardItem, {borderColor: amount === item.value ? '#17A84B' : '#EBEBEB'}]}
                            activeOpacity={0.8}>
                            <Text style={amount === item.value ? styles.cardIsActiveText : null}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={{ fontSize: 12, color: '#999999' , padding: 10 }}><Text style={{ color: '#333' }}>选择充值方式</Text>(如有问题,请联系
                <Text
                    onPress={() => {
                        navigation.navigate('ContactUs');
                    }}
                    style={{ color: '#18A1F5', textDecorationLine: 'underline' }}
                >
                在线客服
                </Text>)</Text>
                <View style={[styles.payTypeListWarp, !isLogin ? styles.center : null ]}>
                    {
                        rechargeGroup && rechargeGroup.length ? 
                        <RechargeTypeItem
                            params={rechargeGroup}
                            userInfo={saveUpdateUser}
                            amount={amount}
                            onSelected={this.selectRechargeType}
                            navigation={navigation} />
                            : null
                    }
                </View>
                <Modal style={styles.bankListModal}
                       position={"bottom"}
                       backdropPressToClose={false}
                       swipeToClose={false}
                       isOpen={isShowBankList}>
                    <View style={styles.modalTitleBar}>
                        <Text style={styles.titleText}>请选择银行</Text>
                        <TouchableOpacity onPress={() => this.toggleShowBankList(false)}>
                            <Icon size={16} name="times-circle" color="#999"/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>{this.renderBankList(bankList)}</ScrollView>
                </Modal>
                <OverlaySpinner visible= {isConnecting} cancelable= {true} ref={'ref'}/>
                <CustomKeyboard isOpen={isOpenKeyboard}
                                defaultValue={ amount }
                                underlayColor={'#E3E3E3'}
                                onClosedHandle={() => this.toggleCustomKeyboard(false)}
                                onButtonPress={(text) => {this.toggleCustomKeyboard(false)}}
                                onTextChange={(text) => {this.onKeyboardPress(text)}}/>
            </View>
        )
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F9'
    },
    headerRightText: {
        color: '#FFF',
        paddingHorizontal: 3
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    amountInput: {
        backgroundColor: '#fff',
        height: 40,
        flexDirection: 'row' ,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5E5E5',
        borderTopColor: '#E5E5E5',
        marginTop: 10,
        alignItems: 'center',
        paddingHorizontal: 10
    },
    amountText: {
        flex:4,
        paddingVertical: 0,
        fontSize: 14,
        color: '#666',
        justifyContent: 'center'
    },
    amountList: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    cardItem: {
        backgroundColor: '#fff',
        width: 64,
        alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 5,
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 5,
    },
    activeClass: {
        backgroundColor: '#FF2841',
    },
    activeTextClass: {
        color: '#DF2214'
    },
    payTypeListWarp: {
        flex:1,
        backgroundColor: '#fff',
    },
    payTypeList: {
        flex:1,
        flexDirection: 'column',
        height: 50,
        paddingVertical: 5,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'space-around'
    },
    bankListModal: {
        justifyContent: 'center',
        alignItems: 'center',
        height: height-200,
    },

    modalTitleBar: {
        flexDirection: 'row',
        justifyContent:'flex-start',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5E5E5'
    },

    cardIsActiveText: {
        color: '#17A84B',
        fontWeight: 'bold',
        borderColor: '#EFEFEF',
    },
    loginTips: {
        backgroundColor: '#FF0033',
        borderRadius: 5,
        padding: 15,
        alignSelf: 'center',
    },
    loginLink: {
        fontSize: 16,
        color: '#FFF',
    },
    titleText: {
        flex: 10,
        fontSize: 14,

    },
    bankItem: {
        flex: 1,
        flexDirection: 'row',
        width: width,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5E5E5'
    },
    bankIcon: {
        width: 30,
        height: 30,
        marginRight:20
    },
});

const mapStateToProps = (state) => {
    return {
        isLogin: state.match.saveUpdateUser.isLogin,
        saveUpdateUser: state.match.saveUpdateUser,
        bankList: state.common.bankList,
        accountType: state.match.saveAcountType.type
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        saveBankList: (item) => dispatch(saveBankList(item))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Seller);