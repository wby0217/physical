// 修改登录密码

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Linking,
    Keyboard,
    TextInput
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { OverlaySpinner } from '../../component/tips';
import { service, ErrorHandle, Action, constants, showToast, Icons, Header, stylesGlobal } from '../mesosphere';
import staticData from '../../config/data';
import Verify from '../../config/verify';
import { logout } from '../../service/authService';

const { width } = Dimensions.get('window');
export default class UpdatePwd extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const { params } = state;
        return ({
            header: null
        })
    }
    constructor (props) {
        super(props)
        this.state = {
            tel: 'tel:10086',
            isValid: false,
            oldPwd: '',
            newPwd: '',
            repeatPwd: '',
            oldPwdValid: false,
            oldPwdText: '',
            newPwdValid: false,
            newPwdText: '',
            repeatPwdValid: false,
            repeatPwdText: '',
            isConnecting: false
        }
    }
    componentWillMount() {
        const { navigation } = this.props;
        navigation.setParams({ screenHandle: this.screenHandle });
    }
    screenHandle = () => {
        const { navigation } = this.props;
        navigation.navigate('ContactUs');
    }
    validOldPwd = () => {
        const { oldPwd } = this.state;
        if(!oldPwd) {
            this.setState({
                oldPwdText: '密码不能为空!',
                oldPwdValid: false,
                isValid: false
            })
        } else if(!Verify.password.test(oldPwd)) {
            this.setState({
                oldPwdText: '密码6-12位至少包含一个字母及数字!',
                oldPwdValid: false,
                isValid: false
            })
        } else {
            this.setState({
                oldPwdText: '',
                oldPwdValid: true
            }, () => {
                this.endValidHandel();
            })
        }
    }
    validNewPwd = () => {
        const { newPwd } = this.state;
        if(!newPwd) {
            this.setState({
                newPwdText: '密码不能为空!',
                newPwdValid: false,
                isValid: false
            })
        } else if(!Verify.password.test(newPwd)) {
            this.setState({
                newPwdText: '密码6-12位至少包含一个字母及数字!',
                newPwdValid: false,
                isValid: false
            })
        } else {
            this.setState({
                newPwdText: '',
                newPwdValid: true
            }, () => {
                this.endValidHandel();
            })
        }
    }
    validRepeatPwd = () => {
        const { repeatPwd, newPwd } = this.state;
        if(!repeatPwd) {
            this.setState({
                repeatPwdText: '密码不能为空!',
                repeatPwdValid: false,
                isValid: false
            })
        } else if(!Verify.password.test(repeatPwd)) {
            this.setState({
                repeatPwdText: '密码6-12位至少包含一个字母及数字!',
                repeatPwdValid: false,
                isValid: false
            })
        } else if( repeatPwd !== newPwd) {
            this.setState({
                repeatPwdText: '两次密码不一致,请重新输入!',
                repeatPwdValid: false,
                isValid: false
            })
        } else {
            this.setState({
                repeatPwdText: '',
                repeatPwdValid: true
            }, () => {
                this.endValidHandel();
            })
        }
    }
    endValidHandel = () => {
        const { oldPwdValid, newPwdValid, repeatPwdValid } = this.state;
        if(oldPwdValid && newPwdValid && repeatPwdValid) {
            this.setState({
                isValid: true
            })
        } else {
            this.setState({
                isValid: false
            })
        }
    }
    toSubmit = () => {
        this.setState({ isConnecting: true })
        const { oldPwd, newPwd, repeatPwd } = this.state;
        const { navigation } = this.props;
        service.updatePwdService({
            oldPassword: oldPwd,
            newPassword: newPwd,
            newPasswordConfirm: repeatPwd
        })
        .then(res => {
            this.setState({ isConnecting: false }, () => {
                showToast('密码修改成功,请重新登录!', {
                    onHidden: this.toLogout
                })
            })
            
        })
        .catch(err => {
            this.setState({ isConnecting: false })
            err.navigation = navigation;
            ErrorHandle(err);
        })
    }
    toLogout = () => {
        const { navigation } = this.props;
        logout()
        .then(res => {
            navigation.dispatch(Action.updateUser({ isLogin: false }));
            navigation.dispatch(Action.resetRoutesByNames(['VirtualMain', 'Login']));
        })
    }
    headerRight = () => {
        return (
            <TouchableOpacity
                style={styles.headerRightBtn}
                onPress={this.screenHandle}
            >
                <Icons name="icon-customer-service" color="#fff" size={24} />
            </TouchableOpacity>
        )
    }
    render() {
        const { isValid, oldPwdText, newPwdText, repeatPwdText, isConnecting  } = this.state;
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#F5F5F9' }} >
                <Header
                    headerTitle="修改密码"
                    navigation = {navigation}
                    headerRight = {this.headerRight}
                />
                <ScrollView>
                    <View style={styles.inputContainer}>
                        <View style={styles.rowView}>
                            <View style={styles.textView}>
                                <View style={{ flex: 1 }}>
                                    <Text>旧密码</Text>
                                </View>
                                <View style={{ flex: 5 }}>
                                    <TextInput
                                        underlineColorAndroid="transparent"
                                        onSubmitEditing={Keyboard.dismiss}
                                        multiline={false}
                                        placeholder="请输入旧密码"
                                        onChangeText={(text) => {
                                            this.setState({
                                                oldPwd: text
                                            })
                                        }}
                                        onBlur={this.validOldPwd}
                                        style={{ fontSize: 14 }}
                                        secureTextEntry={true}
                                    />
                                </View>
                            </View>
                            {oldPwdText ? <Animatable.Text animation="bounceIn" style={{ marginLeft: 40, color: '#ab4745', paddingBottom: 5 }}>{oldPwdText}</Animatable.Text> : null}
                        </View>
                        <View style={styles.rowView}>
                            <View style={styles.textView}>
                                <View style={{ flex: 1 }}>
                                    <Text>新密码</Text>
                                </View>
                                <View style={{ flex: 5 }}>
                                    <TextInput
                                        underlineColorAndroid="transparent"
                                        onSubmitEditing={Keyboard.dismiss}
                                        multiline={false}
                                        placeholder="请输入新密码"
                                        onChangeText={(text) => {
                                            this.setState({
                                                newPwd: text
                                            })
                                        }}
                                        onBlur={this.validNewPwd}
                                        style={{ fontSize: 14 }}
                                        secureTextEntry={true}
                                    />
                                </View>
                            </View>
                            {newPwdText ? <Animatable.Text animation="bounceIn" style={{ marginLeft: 40, color: '#ab4745', paddingBottom: 5 }}>{newPwdText}</Animatable.Text> : null}
                        </View>
                        <View style={styles.rowView}>
                            <View style={[styles.textView, { borderBottomWidth: 0 }]}>
                                <View style={{ flex: 1.7 }}>
                                    <Text>确认新密码</Text>
                                </View>
                                <View style={{ flex: 5 }}>
                                    <TextInput
                                        underlineColorAndroid="transparent"
                                        onSubmitEditing={Keyboard.dismiss}
                                        multiline={false}
                                        placeholder="请再次确认密码"
                                        onChangeText={(text) => {
                                            this.setState({
                                                repeatPwd: text
                                            })
                                        }}
                                        onBlur={this.validRepeatPwd}
                                        style={{ fontSize: 14 }}
                                        secureTextEntry={true}
                                    />
                                </View>
                            </View>
                            {repeatPwdText ? <Animatable.Text animation="bounceIn" style={{ marginLeft: 40, color: '#ab4745', paddingBottom: 5 }}>{repeatPwdText}</Animatable.Text> : null}
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', height: 40, justifyContent: 'center' }} >
                        <Text style={{ fontSize: 12, color: '#666666' }}>密码规则: 须为<Text style={{ color: '#EC0909' }}>6-12位英文或数字</Text>且符合0-9或a-z字母</Text>
                    </View>
                    <View style={styles.submitBtnWrap}>
                        <TouchableOpacity
                            style={[styles.feedbackBtn, !isValid ? {backgroundColor: stylesGlobal.disableBtn.bg } : null]}
                            activeOpacity={ !isValid ? 1 : 0.5}
                            onPress={isValid ? this.toSubmit : null}>
                            <Text style={[styles.feedbackBtnText, !isValid ? {color: stylesGlobal.disableBtn.txtColor} : null]}>确认</Text>
                        </TouchableOpacity>
                    </View>
                    <OverlaySpinner
                        visible= {isConnecting}
                        cancelable= {true}
                        onTouchShade={() => {
                            this.setState({
                                isConnecting: !isConnecting
                            })
                        }}
                    />
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerRightBtn: {
        // padding: 10
    },
    inputContainer: {
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth 
    },
    textView: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
    },
    submitBtnWrap: {
        flex: 1,
        alignItems: 'center',
        marginTop: 40,
    },
    feedbackBtn: {
        width: width / 1.1,
        backgroundColor: stylesGlobal.activeBtn.bg,
        borderRadius: 4,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center'
    },
    feedbackBtnText: {
        color: stylesGlobal.activeBtn.txtColor,
        fontWeight: 'bold'
    },
    rowView: {
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth
    }
})