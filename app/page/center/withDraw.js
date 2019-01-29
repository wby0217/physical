import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Platform,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomKeyboard from 'react-native-custom-keyboard';
import Password from '../../component/react-native-password';
import { showToast, ErrorHandle, Header, Verify, Icons } from '../mesosphere';
import { OverlaySpinner } from '../../component/tips';
import service from '../../service';
import stylesConfig from '../../assets/styles';

const isIos = Platform.OS === 'ios' ;
const { width, height } = Dimensions.get('window');
class WithDraw extends Component {
    static navigationOptions = ({ navigation }) => {
        return ({
            header: null,
        })
    };
    constructor(props) {
        super(props);
        this.state = {
            bankCard: props.navigation.state.params.userBankCard || [],
            userInfo: {},
            isCanSubmit: false,
            isConnecting: false,
            isOpenModal: false,
            amount: '',
            fundsPassword: '',
            isOpenKeyboard: true,
            keyboardType: 'amount'
        };
        this.setButtonStatus = this.setButtonStatus.bind(this);
        this.toggleSpinner = this.toggleSpinner.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.togglePasswordInput = this.togglePasswordInput.bind(this);
        this.openPasswordInput = this.openPasswordInput.bind(this);
        this.toggleCustomKeyboard = this.toggleCustomKeyboard.bind(this);
        this.onKeyboardPress = this.onKeyboardPress.bind(this);
        this.onKeyboardConfirm = this.onKeyboardConfirm.bind(this);
        this.navigate = props.navigation.navigate;
        // this.navigation = props.navigation;
    };
    async componentDidMount() {
        const { navigation } = this.props;
        if(!navigation.state.params || !navigation.state.params.userBankCard || !navigation.state.params.userBankCard.length) {
            try{
                const results = await service.getUserBanksService();
                this.setState({
                    bankCard: results.data
                });
            }catch(err) {
                ErrorHandle(err);
            }
        }
    }
    setButtonStatus(flag) {
        this.setState({
            isCanSubmit: flag
        })
    };

    submitForm(text) {
        const { fundsPassword, bankCard, amount } = this.state;
        const pwd = text || fundsPassword;
        if (pwd.length === 6) {
            const data ={
                userBankId: bankCard[0].id,
                amount: parseFloat(amount),
                fundsPassword: pwd
            };
            this.toggleSpinner(true);
            service.withDraw(data).then(res => {
                this.toggleSpinner(false);
                showToast(res.message, {onHide: () => {
                    // this.navigate('Center');
                    this.props.navigation.goBack();
                }})
            }).catch(err => {
                this.toggleSpinner(false);
                ErrorHandle(err)
            })
        }
    };

    toggleSpinner(status, done) {
        this.setState({
            isConnecting: status !== undefined ? status : !this.state.isConnecting
        }, () => {
            done && done()
        });
    };

