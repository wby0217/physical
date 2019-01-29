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
    DeviceEventEmitter,
    InteractionManager
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import Header from 'react-native-header';
import { Icons, service, ErrorHandle, Action, showToast, stylesGlobal, constants, IndexPopup } from '../mesosphere';
import LinearGradient from 'react-native-linear-gradient';
import { signIn, guestSignUp } from '../../service/authService';
import Verify from '../../config/verify';
import { OverlaySpinner } from '../../component/tips';

const { width, height } = Dimensions.get('window');
const isIos = Platform.OS === 'ios';
class Login extends Component {
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
            userName: '',
            password: '',
            validName: false,
            validPwd: false,
            validNameErrMsg: '',
            validPwdErrMsg: '',
            endValid: false,
            isConnecting: false,
            normalOrAgent: false,  // 正常用户或代理用户登录
            popClose: false
        };
    }
    toLogin = () => {
        // 去登录
        const { userName, password, validName, validPwd, endValid, normalOrAgent } = this.state;
        const { navigation, popupInfo } = this.props;
        const routeNames  = navigation.state.params && navigation.state.params.routeNames;
        if(!validPwd || !validName || !endValid ) return false;
        const data = {
            userName,
            password,
            terminal: Platform.OS
        }
        this.toggleOverlay();
        signIn(data, normalOrAgent)
        .then(res => {
            this.toggleOverlay();
            showToast('登录成功', {
                onHidden: () => {
                    storage.load({
                        key: 'authToken'
                    })
                    .then(res => {
                        navigation.dispatch(Action.saveAccountType({ type: res.identity }));
                    })
                    .catch(err => {
                        throw new Error(err);
                    });
                    navigation.dispatch(Action.updateUser({ isLogin: true, ...res.data }));
                    const params = navigation.state.params;
                    params && params.params && params.params.countDown && params.params.countDown();
                    // navigation.goBack();
                    if(!normalOrAgent && popupInfo && popupInfo.signIn) {
                        this.setState({ popClose: true });
                    } else {
                        navigation.goBack();
                    }
                }
            })
        })
        .catch(async err => {
            this.setState({
                isConnecting: false
            },async () => {
                if(err.errorcode && err.errorcode == '101027') {
                    navigation.navigate('VerifyUser', { clearInput: this.clearInput })
                } else {
                    ErrorHandle(err);
                }
            })
        })
    }
    toggleOverlay = () => {
        // loading层开关
        this.setState({
            isConnecting: !this.state.isConnecting
        })
    }
    validUsername = () => {
        // 校验用户名
        const { userName } = this.state;
        if(!Verify.username.test(userName)) {
            this.setState({
                validNameErrMsg: '用户名可包含6-16位字母数字下划线!',
                validName: false,
                endValid: false
            })
        } else {
             this.setState({
                validNameErrMsg: '',
                validName: true
            }, () => {
                this.changePassBtn();
            });
        }
    }
    clearInput = () => {
        this.setState({
            password: ''
        })
    }
    validPassword = () => {
        // 校验密码
        const { password } = this.state;
        if(!Verify.username.test(password)) {
            this.setState({
                validPwdErrMsg: '密码6-12位至少包含一个字母数字!',
                validPwd: false,
                endValid: false
            })
        } else {
            this.setState({
                validPwdErrMsg: '',
                validPwd: true
            }, () => {
                this.changePassBtn();
            })
        }
    }
    changePassBtn = () => {
        const { validName, validPwd } = this.state;
        if(!validName || !validPwd ) {
            this.setState({
                endValid: false
            })
            return false;
        }
        this.setState({
            endValid: true
        })
    }
    toReigster = () => {
        // 去注册
        const { navigation } = this.props;
        navigation.navigate('Register');
    }
    toFreePlay = () => {
        // 免费试玩
        const { navigation } = this.props;
        // navigation.navigate('FreePlay');
        const data = {
            terminal: Platform.OS
        }
        guestSignUp(data)
        .then(res => {
            storage.load({
                key: 'authToken'
            })
            .then(res => {
                navigation.dispatch(Action.saveAccountType({ type: res.identity }));
            })
            .catch(err => {
                throw new Error(err);
            });
            showToast('注册成功!', {
                onHidden: () => {
                    navigation.dispatch(Action.updateUser({ isLogin: true, ...res.data }));
                    navigation.dispatch(Action.resetIndexHome());
                }
            })
        })
        .catch(err => {
            this.setState({
                isConnecting: false
            }, () => ErrorHandle(err))
        })
    }
    headerLeft = () => {
        const { navigation } = this.props;
        const params = navigation.state.params;
        return (
            <TouchableOpacity
                onPress={() => {
                    params && params.params && params.params.countDown && params.params.countDown();
                    navigation.goBack()
                }}
                style={{ padding: 5 }}
            >
                <Icons name="icon-del" color="#fff" size={16} />
            </TouchableOpacity>
        )
    }
    toggleLoginRole = () => {
        // 切换登录角色
        const { normalOrAgent } = this.state;
        this.setState({
            normalOrAgent: !normalOrAgent
        })
    }
    popModalClose = (callback) => {
        const { navigation } = this.props;
        this.setState({
            popClose: false
        }, () => {
            if(callback && typeof(callback) === 'function') {
                navigation.goBack();
                callback();
            } else {
                navigation.goBack();
            }
        })
    }
    render() {
        const { validPwdErrMsg, validNameErrMsg, endValid, isConnecting, normalOrAgent, popClose } = this.state;
        const { navigation, isAgent, popupInfo, saveUpdateUser } = this.props;
        return (
            <View style={styles.container}>
                <LinearGradient
                    start={{ x: 1.0, y: 1.0 }} end={{ x: 1.0, y: 0.0 }}
                    locations={[0, 0.5, 1.0]}
                    colors={['#83D74F', '#43BB4D', '#17A84B']} style={styles.linearGradient}
                >
                <ImageBackground
                    source={require('../../assets/images/log_bg.png')}
                    style={{ width, height }}
                >
                <Header
                    headerTitle={ normalOrAgent ? '特殊代理登录' : '正式账号登录' }
                    navigation={navigation}
                    headerLeft={this.headerLeft}
                    backgroundColor="transparent"
                />
                    <ScrollView alwaysBounceVertical={false}>
                    <View style={styles.bodyView}>
                        <View style={styles.inputView}>
                            <View style={styles.inputItemView}>
                                <View style={styles.inputItemIconView}>
                                    <Icons name="icon-avatar" size={22} color="#BBBBBB" />
                                </View>
                                <TextInput
                                    autoCapitalize="none"
                                    underlineColorAndroid="transparent"
                                    onSubmitEditing={Keyboard.dismiss}
                                    placeholder="请输入用户名"
                                    onChangeText={(userName) => {
                                        this.setState({ userName });
                                    }}
                                    defaultValue={this.state.userName}
                                    onBlur={this.validUsername}
                                    style={styles.inputItem}
                                />
                            </View>
                            {validNameErrMsg ? <Animatable.Text animation="bounceIn" style={{ marginLeft: 40, color: '#ab4745', paddingBottom: 5 }}>{validNameErrMsg}</Animatable.Text> : null}
                            <View style={[styles.inputItemView, { borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#E9E9E9' }]}>
                                <View style={styles.inputItemIconView}>
                                    <Icons name="icon-pwd-lock" size={20} color="#BBBBBB" />
                                </View>
                                <TextInput
                                    underlineColorAndroid="transparent"
                                    onSubmitEditing={Keyboard.dismiss}
                                    secureTextEntry
                                    selectTextOnFocus={false}
                                    placeholder="请输入密码"
                                    onChangeText={(password) => {
                                        this.setState({ password }, () => {
                                            this.validPassword()
                                        });
                                    }}
                                    defaultValue={this.state.password}
                                    onBlur={this.validPassword}
                                    style={[styles.inputItem]}
                                />
                            </View>
                            {validPwdErrMsg ? <Animatable.Text animation="bounceIn" style={{ marginLeft: 40, color: '#ab4745', paddingBottom: 5 }}>{validPwdErrMsg}</Animatable.Text> : null}
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    showToast('请联系在线客服找回密码')
                                }}
                            >
                                <Text style={{ color: '#fff', fontSize: 14, marginVertical: 10, fontWeight: 'bold', backgroundColor: 'transparent' }}>忘记密码?</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={this.toLogin}
                            style={[styles.buttonBase, !endValid ?{ backgroundColor: stylesGlobal.loginOrReg.disableBtn.bg }: { backgroundColor: stylesGlobal.loginOrReg.activeBtn.bg }]}
                            disabled={!endValid}
                        >
                            <Text style={[{ fontSize: 16, fontWeight: 'bold' }, !endValid ? {color: stylesGlobal.loginOrReg.disableBtn.txtColor}:{color: stylesGlobal.loginOrReg.activeBtn.txtColor} ]}> 登录 </Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={this.toReigster}
                            style={[styles.buttonBase, { backgroundColor: '#007A2B', marginTop: 15 }]}
                        >
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}> 注册 </Text>
                        </TouchableOpacity> */}
                        {/* <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#fff', marginTop: 25 }} /> */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 50 }}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={this.toReigster}
                                style={{ alignItems: 'center',}}
                            >
                                <Text
                                style={[{ color: '#fff', paddingHorizontal: 10, fontSize: 14, backgroundColor: 'transparent' }]}
                                >立即注册</Text>
                            </TouchableOpacity>
                            <Text style={{ color: '#fff', backgroundColor: 'transparent' }}>|</Text>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={this.toFreePlay}
                                style={{ alignItems: 'center',}}
                            >
                                <Text
                                style={[{ color: '#fff', paddingHorizontal: 10, fontSize: 14, backgroundColor: 'transparent' }]}
                                >免费试玩</Text>
                            </TouchableOpacity>
                            {
                                isAgent ?
                                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ color: '#fff', backgroundColor: 'transparent' }}>|</Text>
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={this.toggleLoginRole}
                                        style={{ alignItems: 'center' }}
                                    >
                                        <Text
                                        style={[{ color: '#fff', paddingHorizontal: 10, fontSize: 14, backgroundColor: 'transparent' }]}
                                        >{ normalOrAgent ? '正式账号登入' : '特殊代理登入' }</Text>
                                    </TouchableOpacity>
                                </View> : null
                            }
                        </View>
                    </View>
                    {/* <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#fff', marginTop: 25, marginHorizontal: 15 }} />
                    <View
                        style={{ alignItems: 'center', marginTop: -6 }}
                    >
                        <Text
                        style={{ color: '#fff', paddingHorizontal: 10, fontWeight: 'bold', fontSize: 12, backgroundColor: '#4cbf4d' }}
                        >第三方账号登录</Text>
                    </View>
                        <View style={{ backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                            <TouchableOpacity
                                style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                            >
                                <Icons name="icon-cycle-wechat" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                            >
                                <Icons name="icon-qq" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                            >
                                <Icons name="icon-weibo" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View> */}
                    </ScrollView>
                </ImageBackground>
                <IndexPopup
                    data={popupInfo && popupInfo.signIn}
                    isVisible={popClose}
                    onClose={this.popModalClose}
                    navigation={navigation}
                />
                </LinearGradient>
                <OverlaySpinner
                    visible= {isConnecting}
                    cancelable= {true}
                    onTouchShade={this.toggleOverlay}
                />
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
     bodyView: {
        paddingHorizontal: 15
    },
    inputView: {
        backgroundColor: '#fff',
        borderRadius: 5,
        flexDirection: 'column',
        paddingHorizontal: 10,
        marginTop: 50
    },
    inputItemView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50
    },
    inputItem: {
        height: 40,
        fontSize: 16,
        flex: 12,
        marginLeft: 5,
        padding: 0
    },
    inputItemIconView: {
        flex: 1,
        alignItems: 'center',
        height: 40,
        justifyContent: 'center'
    },
    buttonBase: {
        height: 35,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const mapStateToProps = (state) => {
    return {
        isAgent: state.match.changeUserStatus.isAgent,
        popupInfo: state.match.savePopupInfo.popupInfo,
        saveUpdateUser: state.match.saveUpdateUser,
    }
}

export default connect(mapStateToProps)(Login);