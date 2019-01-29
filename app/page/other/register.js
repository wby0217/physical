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
    Image,
    ScrollView,
    InteractionManager,
    NativeModules
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Icons, service, ErrorHandle, Action, showToast, stylesGlobal, constants, IndexPopup } from '../mesosphere';
import LinearGradient from 'react-native-linear-gradient';
import Header from 'react-native-header';
import { connect } from 'react-redux';
import { OverlaySpinner } from '../../component/tips';
import { register } from '../../service/authService';
import Api, { HOST } from '../../config/api';
import CheckBox from './checkBox';
import Verify from '../../config/verify';

const { width, height } = Dimensions.get('window');
class Register extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const { params } = state;
        return ({
            header: null,
            headerTitle: '注册',
            headerRight: <TouchableOpacity
                            onPress={() => {
                               navigation.navigate('FreePlay');
                            }}
                            style={{ padding: 15 }}
                        >
                            <Text style={{ color: '#fff', fontSize: 16 }}>免费试玩</Text>
                        </TouchableOpacity>,
            headerBackTitle: null
        })
    }
    constructor(props) {
        super(props)
        this.state = {
            userName: '',
            password: '',
            captcha: '',
            validNameErrMsg: '',
            validPwdErrMsg: '',
            validName: false,
            validPwd: false,
            rightIcon: false,
            secureTextEntry: true,
            isChecked: true,
            endValid: false,
            isConnecting: false,
            invitationCode: '',
            captBase64: '',
            contact: '',
            qq: '',
            popClose: false
        }
        this.navigation = props.navigation;
        this.isApplyAgent = props.navigation.state.params && props.navigation.state.params.routeSource || undefined;
    }
    componentDidMount() {
        this.getCaptcha();
    }
    getCaptcha = () => {
        service.captchUrlService()
        .then(res => {
            this.setState({ captBase64: res.data });
        }).catch(ErrorHandle);
    }
    validUsername = (callback) => {
        // 校验用户名
        const { userName } = this.state;
        if(!Verify.username.test(userName)) {
            this.setState({
                validNameErrMsg: '用户名可包含6-16位字母数字下划线!',
                validName: false,
                rightIcon: false
            }, () => {
                this.changePassBtn();
            })
        } else {
             this.setState({
                validNameErrMsg: '',
                validName: true
            }, () => {
                callback && callback();
                this.changePassBtn();
            });
        }
    }
    validPassword = () => {
        // 校验密码
        const { password } = this.state;
        if(!Verify.password.test(password)) {
            this.setState({
                validPwdErrMsg: '密码6-12位至少包含一个字母及数字!',
                validPwd: false
            },() => {
                this.changePassBtn();
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
    validRepeat = () => {
        // 校验用户名是否重复
        const { userName } = this.state;
        service.checkRepeatUserNameService({ userName })
        .then(res => {
            this.setState({
                validNameErrMsg: '',
                rightIcon: true
            },() => {
                this.changePassBtn();
            })
        },err => {
           if(err && err.errorcode === 101002) {
               this.setState({
                    validNameErrMsg: err.message || '用户名已存在!',
                    validName: false,
                    rightIcon: false
                });
           }
        })
    }
    toggleOverlay = () => {
        // loading层开关
        this.setState({
            isConnecting: !this.state.isConnecting
        })
    }
    changePassBtn = () => {
        const { userName, password, captcha, validName, validPwd, rightIcon, isChecked } = this.state;
        if(!validName || !validPwd || !rightIcon || !captcha || !isChecked) {
            this.setState({
                endValid: false
            })
            return false;
        }
        this.setState({
            endValid: true
        })
    }
    register = () => {
        this.toggleOverlay();
        const { userName, password, captcha, validName, validPwd, rightIcon, isChecked, endValid, invitationCode, qq, contact } = this.state;
        const { navigation, popupInfo } = this.props;
        this.props.dispatch(Action.savePopupInfo({ signIn: popupInfo.signIn, index: undefined }));
        if(!validName || !validPwd || !rightIcon || !captcha || !isChecked || !endValid) {
            return false;
        }
        const data = {
            userName,
            password,
            captcha,
            terminal: Platform.OS,
            invitationCode,
            qq,
            contact
        }
        if(this.isApplyAgent === 'agent') {
            service.applyAgentService(data)
            .then(res => {
                this.toggleOverlay();
                storage.load({
                    key: 'authToken'
                })
                .then(res => {
                    navigation.dispatch(Action.saveAccountType({ type: res.identity }));
                })
                .catch(err => {
                    throw new Error(err);
                });
                showToast('代理申请成功,请等待审核!', {
                    onHidden: () => {
                        navigation.dispatch(Action.updateUser({ isLogin: true, ...res.data }));
                        if(popupInfo && popupInfo.signIn) {
                            this.setState({ popClose: true });
                        } else {
                           this.resetRoute();
                        }
                    }
                })
            })
            .catch(err => {
                this.getCaptcha();
                this.setState({
                    isConnecting: false
                }, () => {
                    ErrorHandle(err)
                })
            })
        } else {
            data.channel = NativeModules.AppConfigurationModule.channel;
            register(data)
            .then(res => {
                this.toggleOverlay();
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
                        if(popupInfo && popupInfo.signIn) {
                            this.setState({ popClose: true });
                        } else {
                           this.resetRoute();
                        }
                    }
                })
            })
            .catch(err => {
                this.getCaptcha();
                this.setState({
                    isConnecting: false
                }, () => {
                    ErrorHandle(err)
                })
            })
        }
    }
    resetRoute = (res) => {
        const { navigation } = this.props;
        navigation.dispatch(Action.resetCenterHome());
    }
    headerRight = () => {
        const { navigation } = this.props;
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('FreePlay');
                }}
                style={{ padding: 5 }}
            >
                <Text style={{ color: '#fff', fontSize: 16 }}>免费试玩</Text>
            </TouchableOpacity>
        )
    }
    popModalClose = (callback) => {
        const { navigation } = this.props;
        this.setState({
            popClose: false
        }, () => {
            if(callback && typeof(callback) === 'function') {
                this.resetRoute();
                callback();
            } else {
                this.resetRoute();
            }
        })
    }
    render() {
        const { navigation, popupInfo } = this.props;
        const { rightIcon, validNameErrMsg, validPwdErrMsg,secureTextEntry, isChecked, endValid, isConnecting, captBase64, popClose } = this.state;
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
                    headerTitle={this.isApplyAgent === 'agent' ? "代理注册" : "注册"}
                    navigation={navigation}
                    // headerRight={this.headerRight}
                    backgroundColor="transparent"
                />
                <ScrollView
                    alwaysBounceVertical={false}
                    keyboardShouldPersistTaps="handled"
                >
                <View style={styles.bodyView}>
                    <View style={styles.inputView}>
                        <View style={styles.inputItemView}>
                            <Text style={styles.inputText}>账号</Text>
                            <TextInput
                            underlineColorAndroid="transparent"
                            onSubmitEditing={Keyboard.dismiss}
                            placeholder="6-16之间由字母/数字/下划线"
                            placeholderTextColor="#999"
                            onBlur={() => {
                                this.validUsername(() => {
                                    this.validRepeat();
                                });
                            }}
                            numberOfLines={1}
                            onChangeText={(userName) => { this.setState({ userName }); }}
                            style={styles.inputItem}
                            />
                            {rightIcon ? <Icons name="icon-ok" color="#17A84B" size={16} /> : null}
                        </View>
                    {validNameErrMsg ? <Animatable.Text animation="bounceIn" style={{ marginLeft: 40, color: '#ab4745', paddingBottom: 5 }}>{validNameErrMsg}</Animatable.Text> : null}
                    <View style={[styles.inputItemView, { borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#E9E9E9' }]}>
                            <Text style={styles.inputText}>密码</Text>
                            <TextInput
                                underlineColorAndroid="transparent"
                                onSubmitEditing={Keyboard.dismiss}
                                secureTextEntry= { secureTextEntry }
                                selectTextOnFocus={false}
                                placeholder="6-12个字符字母及数字"
                                placeholderTextColor="#999"
                                onChangeText={(password) => {
                                    this.setState({ password });
                                }}
                                onBlur= {() => {
                                    this.validPassword()
                                }}
                                numberOfLines={1}
                                style={[ styles.inputItem ]}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        secureTextEntry: !secureTextEntry
                                    })
                                }}
                            >
                                <Icons name={secureTextEntry ? "icon-close-eye" : "icon-open-eyes"} size={20} color="#666666" />
                            </TouchableOpacity>
                    </View>
                    {validPwdErrMsg ? <Animatable.Text animation="bounceIn" style={{ marginLeft: 40, color: '#ab4745', paddingBottom: 5 }}>{validPwdErrMsg}</Animatable.Text> : null}
                    {this.isApplyAgent === 'agent' ? null : <View style={styles.inputItemView}>
                            <Text style={styles.inputText}>邀请码</Text>
                            <TextInput
                            underlineColorAndroid="transparent"
                            onSubmitEditing={Keyboard.dismiss}
                            placeholder="可选填"
                            placeholderTextColor="#999"
                            numberOfLines={1}
                            onChangeText={(invitationCode) => { this.setState({ invitationCode }); }}
                            style={styles.inputItem}
                            />
                    </View>}
                    {this.isApplyAgent === 'agent' ? <View style={styles.inputItemView}>
                            <Text style={styles.inputText}>联系方式</Text>
                            <TextInput
                            underlineColorAndroid="transparent"
                            onSubmitEditing={Keyboard.dismiss}
                            placeholder="可选填"
                            placeholderTextColor="#999"
                            numberOfLines={1}
                            onChangeText={(contact) => { this.setState({ contact }); }}
                            style={styles.inputItem}
                            />
                    </View> : null}
                    {this.isApplyAgent === 'agent' ? <View style={styles.inputItemView}>
                            <Text style={styles.inputText}>Q Q 号码</Text>
                            <TextInput
                                underlineColorAndroid="transparent"
                                onSubmitEditing={Keyboard.dismiss}
                                placeholder="可选填"
                                placeholderTextColor="#999"
                                numberOfLines={1}
                                onChangeText={(qq) => { this.setState({ qq }); }}
                                style={styles.inputItem}
                            />
                    </View> : null}
                    <View style={[styles.inputItemView, { borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#E9E9E9' }]}>
                        <Text style={styles.inputText}>验证码</Text>
                        <TextInput
                        underlineColorAndroid="transparent"
                        onSubmitEditing={Keyboard.dismiss}
                        selectTextOnFocus={false}
                        placeholderTextColor="#999"
                        onChangeText={(captcha) => { this.setState({ captcha } ); if(captcha){this.changePassBtn()}}}
                        style={{ flex: 1, paddingLeft: 15 }}
                        onBlur={this.changePassBtn}
                        />
                        <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this.getCaptcha}
                        >
                        <Image source={{ uri: captBase64 }} style={{ width: 100, height: 50, resizeMode: 'contain' }} />
                        </TouchableOpacity>
                    </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', height: 45 }}>
                    <CheckBox
                        label="我已同意各项开户条约"
                        checked={isChecked}
                        activeOpacity={0.9}
                        textRight={'"开户协议"'}
                        labelStyle={{ color: '#fff', fontSize: 12, paddingLeft: 5, backgroundColor: 'transparent' }}
                        onPressRight={() => { navigation.navigate('Protocals') }}
                        underlayColor={{ backgroundColor: 'transparent' }}
                        onChange={(checked) => { this.setState({ isChecked: checked }, () => { this.changePassBtn()}); }}
                        />
                    </View>
                    <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.register}
                    disabled={!endValid}
                    style={[styles.buttonBase,!endValid ?{ backgroundColor: stylesGlobal.loginOrReg.disableBtn.bg }: { backgroundColor: stylesGlobal.loginOrReg.activeBtn.bg}]}
                    >
                    <Text style={[{ fontSize: 16, fontWeight: 'bold' }, !endValid ? {color: stylesGlobal.loginOrReg.disableBtn.txtColor}:{color: stylesGlobal.loginOrReg.activeBtn.txtColor}]}>注册</Text>
                    </TouchableOpacity>
                </View>
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
    linearGradient: {
        flex: 1
    },
    container: {
        width,
        height,
        backgroundColor: '#17A84B'
    },
    bodyView: {
        paddingHorizontal: 15
    },
    inputView: {
        backgroundColor: '#fff',
        borderRadius: 5,
        flexDirection: 'column',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginTop: 50
    },
    inputItemView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
    },
    inputItem: {
        height: 40,
        flex: 1,
        fontSize: 16,
        paddingLeft: 15
    },
    inputText: {
        fontSize: 16,
        color: '#333'
   },
    buttonBase: {
        height: 35,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const mapStateToProps = (state) => {
    return {
        popupInfo: state.match.savePopupInfo.popupInfo,
    }
}
export default connect(mapStateToProps)(Register);