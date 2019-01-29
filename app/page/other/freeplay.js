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
    Image,
    ScrollView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { NavigationActions } from 'react-navigation';
import Header from 'react-native-header';
import { Icons, service, ErrorHandle, Action, showToast, stylesGlobal, constants } from '../mesosphere';
import { OverlaySpinner } from '../../component/tips';
import LinearGradient from 'react-native-linear-gradient';
import { guestSignUp } from '../../service/authService';
import Api, { HOST } from '../../config/api';
import CheckBox from './checkBox';
import Verify from '../../config/verify';

const { width, height } = Dimensions.get('window');
const USERPREFIX = 'guest';
const captchUrl = HOST.concat(Api.captchUrl, '?');
export default class FreePlay extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const { params } = state;
        return ({
            header: null,
            headerTitle: '免费试玩',
        })
    }
    constructor(props) {
        super(props)
        this.state = {
            userName: '',
            password: '',
            validNameErrMsg: '',
            validPwdErrMsg: '',
            captcha: '',
            validName: false,
            validPwd: false,
            rightIcon: false,
            secureTextEntry: true,
            isChecked: true,
            endValid: false,
            captchaURL: captchUrl,
            isConnecting: false
        }
        this.navigation = props.navigation;
    }
    validUsername = (callback) => {
        // 校验用户名
        const { userName } = this.state;
        if(!Verify.username.test(userName)) {
            this.setState({
                validNameErrMsg: '用户名可包含6-16位字母数字下划线!',
                validName: false,
                rightIcon: false,
            },() => {
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
                validPwd: false,
            }, () => {
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
        service.checkRepeatUserNameService({ userName: USERPREFIX+userName })
        .then(res => {
            this.setState({
                validNameErrMsg: '',
                rightIcon: true
            })
        },err => {
           if(err && err.errorcode === 101002) {
               this.setState({
                    validNameErrMsg: err.message || '用户名已存在!',
                    validName: false,
                    rightIcon: false,
                    endValid: false
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
        const { validName, validPwd, rightIcon, isChecked, captcha } = this.state;
        if(!validName || !validPwd || !isChecked || !captcha) {
            this.setState({
                endValid: false
            })
            return false;
        }
        this.setState({
            endValid: true
        })
    }
    getCaptcha = () => {
        this.setState({
            captchaURL: captchUrl + new Date().getTime()
        })
    }
    register = () => {
        this.toggleOverlay();
        const { userName, password, validName, validPwd, rightIcon, isChecked, endValid, captcha } = this.state;
        const { navigation } = this.props;
        if(!validName || !validPwd || !rightIcon || !isChecked || !endValid) {
            return false;
        }
        const data = {
            userName: USERPREFIX+userName,
            password,
            captcha,
            terminal: Platform.OS
        }
        guestSignUp(data)
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
                    navigation.dispatch(Action.resetIndexHome());
                }
            })
        })
        .catch(err => {
            this.getCaptcha();
            this.setState({
                isConnecting: false
            }, () => ErrorHandle(err))
        })
    }
    render() {
        const { rightIcon, validNameErrMsg, validPwdErrMsg, secureTextEntry, isChecked, endValid, captchaURL, isConnecting } = this.state;
        const { navigation } = this.props;
        return (
           <View style={styles.container}>
            <LinearGradient
              start={{ x: 1.0, y: 1.0 }} end={{ x: 1.0, y: 0.0 }}
              locations={[0, 0.5, 1.0]}
              colors={['#83D74F', '#43BB4D', '#17A84B']} style={styles.linearGradient}
            >
            <Header
                headerTitle="免费试玩"
                navigation={navigation}
                backgroundColor="transparent"
            />
            <ScrollView alwaysBounceVertical={false}>
              <View style={styles.bodyView}>
                <View style={styles.inputView}>
                  <View style={styles.inputItemView}>
                    <Text style={styles.inputText}>账号</Text>
                    <Text style={{ color: '#666' }}>guest </Text>
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
                      autoFocus={true}
                      onChangeText={(userName) => { this.setState({ userName }); }}
                      style={[ styles.inputItem, { padding: 0 } ]}
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
                            style={[ styles.inputItem]}
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
                      <Image source={{ uri: captchaURL }} style={{ width: 100, height: 50, resizeMode: Image.resizeMode.contain }} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', height: 45 }}>
                   <CheckBox
                      label="我已经满合法博彩年龄，且同意各项开户条约"
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
                  style={[styles.buttonBase,!endValid ?{ backgroundColor: stylesGlobal.loginOrReg.disableBtn.bg }: { backgroundColor: stylesGlobal.loginOrReg.activeBtn.bg }]}
                >
                  <Text style={[{ fontSize: 16, fontWeight: 'bold' }, !endValid ? {color: stylesGlobal.loginOrReg.disableBtn.txtColor}:{color: stylesGlobal.loginOrReg.activeBtn.txtColor}]}>注册</Text>
                </TouchableOpacity>
              </View>
              </ScrollView>
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
    },
    inputText: {
        fontSize: 16,
        color: '#333',
        marginRight: 5
   },
    buttonBase: {
        height: 35,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});