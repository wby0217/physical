// 威廉用户安全验证
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TextInput,
    Keyboard,
    TouchableOpacity,
    Platform,
    ImageBackground,
    ScrollView,
    DeviceEventEmitter
} from 'react-native';
import { connect } from 'react-redux';
import Header from 'react-native-header';
import DropdownAlert from 'react-native-dropdownalert';
import { Icons, service, ErrorHandle, Action, showToast, stylesGlobal, constants } from '../../mesosphere';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { signIn, guestSignUp } from '../../../service/authService';
import Verify from '../../../config/verify';
import { OverlaySpinner } from '../../../component/tips';
import { verifyUser } from '../../../data/message.json';


const { width, height } = Dimensions.get('window');
const isIos = Platform.OS === 'ios';
class VerifyUser extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const { params } = state;
        return ({
            header: null
        })
    }
    constructor(props) {
        super(props)
         this.state = {
            endValid: false,
            bankAccount: '',
            bankUserName: ''
        };
    }
    nextStep = () => {
        // 下一步
        const { bankAccount, bankUserName } = this.state;
        const { navigation } = this.props;
        if( !bankAccount || !Verify.bankCard.test(bankAccount)) {
            this.dropdown.alertWithType('warn', '提醒!', '请输入正确的银行卡号');
        } else if( !bankUserName ){
            this.dropdown.alertWithType('warn', '提醒!', '请输入您的真实姓名');
        } else {
            service.verifyBankService({
                bankAccount,
                bankUserName
            }).then(res => {
                const callback = (navigation.state.params && navigation.state.params.clearInput && navigation.state.params.clearInput()) || (() => {});
                this.props.navigation.navigate('ResetPwd', { key: navigation.state.key, clearInput: callback });
            }).catch(err => {
                this.dropdown.alertWithType('error', '验证失败!', err.message);
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
        const params = navigation.state.params;
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.goBack();
                }}
                style={{ padding: 5 }}
            >
                <Icons name="icon-del" color="#fff" size={16} />
            </TouchableOpacity>
        )
    }
    onClose = (data) => {
    // data = {type, title, message, action}
    // action means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
    }
    render() {
        const { validPwdErrMsg, validNameErrMsg, endValid, isConnecting, normalOrAgent } = this.state;
        const { navigation, isAgent } = this.props;
        return (
            <View style={styles.container}>
                <LinearGradient
                    start={{ x: 1.0, y: 1.0 }} end={{ x: 1.0, y: 0.0 }}
                    locations={[0, 0.5, 1.0]}
                    colors={['#83D74F', '#43BB4D', '#17A84B']} style={styles.linearGradient}
                >
                    <Header
                        headerTitle='安全验证'
                        navigation={navigation}
                        headerLeft={this.headerLeft}
                        backgroundColor="transparent"
                    />
                    <KeyboardAwareScrollView>
                        <View style={{ margin: 20, backgroundColor: '#fff', borderRadius: 10 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: '#FFF1DA', padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Icons name="icon-cycle-warn" size={18} color="#D0021B" />
                                </View>
                                <View style={{ flex: 8 }}>
                                    <Text style={{ backgroundColor: 'transparent', fontSize: 12, color: '#666666', lineHeight: 18 }}>{verifyUser}</Text>
                                </View>
                            </View>
                            <View style={{ paddingBottom: 20, paddingTop: 10 }}>
                                <View style={{ paddingHorizontal: 15 }}>
                                    <View style={{ height: 40, justifyContent: 'center',  }}>
                                        <Text style={{ color: '#333333' }}>请输入您绑定的银行卡后四位</Text>
                                    </View>
                                    <TextInput
                                        underlineColorAndroid="transparent"
                                        onChangeText={(text) => {
                                            this.setState({ bankAccount: text })
                                        }}
                                        style={{ backgroundColor: '#E6E6E6', height: 40, paddingLeft: 5 }}
                                    />
                                </View>
                                <View style={{ paddingHorizontal: 15 }}>
                                    <View style={{ height: 40, justifyContent: 'center',  }}>
                                        <Text style={{ color: '#333333' }}>请输入您的真实姓名</Text>
                                    </View>
                                    <TextInput
                                        underlineColorAndroid="transparent"
                                        onChangeText={(text) => {
                                            this.setState({ bankUserName: text })
                                        }}
                                        style={{ backgroundColor: '#E6E6E6', height: 40, paddingLeft: 5 }}
                                    />
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={this.nextStep}
                            style={[styles.buttonBase, { backgroundColor: stylesGlobal.loginOrReg.activeBtn.bg }]}
                        >
                            <Text style={[{ fontSize: 16, fontWeight: 'bold' },{color: stylesGlobal.loginOrReg.activeBtn.txtColor} ]}> 下一步 </Text>
                        </TouchableOpacity>
                    </KeyboardAwareScrollView>
                </LinearGradient>
                <OverlaySpinner
                    visible= {isConnecting}
                    cancelable= {true}
                    onTouchShade={this.toggleOverlay}
                />
                <DropdownAlert ref={ref => this.dropdown = ref} onClose={data => this.onClose(data)} closeInterval={1800} />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    linearGradient: {
        flex: 1
    },
    buttonBase: {
        height: 35,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20
    }
})

const mapStateToProps = (state) => {
    return {
        isAgent: state.match.changeUserStatus.isAgent
    }
}

export default connect(mapStateToProps)(VerifyUser);