    togglePasswordInput(status, done) {
        this.setState({
            isOpenModal: status !== undefined ? status : !this.state.isOpenModal,
        }, () => {
            done && done()
        });
    };
    openPasswordInput() {
        const { saveUpdateUser } = this.props;
        const allowWithDrawAmount = saveUpdateUser.accountBalance;
        const amount = parseFloat(this.state.amount);
        if (!amount) {
            return showToast('请输入正确的金额')
        }
        if (amount > parseFloat(allowWithDrawAmount)) {
            return showToast('输入金额不能大于可提现金额', {onHide: () => {
                this.setState({
                    keyboardType: 'amount'
                })
            }});
        }
        // if (amount < userInfo.withdrawMinAmount) {
        //     return showToast(`当前最小提现金额为 ${userInfo.withdrawMinAmount} 元`);
        // }
        // if (amount > userInfo.withdrawMaxAmount) {
        //     return showToast(`当前最大提现金额为 ${userInfo.withdrawMaxAmount} 元`)
        // }
        this.togglePasswordInput(true, () => {
            this.setState({
                keyboardType: 'fundsPassword'
            })
        });
    };
    toggleCustomKeyboard (status, done) {
        this.setState({
            isOpenKeyboard: status !== undefined ? status : !this.state.isOpenKeyboard
        }, () => {
            done && done()
        })
    }
    onKeyboardPress (text) {
        if (this.state.keyboardType === 'amount') {
            const inputArr = text.split('.');
            if((inputArr.length > 1) && inputArr[1].length > 2) return;
            if(Verify.isAmount.test(text)) {
                this.setState({ amount: text }, () => {
                    this.setButtonStatus(true)
                });
            } else {
                this.setState({ amount: text }, () => {
                    this.setButtonStatus(false)
                });
            }
            
        } else {
            this.setState({ fundsPassword: text })
        }

    }
    onKeyboardConfirm (text) {
        const { keyboardType } = this.state;
        if (keyboardType === 'amount') {
            this.openPasswordInput();
        } else if (keyboardType === 'fundsPassword'){
            // this.submitForm()
        }

    }
    headerRight = () => {
        return (
            <TouchableOpacity  onPress={() => {this.navigate('WithDrawRef')}}>
                <Text style={widthDrawStyle.headerRightText}>限额说明</Text>
            </TouchableOpacity>
        )
    }
    headerLeft = () => {
        const { navigation } = this.props;
        const { params } = navigation.state;
        return (
            <TouchableOpacity
                onPress={() => {
                    if(params && params.key) {
                        navigation.goBack(params.key)
                    } else {
                        navigation.goBack();
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
        const {bankCard, keyboardType, amount, isOpenModal, isOpenKeyboard, fundsPassword, isConnecting, isCanSubmit} = this.state;
        const bankImage = !!bankCard.length && !!bankCard[0].image ?  {uri: bankCard[0].image} : require('../../assets/images/icon_bank.png');
        return (
            <View style={widthDrawStyle.container}>
                <Header
                    headerTitle="提现"
                    headerRight={this.headerRight}
                    navigation = {navigation}
                    headerLeft={this.headerLeft}
                />
                <Text style={widthDrawStyle.userInfo}>
                    {saveUpdateUser.userName} 余额：
                    <Text>{saveUpdateUser.accountBalance}</Text>
                    元
                </Text>
                <View style={memberBankCard.cardList}>
                    <Image style={memberBankCard.bankIcon} source={bankImage}/>
                    <View>
                        <Text style={memberBankCard.bank}>{!!bankCard.length && bankCard[0].name}</Text>
                        <Text style={memberBankCard.text}>
                            尾号 {!!bankCard.length && bankCard[0].account.substr(!!bankCard.length && bankCard[0].account.length-4)} 储蓄卡
                        </Text>
                    </View>
                </View>
                <View style={widthDrawStyle.inputBox}>
                    <Text style={widthDrawStyle.title}>提现金额</Text>
                    <View style={{flexDirection: 'row'}}>
                        <View style={widthDrawStyle.symbol}>
                            <Text style={{fontSize: 28}}>¥</Text>
                        </View>
                        <Text style={[widthDrawStyle.input, {color: !!amount ? '#333' : '#999'}]}
                              onPress={() => this.toggleCustomKeyboard(!isOpenKeyboard, () => {
                                  this.setState({
                                      keyboardType: 'amount'
                                  });
                              })}>
                            {!!amount ? amount : '0.00'}
                        </Text>
                    </View>
                    <Text style={widthDrawStyle.tips}>
                        可提现金额: {saveUpdateUser.allowWithdrawAmount} 元
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('WithdrawCheckList');
                        }}
                        style={{ paddingHorizontal: 15, paddingVertical: 5 }}
                    >
                        <Text style={{ color: '#FF0000' }}>稽核详情</Text>
                    </TouchableOpacity>
                </View>
                <View style={widthDrawStyle.nextStep}>
                    <TouchableOpacity
                        style={[widthDrawStyle.nextStepInner,
                            { backgroundColor: isCanSubmit ? stylesConfig.activeBtn.bg : stylesConfig.disableBtn.bg } ]}
                        onPress={() => {
                            this.openPasswordInput();
                            this.toggleCustomKeyboard(true, () => {
                                this.setState({
                                    keyboardType: 'fundsPassword'
                                })
                            })
                        }}
                        activeOpacity={isCanSubmit ? 0.5 : 1}
                        disabled={!isCanSubmit}
                    >
                        <Text style={[widthDrawStyle.nextStepTxt, isCanSubmit ? {color: '#fff'} : null]}>下一步</Text>
                    </TouchableOpacity>
                </View>
                <Modal style={widthDrawStyle.modal}
                       position={"top"}
                       ref={"modal"}
                       swipeToClose={false}
                       backdropPressToClose={false}
                       onClosed={() => this.togglePasswordInput(false, () => {
                           this.setState({
                               fundsPassword: '',
                               isOpenKeyboard: false,
                               keyboardType: 'amount'
                           })
                       })}
                       isOpen={isOpenModal}>
                    <View style={widthDrawStyle.modalTopBar}>
                        <Icon style={widthDrawStyle.modalCloseBtn}
                              name="ios-close-circle-outline"
                              size={24} color="#5B5B5B"
                              onPress={() => this.togglePasswordInput(false, () => {
                                  this.setState({
                                      fundsPassword: '',
                                      isOpenKeyboard: false,
                                      keyboardType: 'amount'
                                  })
                              })}/>
                        <Text style={widthDrawStyle.modalTitle}>请输入资金密码</Text>
                    </View>
                    <Text style={widthDrawStyle.subTitle}>提现</Text>
                    <Text style={widthDrawStyle.amount}>¥ {parseFloat(amount).toFixed(2)}</Text>
                    <Password maxLength={6}
                              onPress={() => {this.toggleCustomKeyboard(true)}}
                              onChange={(text) => {this.submitForm(text)}}
                              password={fundsPassword}/>
                </Modal>
                <CustomKeyboard isOpen={isOpenKeyboard}
                                backdrop={keyboardType === 'amount'}
                                defaultValue={keyboardType === 'amount' ? amount : fundsPassword}
                                underlayColor={'#E3E3E3'}
                                onClosedHandle={() => this.toggleCustomKeyboard(false)}
                                onButtonPress={(text) => {this.onKeyboardConfirm(text)}}
                                onTextChange={(text) => {this.onKeyboardPress(text)}}/>
                <OverlaySpinner visible= {isConnecting}/>
            </View>
        )
    }
}
const memberBankCard = StyleSheet.create({
    container: {
        padding: 10,
    },
    cardList: {
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#FFF',
        justifyContent:'flex-start',
        alignItems: 'center',
        borderRadius: 5,
    },
    bankIcon: {
        width: 40,
        height: 40,
        marginRight: 10
    },
    bank: {
        fontSize: 16,
        color: '#373737',
        paddingVertical: 5
    },
    text: {
        fontSize: 14,
        color: '#757575',
        paddingVertical: 5
    }
});
const widthDrawStyle = StyleSheet.create({
    container: {
        flex: 1
    },
    headerRightText: {
        color: '#FFF',
        paddingHorizontal: 5
    },
    userInfo: {
        padding: 10
    },
    inputBox: {
        backgroundColor: '#FFF',
        padding: 10,
        flexDirection: 'column'
    },
    title: {
        paddingBottom: 20,
        fontSize: 14,
        color: '#666',
    },
    symbol:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: isIos ? 30 : 60,
    },
    inputFile: {
        flexDirection: 'row',
        alignItems: 'center' ,
        justifyContent:'flex-start',
    },
    input: {
        fontSize: 28,
        flex: 10,
        height: isIos ? 30 : 'auto',
        paddingVertical: isIos ? 0 : 11,
    },
    tips: {
        color: '#6A6A6A',
        paddingVertical: 10,

    },
    modal: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: 280,
        height: 190,
        borderRadius: 8,
        marginTop: 100,
    },
    modalTopBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding:10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5E5E5',
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    amount: {
        fontSize: 34,
        marginBottom: 10},
    modalCloseBtn: {
        flex: 1,
    },
    modalTitle: {
        flex: 2,
        color: '#333',
        // padding: 20,
        fontSize: 16
    },
    nextStep: {
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
    },
    nextStepInner: {
        flex: 1,
        width: width / 1.08,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DFDFE9',
        borderRadius: 5,
    },
    nextStepTxt: {
        color: '#9898A8',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

const mapStateToProps = (state) => {
    return {
        isLogin: state.match.saveUpdateUser.isLogin,
        saveUpdateUser: state.match.saveUpdateUser,
    }
};
export default connect(mapStateToProps)(WithDraw);
