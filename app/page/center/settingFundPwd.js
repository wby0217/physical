// 设置资金密码

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
    TextInput,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { OverlaySpinner } from '../../component/tips';
import Verify from '../../config/verify';
import { saveUserInfo } from '../../service/authService';
import { service, ErrorHandle, Action, constants, showToast, Icon, Header, stylesGlobal } from '../mesosphere';

const { width } = Dimensions.get('window');
class SettingFundPwd extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return ({
            header: null,
            headerTitle: state.params.title || '我的银行卡',
            headerBackTitle: null
        })
    }
    constructor(props) {
        super(props)
        this.state = {
            isValid: false,
            fundPwd: '',
            repeatPwd: '',
            fundPwdValid: false,
            repeatPwdValid: false,
            realName: '',
            fundText: '',
            fundRepeatText: '',
            isConnecting: false
        }
    }
    validFundPwd = () => {
        const { fundPwd } = this.state;
        if(!Verify.fundsPassword.test(fundPwd)) {
            this.setState({
                isValid: false,
                fundPwdValid: false,
                fundText: '密码为6位数字!'
            })
        } else {
            this.setState({
                fundText: '',
                fundPwdValid: true
            }, () => this.endVeviry())
        }
    }
    validRepeatPwd = () => {
        const { repeatPwd, fundPwd } = this.state;
        if(!Verify.fundsPassword.test(repeatPwd)) {
            this.setState({
                isValid: false,
                repeatPwdValid: false,
                fundRepeatText: '密码为6位数字!'
            })
        } else if( repeatPwd !== fundPwd ) {
            this.setState({
                isValid: false,
                repeatPwdValid: false,
                fundRepeatText: '两次密码不一致!'
            })
        } else {
            this.setState({
                fundRepeatText: '',
                repeatPwdValid: true,
            }, () => this.endVeviry())
        }
    }
    endVeviry = () => {
        const { fundPwd, repeatPwd, realName, fundPwdValid, repeatPwdValid } = this.state;
        if(fundPwdValid && repeatPwdValid && realName) {
            this.setState({ isValid: true });
        } else {
            this.setState({ isValid: false });
        }
    }
    refreshUser = async (res) => {
        const { navigation, updateUser } = this.props;
        await this.setState({ isConnecting: false });
        service.getUserInfoService()
        .then(res => {
            updateUser(res);
            saveUserInfo(res);
            if(navigation.state.params && navigation.state.params.prevRouteName == "fundPwd") {
                Alert.alert("信息保存成功","您还没有绑定银行卡,是否去绑卡?",[
                    { text: '取消', style: "cancel", onPress: () => {
                        navigation.goBack();
                    }},
                    { text: "确定", onPress: () => {
                        navigation.navigate('AddBankCard', { key: navigation.state.key, reloadCardInfo: navigation.state.params && navigation.state.params.reloadCardInfo  });
                    }}
                ]);
            } else {
                navigation.navigate('AddBankCard', { key: navigation.state.key, reloadCardInfo: navigation.state.params && navigation.state.params.reloadCardInfo, routeName: navigation.state.params && navigation.state.params.routeName  });
            }
        })
        .catch(err => {
            this.toggleOverlay();
            err.navigation = navigation;
            ErrorHandle(err)
        })
    }
    toggleOverlay = () => {
        // loading层开关
        this.setState({
            isConnecting: !this.state.isConnecting
        })
    }
    toSubmit = () => {
        const { realName, fundPwd } = this.state;
        const { navigation } = this.props;
        this.toggleOverlay();
        service.settingFundPwdService({ realName,fundsPassword: fundPwd })
        .then(this.refreshUser)
        .catch(err => {
            this.toggleOverlay();
            ErrorHandle(err);
        })
    }
    render() {
        const { isValid, nameText, fundText, fundRepeatText, isConnecting } = this.state;
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <Header
                    headerTitle= { navigation.state.params && navigation.state.params.title || '我的银行卡' }
                    navigation = {navigation}
                />
                <ScrollView 
                    style={{ flex: 1, backgroundColor: '#F5F5F9' }}
                    keyboardShouldPersistTaps="handled"
                    >
                        <View style={{ height: 30, justifyContent: 'center', paddingHorizontal: 10 }}>
                            <Text style={{ fontSize: 12, color: '#999999' }}>为您账户安全，真实姓名要与绑定银行卡姓名一致</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.rowView}>
                                <View style={styles.textView}>
                                    <View style={{ flex: 2 }}>
                                        <Text>真实姓名</Text>
                                    </View>
                                    <View style={{ flex: 5 }}>
                                        <TextInput
                                            underlineColorAndroid="transparent"
                                            onSubmitEditing={Keyboard.dismiss}
                                            multiline={false}
                                            onChangeText={(text) => {
                                                this.setState({
                                                    realName: text
                                                })
                                            }}
                                            placeholder="绑卡人姓名"
                                            onBlur={this.endVeviry}
                                            style={{ fontSize: 14 }}
                                        />
                                    </View>
                                    
                                </View>
                            </View>
                            <View style={styles.rowView}>
                                <View style={styles.textView}>
                                    <View style={{ flex: 2 }}>
                                        <Text>资金密码</Text>
                                    </View>
                                    <View style={{ flex: 5 }}>
                                        <TextInput
                                            underlineColorAndroid="transparent"
                                            onSubmitEditing={Keyboard.dismiss}
                                            multiline={false}
                                            placeholder="输入资金密码"
                                            onChangeText={async (text) => {
                                                await this.setState({
                                                    fundPwd: text
                                                })
                                                this.validRepeatPwd();
                                            }}
                                            keyboardType="numeric"
                                            onBlur={this.validFundPwd}
                                            style={{ fontSize: 14 }}
                                            secureTextEntry={true}
                                        />
                                    </View>
                                </View>
                                {fundText ? <Animatable.Text animation="bounceIn" style={{ marginLeft: 40, color: '#ab4745', paddingBottom: 5 }}>{fundText}</Animatable.Text> : null}
                            </View>
                            <View style={styles.rowView}>
                                <View style={styles.textView}>
                                    <View style={{ flex: 2 }}>
                                        <Text>确认资金密码</Text>
                                    </View>
                                    <View style={{ flex: 5 }}>
                                        <TextInput
                                            underlineColorAndroid="transparent"
                                            onSubmitEditing={Keyboard.dismiss}
                                            multiline={false}
                                            placeholder="再次资金密码"
                                            onChangeText={async (text) => {
                                               await this.setState({
                                                    repeatPwd: text
                                                })
                                                this.validRepeatPwd();
                                            }}
                                            keyboardType="numeric"
                                            onBlur={this.validRepeatPwd}
                                            style={{ fontSize: 14 }}
                                            secureTextEntry={true}
                                        />
                                    </View>
                                </View>
                                {fundRepeatText ? <Animatable.Text animation="bounceIn" style={{ marginLeft: 40, color: '#ab4745', paddingBottom: 5 }}>{fundRepeatText}</Animatable.Text> : null}
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', height: 40, justifyContent: 'center' }} >
                            <Text style={{ fontSize: 12, color: '#666666' }}>密码规则: 资金密码须为<Text style={{ color: '#EC0909' }}>6位数字</Text></Text>
                        </View>
                        <View style={styles.submitBtnWrap}>
                            <TouchableOpacity
                                style={[styles.feedbackBtn, !isValid ? {backgroundColor: stylesGlobal.disableBtn.bg } : null]}
                                activeOpacity={ !isValid ? 1 : 0.5}
                                onPress={isValid ? this.toSubmit : null}>
                                <Text style={[styles.feedbackBtnText, !isValid ? {color: stylesGlobal.disableBtn.txtColor} : null]}>下一步</Text>
                            </TouchableOpacity>
                        </View>
                        <OverlaySpinner
                            visible= {isConnecting}
                            cancelable= {true}
                            onTouchShade={this.toggleOverlay}
                        />
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerRightBtn: {
        padding: 10
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
        height: 30,
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
});

const mapStateToProps = (state) => {
    return {
        saveUpdateUser: state.match.saveUpdateUser,
        isLogin: state.match.saveUpdateUser.isLogin
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        updateUser: (res) => dispatch(Action.updateUser({ isLogin: true, ...res.data }))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingFundPwd);