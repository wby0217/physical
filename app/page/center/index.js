// 会员中心

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Easing,
    Animated,
    Platform,
    NativeModules
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc';
import LinearGradient from 'react-native-linear-gradient';
import { Icons, service, ErrorHandle, Action, constants, Header, stylesGlobal } from '../mesosphere';
import { saveUserInfo, guestSignUp } from '../../service/authService';
import btnList from './btnlist';
import { showToast } from '../../utils';

const { width } = Dimensions.get('window');
const isIos = Platform.OS == 'ios';
const isIPhoneX = NativeModules.DeviceInfo.isIPhoneX_deprecated;
class Center extends Component {
    defaultPhoto = require('../../assets/images/center/headportrait.webp');
     static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const { params } = state;
        return ({
            header: null
        })
    }
    constructor(props) {
        super(props);
        this.state = {
            selected: false,
            userInfo: '',
        };
        this.userBankCard = [];
        this.spinValue = new Animated.Value(0)
        this.onPressMenu = this.onPressMenu.bind(this);
        this.intoWithDraw = this.intoWithDraw.bind(this);
        this.navigate = props.navigation.navigate;
    }
    componentWillReceiveProps(nextProps) {
        const { isFocused } = this.props;
        if(isFocused !== nextProps.isFocused && nextProps.isFocused && nextProps.isLogin) {
            this.spin();
        }
    }
    componentDidMount() {
        const { isLogin } = this.props;
        if(isLogin) {
            this.spin();
        }
    }
    onSelect = data => {
        this.setState(data)
    }
    onPressMenu (routeName) {
        const { isLogin, accountType } = this.props;
        if(isLogin) {
            if(accountType === 'guest') {
                showToast('试玩账号不能操作该功能!');
            } else {
                this.navigate(routeName);
            }
        } else {
            this.navigate('Login');
        }
    }
    spin = () => {
        const { navigation } = this.props;
        this.spinValue.setValue(0);
        Animated.timing(this.spinValue,{
            toValue: 1.5,
            duration: 1000,
            easing: Easing.linear
        }).start();
        this.getUserInfo();
        this.getUserBankList()
    };
    getUserInfo = () => {
        const { navigation, updateUser } = this.props;
        service.getUserInfoService()
        .then(res => {
            updateUser(res);
            saveUserInfo(res);
        })
        .catch(err => {
            err.navigation = navigation;
            ErrorHandle(err)
        })
    };
    getUserBankList = async () => {
        const { navigation } = this.props;
        try {
            const results = await service.getUserBanksService();
            this.userBankCard = results.data;
        } catch(err) {
            err.navigation = navigation;
            ErrorHandle(err);
        }
    };
    intoWithDraw () {
        const { isLogin, saveUpdateUser, accountType, navigation } = this.props;
        if (!isLogin) return this.navigate('Login');
        if(accountType === 'guest') {
           return showToast('试玩账号不能操作该功能!');
        }
        if (!saveUpdateUser.realName) return this.navigate('SettingFundPwd', {title: '资金密码', routeName: 'withdraw'});
        if (!saveUpdateUser.isBindBank) return this.navigate('AddBankCard', {  routeName: 'withdraw' });
        return this.navigate('WithDraw', {userBankCard : this.userBankCard});
    }
    headerRight = () => {
       const { navigation } = this.props;
       return (<TouchableOpacity
                    onPress={() => { navigation.navigate('Setting') }}
                    style={{ paddingHorizontal: 5 }}
                >
                    <Icons name="icon-strong-setting" size={20} color="#fff" />
                </TouchableOpacity>)
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
    render() {
        const { navigation, isLogin, saveUpdateUser, accountType } = this.props;
        const { selected, userInfo } = this.state;
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });
        const paddingTop = isIos ? isIPhoneX ? { paddingTop: 40, } : { paddingTop: 30 } : { paddingTop: 20 }
        return (
            <View style={{ flex: 1 }}>
                <LinearGradient
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 0.6 }}
                    locations={[0, 0.5, 1.0]}
                    colors={['#83D74F', '#43BB4D', '#17A84B']}>
                    <View style={[paddingTop, { paddingHorizontal: 10, backgroundColor: 'transparent' }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 40, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    style={styles.headPortrait}
                                    resizeMode='contain'
                                    source={this.defaultPhoto}
                                />
                               {isLogin ? <Text style={{ color: '#fff', marginLeft: 10 }}>{saveUpdateUser.userName}</Text>: null}
                            </View>
                            <TouchableOpacity
                                onPress={() => { navigation.navigate('Setting') }}
                                style={{ paddingHorizontal: 5 }}
                            >
                                <Icons name="icon-simple-setting" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        {
                            isLogin ?
                                <View style={{ paddingVertical: 10 }}>
                                    <View>
                                        <Text style={{ color: '#fff' }}>余额(元)</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 40, alignItems: 'center' }}>
                                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{saveUpdateUser.accountBalance}</Text>
                                        <TouchableOpacity
                                            onPress={this.spin}
                                            style={{ padding: 5 }}
                                        >
                                            <Animated.View style={{ transform: [{rotate: spin}] }}>
                                                <Icons name="icon-refreshing" size={22} color="#fff" />
                                            </Animated.View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                :
                                <View style={{ paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <TouchableOpacity
                                        style={[ styles.headViewBtn ]}
                                        onPress={this.toFreePlay}
                                    >
                                        <Text style={styles.headViewBtnText}>免费试玩</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[ styles.headViewBtn ]}
                                        onPress={() => {
                                            navigation.navigate('Login')
                                        }}
                                    >
                                        <Text style={styles.headViewBtnText}>登录/注册</Text>
                                    </TouchableOpacity>
                                </View>
                        }
                        
                    </View>
                </LinearGradient>
                <ScrollView style ={ styles.container }>
                    <View style={styles.payinAndgetCashView}>
                        <TouchableOpacity style={styles.payinAndgetCashBtn} onPress={() => this.intoWithDraw()}>
                            <Icons name="icon-repayment" color="#548EFF" size={25} />
                            <Text style={{ marginLeft: 5, color: '#4684FF' }}>提现</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.payinAndgetCashBtn}
                            onPress={() => this.onPressMenu('Recharge')}
                        >
                            <Icons name="icon-card-pay" color="#46BD4D" size={25} />
                            <Text style={{ marginLeft: 5, color: '#1BA94E' }}>充值</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        btnList.length ? btnList.map((item, index) =>
                        <View
                            style={{ backgroundColor: '#fff', marginTop: 10 }}
                            key={index}
                        >
                            <View style={{ height: 40, justifyContent: 'center', paddingHorizontal: 10, borderBottomColor: '#DCDCDC', borderBottomWidth: StyleSheet.hairlineWidth }}>
                                <Text style={{ color: '#333333', fontWeight: 'bold' }}>{item.title}</Text>
                            </View>
                            <View style={{ flexWrap: 'wrap',  flexDirection: 'row', }}>
                                {
                                    item.list.length && item.list.map((obj, n) =>
                                    (obj.routeName === 'Agency' && (!isLogin || !saveUpdateUser.isAgent || ['guest'].includes(accountType)))
                                    || (obj.routeName === 'LetterList' && (!isLogin || ['guest', 'special'].includes(accountType)))
                                    ?null:
                                        obj.routeName === 'Register' && saveUpdateUser.isAgent && isLogin ? null:
                                        <TouchableOpacity
                                            style={styles.colsView}
                                            key={n}
                                            onPress={() => {
                                                if(obj.token) {
                                                    if(isLogin) {
                                                        if(obj.routeName == 'Agency' && !saveUpdateUser.isAgent ) {
                                                            showToast('代理正在审核中!')
                                                        }
                                                        if(accountType === 'guest' && ['GetCashRecord', 'TopUpRecord'].includes(obj.routeName)) {
                                                            showToast('试玩账号不能操作该功能!')
                                                        } else {
                                                            if(obj.routeName === 'CenterOrder') {
                                                                navigation.navigate(obj.routeName, { headerLeft: true })
                                                            } else {
                                                                navigation.navigate(obj.routeName)
                                                            }
                                                        }
                                                    } else {
                                                        navigation.navigate('Login');
                                                    }
                                                } else {
                                                    if(obj.routeName == 'Register') {
                                                        navigation.navigate(obj.routeName, { routeSource: 'agent' })
                                                    } else {
                                                        navigation.navigate(obj.routeName)
                                                    }
                                                }
                                            }}
                                        >
                                            {
                                                obj.iconName === 'img' ?
                                                <View>
                                                    <Image source={obj.sourceUri} style={{ width: 22, height: 22, resizeMode: 'contain', }} />
                                                    {
                                                        saveUpdateUser.messageNotReadNum && saveUpdateUser.messageNotReadNum > 0 ?
                                                        <View
                                                            style={{ position: 'absolute', right: -24, top: -5, backgroundColor: '#FF4D00',borderRadius: 5, paddingHorizontal: 4, }}
                                                        >
                                                            <Text style={{  color: '#fff', fontSize: 12,   }}>{saveUpdateUser.messageNotReadNum}</Text>
                                                        </View>
                                                        : null
                                                    }
                                                </View>
                                                :<Icons name={obj.iconName} size={18} color={stylesGlobal.centerIcon.iconColor} />
                                            }
                                            
                                            <Text style={{ color: '#333333' }}>{obj.title}</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                        </View>
                        ): null
                    }
                    
                </ScrollView>
            </View>
        )
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
    },
    colsView: {
        width: width/4,
        alignItems: 'center',
        height: 70,
        justifyContent: 'space-around',
        paddingVertical: 5
    },
    headView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 80,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        borderBottomColor: '#DCDCDC',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    headViewBtn: {
        paddingVertical: 5,
        paddingHorizontal: 25,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5
    },
    headViewBtnText: {
        fontSize: 14,
        color: '#fff'
    },
    headPortrait: {
        width: 25,
        height: 25
    },
    payinAndgetCashView: {
        height: 45,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center' 
    },
    payinAndgetCashBtn: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10
    },
    btnItemView: {
        flexDirection: 'row',
        height: 45,
        backgroundColor: '#fff',
        alignItems: 'center' 
    },
    btnRightView: {
        height: 45,
        flex: 9,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 10,
        borderBottomColor: '#DCDCDC',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
});

const mapStateToProps = (state) => {
    return {
        saveUpdateUser: state.match.saveUpdateUser,
        isLogin: state.match.saveUpdateUser.isLogin,
        accountType: state.match.saveAcountType.type
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        updateUser: (res) => dispatch(Action.updateUser({ isLogin: true, ...res.data }))
    }
}

export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(Center), 'Center');