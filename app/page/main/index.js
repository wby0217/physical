// 足彩大厅

import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Platform,
    ScrollView,
    Image,
    Alert,
    BackHandler,
    NetInfo,
    AppState,
    ImageBackground,
    ActivityIndicator,
    TextInput
} from 'react-native';
import { connect } from 'react-redux';
import HTML from 'react-native-render-html';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc';
import { NetworkInfo } from 'react-native-network-info';
import Modal from 'react-native-modal';
import _ from 'lodash';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import MarqueeLabel from 'react-native-marquee';
import * as Animatable from 'react-native-animatable';
import CarouselHeader from './carousel';
import { guestSignUp, saveUserInfo } from '../../service/authService';
import { Icons, service, ErrorHandle, Action, showToast, constants, IndexPopup } from '../mesosphere';
import navList from './navList';

const { width, height } = Dimensions.get('window');
const AUROODDSENUM = {
    true: 'yes',
    false: 'no'
  };
class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            notice: [],
            matchTypes: [],
            modalStatus: false,
            backState: 0,
            loopNotices: ["彩民之家，财富梦想"],
            checked: true,
            betModalStatus: false,
            popClose: undefined,
            currentAppState: 'active',
            inPlayNowBall: [],
            hotBall: [],
            winnerList: [],
            scheduleModel: {},
            selectedSchedule: {},
            loading: true,
            betAmount: 10,
            winAmount: 0,
            odds: 0,
            isBetting: false,
            refreshing: false,
            startRefresh: false,
            countNum: 5,
            errorMsg: null,
            genBet: false,
            isShowPopup: false
        }
        console.disableYellowBox = true;
        NetworkInfo.getIPAddress(ip => {
            service.getIpWhiteListService({ ip })
            .then(res => {
                res.data && res.data.inWhiteList ? props.changeUserStatus(true) : null;
            })
            .catch(ErrorHandle)
        })
    }
    componentWillMount() {
        const { navigation } = this.props;
        if(navigation.state.params && navigation.state.params.source && navigation.state.params.source === 'splash') {
            this.setState({ isShowPopup: true });
        } else {
            this.setState({ isShowPopup: false });
        }
    }
    componentWillReceiveProps(nextProps) {
        const { isFocused } = this.props;
        if(nextProps.isFocused !== isFocused && nextProps.isFocused) {
            this.requestBall();
            this.recommendHotBall();
            this.requestWinnerList();
            this.poling(this.requestBall, 30 * 1000);
            this.poling(this.recommendHotBall, 180 * 1000);
            this.fetchData();
            this.loopNotice && this.loopNotice.loopNotice && this.loopNotice.loopNotice();
        } else {
            clearInterval(this.ballInfoTimer);
            this.loopNotice && this.loopNotice.stopAnimation && this.loopNotice.stopAnimation();
        }
    }
    componentDidMount() {
        const { navigation, isLogin, accountType, userName } = this.props;
        storage.load({
            key: 'loginUserName'
        })
        .then(this.guestUserPop)
        .catch(this.guestUserPop)
        // 消息接口
        service.noticeService()
        .then(res => {
            if(res.data && res.data.length) {
                this.setState({
                    notice: res.data,
                    loopNotices: Array.from(res.data).map((n) => {
                        return n.noticeContent.replace(/<[^>]*>/g, "");
                    })
                    // loopNotices: ['体彩app正式上线了!']
                })
            }
        })
        .catch(err => {
            ErrorHandle(err);
        })
        this.fetchData();
        BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.dispatch({ type: 'Navigation/BACK' })
        })
        NetInfo.addEventListener('connectionChange', this.connectionChange);
        AppState.addEventListener('change', this._handleAppStateChange);
        this.longRequest();
        this.requestBall();
        this.recommendHotBall();
        this.requestWinnerList();
        this.poling(this.requestBall, 30 * 1000);
        this.poling(this.recommendHotBall, 180 * 1000);
    }
    poling = (callback, time) => {
       this.ballInfoTimer =  setInterval(() => {
            callback && typeof(callback) === 'function' && callback();
        }, time);
    }
    // 滚球推荐
    requestBall = () => {
        service.hotBallService()
        .then(res => {
            const newArr = [];
            res.data && res.data.length ? res.data.map((obj, index) => {
                Object.assign(obj, constants['ballImg'][obj.engName]);
                newArr.push(obj)
            }) : null;
            this.setState({
                inPlayNowBall: newArr,
                loading: false
            });
        })
        .catch(err => {
            console.log(err)
        })
    }
    // 热门推荐
    recommendHotBall = () => {
        service.eventsRecommendService()
        .then(res => {
            const newArr = [];
            res.data && res.data.length ? res.data.map((obj, index) => {
                Object.assign(obj, constants['ballImg'][obj.engName]);
                newArr.push(obj)
            }) : null;
            this.setState({
                hotBall: newArr,
                loading: false
            })
        })
        .catch(err => {
            console.log(err);
        })
    }
    // 首页中奖信息列表
    requestWinnerList = () => {
        service.winnerListService()
        .then(res => {
            this.setState({
                winnerList: res.data,
                loading: false
            })
        })
        .catch(err => {
            console.log(err)
        })
    }
    _handleAppStateChange = (nextAppState) => {
        if(nextAppState.match(/inactive|background/)) {
            clearInterval(this.timer);
        } else if(nextAppState === 'active') {
            this.longRequest();
        }
        this.setState({ currentAppState: nextAppState });
    }
    longRequest = () => {
        const { isLogin } = this.props;
        this.timer = setInterval(() => {
            isLogin && service.reportingOnlineStatusService()
            .then(res => {
                // console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
        }, 300 * 1000);
    }
    toggleChangeBetModal = async (schedule, selectedSchedule, callback) => {
        await this.setState({
            betModalStatus: !this.state.betModalStatus,
            scheduleModel: schedule,
            selectedSchedule,
            odds: selectedSchedule.odds
        });
        if(this.state.betModalStatus) {
            this.refreshOdds(schedule, selectedSchedule);
            this.willRendering();
        } else {
            await this.setState({
                countNum: 5,
                startRefresh: false,
                genBet: false
            })
            clearInterval(this.countTimer);
            clearInterval(this.oddsTimer);
        }
        callback && typeof(callback) === 'function' && callback();
    }
    connectionChange = () => {}
    guestUserPop = ( localUserName ) => {
        const { userName, isLogin, accountType } = this.props;
        if(( isLogin && accountType === 'guest' && localUserName.userName !== userName)) {
            storage.save({
                key: 'loginUserName',
                data: {
                    userName
                },
                expires: 1000 * 3600 * 72
            })
            this.setState({ modalStatus: true })
        }
    }
    fetchData = () => {
        // 球类本地数据Load
        storage.load({
            key: 'sportsTypes'
        })
        .then(data => {
            if(data.length > 0 ) {
                this.setState({
                    matchTypes: data
                })
            }
        })
        .catch(err => {
            ErrorHandle(err)
        })
    }
    componentWillUnmount() {
        clearInterval(this.timer);
        clearInterval(this.ballInfoTimer);
        clearInterval(this.countTimer);
        clearInterval(this.oddsTimer);
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    jumpTo = ( routeName ) => {
        const { navigation, isLogin, accountType } = this.props;
        if( routeName === 'Recharge' ) {
            if(!isLogin) {
                navigation.navigate('Login', { routeNames: ['Main'] });
            } else if(accountType === 'guest') {
                showToast('试玩账号不能操作此功能!')
            } else {
                navigation.navigate(routeName);
            }
        } else if(routeName === 'FreePlay') {
            if(!isLogin) {
                // navigation.navigate(routeName);
                this.toFreePlay();
            } else if(accountType === 'guest' && isLogin) {
                showToast('您正在使用的是试玩账号!')
            } else if(isLogin) {
                Alert.alert('', '您当前使用正式账号,确定进入试玩?',[
                    {text: '点错了', onPress: () => {},style: 'cancel'},
                    {text: '确定', onPress: () => {
                        // navigation.navigate(routeName);
                        this.toFreePlay();
                    }}
                ],{cancelable: false})
            }
        } else {
            navigation.navigate(routeName);
        }
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
            .then(ret => {
                navigation.dispatch(Action.saveAccountType({ type: ret.identity }));
            })
            .catch(err => {
                throw new Error(err);
            });
            navigation.dispatch(Action.updateUser({ isLogin: true, ...res.data }));
            storage.save({
                key: 'loginUserName',
                data: {
                    userName: res.data.userName
                },
                expires: 1000 * 3600 * 72
            })
            this.setState({ modalStatus: true })
        })
        .catch(err => {
            this.setState({
                isConnecting: false
            }, () => ErrorHandle(err))
        })
    }
    toggleSelect = () => {
        this.setState({
          checked: !this.state.checked
        });
      }
    popModalClose = (callback) => {
        this.setState({
            popClose: true
        }, () => {
            typeof(callback) === 'function' && callback();
        });
    }
    toMoneyConvert = (content, money) => {
       const newArr =  content.split('money');
       if(newArr.length > 1) {
           return (
            <Text style={{ color: '#333333', fontSize: 12 }} numberOfLines={1}>
                <Text>{newArr[0]}</Text>
                <Text style={{ color: '#fd0f2d' }}>{money}元</Text>
                <Text>{newArr[1]}</Text>
            </Text>
            )
       } else {
           return (
                <Text style={{ color: '#333333' }}>{newArr[0]}</Text>
           )
       }
    }
    willRendering = () => {
        this.setState({
            winAmount: (Number(this.state.betAmount) * (Number(this.state.odds) - 1))
        })
    }
    countManager = () => {
       let countNum = this.state.countNum;
       this.countTimer = setInterval(() => {
            if(countNum < 1) {
                this.setState({ 
                    countNum: 5,
                    startRefresh: false
                 })
                 clearInterval(this.countTimer);
            } else {
                this.setState({ 
                    countNum: countNum--
                 })
            }
        }, 1000)
    }
    refreshOdds = async () => {
        const { scheduleModel, selectedSchedule } = this.state;
        clearInterval(this.oddsTimer);
        const params = {
            gameId: scheduleModel.gameId,
            eventType: selectedSchedule.eventType,
            playType: (selectedSchedule.engName === 'football') ? 'ft1x2' : '1x2',
            oddsKey: selectedSchedule.oddsKey,
            sportType: selectedSchedule.sportType
        }
        await this.setState({ refreshing: true, startRefresh: true });
        this.countManager();
        refreshOdds();
        // this.oddsTimer = setInterval(() => {
        //     refreshOdds();
        // },10 * 1000);
        const that = this;
        function refreshOdds (){
            service.refreshOddsService(params)
            .then(res => {
                that.setState({
                    odds: res.data.odds,
                    refreshing: false,
                    errorMsg: null
                })
            })
            .catch(err => {
                that.setState({ refreshing: false, errorMsg: err.message });
                console.log(err);
            })
        }
    }
    genOrder = () => {
        this.setState({ isBetting: true });
        const { navigation } = this.props;
        const { betAmount, odds, selectedSchedule, scheduleModel } = this.state;
        const betInfo = JSON.stringify([
            {
              gameId: scheduleModel.gameId,
              odds,
              playType: (selectedSchedule.engName === 'football') ? 'ft1x2' : '1x2',
              oddsKey: selectedSchedule.oddsKey
            }
          ]);
        const param = {
            autoOdds: AUROODDSENUM[this.state.checked],
            betAmount,
            sportId: selectedSchedule.sportId,
            eventType: selectedSchedule.eventType,
            betInfo
          };
          service.genOrderBetService(param)
          .then(async res => {
              await this.setState({ isBetting: false, errorMsg: null, genBet: true });
              this.getUserInfo();
              setTimeout(() => {
                this.toggleChangeBetModal({}, {}, () => { });
              }, 1000)
          })
          .catch(async err => {
            this.setState({ isBetting: false, genBet: false, errorMsg: err.message });
            if(err.errorcode) {
                if(err.data && err.data.odds) {
                    await this.setState({ odds: err.data.odds });
                }
                if(err.errorcode === 103012) {
                    // this.refreshOdds();
                    return Alert.alert("",`赔率发生变化为${err.data.odds},确定进行下注吗?`,[
                        { text: '取消', style: "cancel", onPress: () => {
                        //   this.setState({ isConnecting: false, isStopBet: false })
                        }},
                        { text: "确定", onPress: () => {
                          this.genOrder();
                        }}
                    ]);
                } else if(err.errorcode === 103001) {
                    if(this.props.accountType == 'guest') {
                      return Alert.alert('', '下注金额已超过可用金额', [{ text: '确认', style: 'cancel', onPress: () => { this.setState({ isConnecting: false, isStopBet: false }) } }]);
                    }
                    return Alert.alert('', '当前余额不足',[ { text: '取消', style: 'cancel', onPress: () => { this.setState({ isConnecting: false, isStopBet: false }) } }, {
                      text: '去充值', onPress: () => {
                          this.toggleChangeBetModal({},{}, () => {
                            navigation.navigate('Recharge', { ...this.props });
                          });
                      }
                    } ])
                } else if(err.errorcode === 103020) {
                  return Alert.alert("",err.message,[
                      { text: '取消', style: "cancel", onPress: () => {
                        this.setState({ isConnecting: false, isStopBet: false })
                      }},
                      { text: "确定", onPress: () => {
                        this.genOrder();
                      }}
                  ]);
                } else if([103016,103017,103018,103019].includes(err.errorcode)) {
                  return Alert.alert("",`${err.message}`,[
                      { text: '取消', style: "cancel", onPress: () => {
                        this.setState({ isConnecting: false, isStopBet: false })
                      }},
                      { text: "确定", onPress: () => {
                        this.genOrder();
                      }}
                  ]);
                }
            }
            
          })
    }
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
    render() {
        const { navigation, matchEventType, isFocused, popupInfo, saveUpdateUser, isLogin, accountType } = this.props;
        const { notice, matchTypes, modalStatus, loopNotices, checked, betModalStatus, popClose, inPlayNowBall, hotBall, winnerList, scheduleModel, selectedSchedule, loading, betAmount, winAmount, odds, isBetting, refreshing, startRefresh, countNum, errorMsg, genBet, isShowPopup } = this.state;
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <View style={{ flex: 1 }}>
                        {isFocused ? <CarouselHeader {...this.props} /> : null}
                        <TouchableOpacity
                            style={[styles.baseView, styles.marquee]}
                            activeOpacity={1}
                            onPress={() => {
                                navigation.navigate('LatestNotice', { notice });
                            }}
                        >
                            <View style={{ backgroundColor:'transparent', width: 30, alignItems: 'center'}} >
                                <Icons name="icon-speaker" color="#fff" size={20} />
                            </View>
                            <MarqueeLabel
                                ref={ref => this.loopNotice = ref}
                            >
                                <Text style={{ color: '#fff' }}>{loopNotices.join('   ')}</Text>
                            </MarqueeLabel>
                            <View style={{ backgroundColor:'transparent', width: 30, alignItems: 'center' }}>
                                <Icons name="icon-arrow-more" color="#fff" size={14} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingVertical: 10, paddingHorizontal: 5 }}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                        {
                            matchTypes.length > 0 ? matchTypes.map((item, i) =>
                            <TouchableOpacity
                                style={styles.ballBoxView}
                                key={i}
                                onPress={() => {
                                    if(parseInt(item.status) > 0) {
                                        navigation.dispatch(Action.changeEventTypeIndex(0));
                                        navigation.dispatch(Action.selectedBallInfo(item));
                                        navigation.dispatch(Action.checkAllianceId(0));
                                        navigation.dispatch(Action.toggleEventType({typeEngName: 'today', typeName: '今日赛事'}));
                                        navigation.navigate('Match', {...item});
                                    } else {
                                        return showToast('此球类暂未开放,敬请期待!')
                                    }
                                }}
                            >
                                <Image
                                    source={{ uri: item.icon }}
                                    style={{ width: 125, height: 65, resizeMode: 'contain' }}
                                />
                                <View style={styles.ballBox}>
                                    <Text style={{ fontSize: 12 }}>{item.name}</Text>
                                    {
                                        (parseInt(item.status) > 0) ?
                                        <Text style={{ fontSize: 10 }}>
                                            <Text style={{ color: '#D0021B' }}>{item.eventNum}</Text>
                                            <Text>场</Text>
                                        </Text>
                                        :
                                        <Text style={{ color: '#999', fontSize: 10 }}>暂未上线</Text>
                                    }
                                </View>
                            </TouchableOpacity>)
                            : null
                        }
                        </ScrollView>
                    </View>
                    {
                        inPlayNowBall && inPlayNowBall.length ?
                        <View>
                            <View style={{ height: 40, alignItems: 'center', flexDirection: 'row' }}>
                                <View
                                    style={{ width: 3, backgroundColor: '#17A84B', height: 18, marginLeft: 1, borderRadius: 2 }}
                                />
                                <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 4 }}>滚球推荐</Text>
                            </View>
                            {
                            inPlayNowBall.map((item, index) => {
                                    return (
                                        <View  key={index}>
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => {
                                                    const newItem = {engName: item.engName, id: item.sportId, name: item.name };
                                                    navigation.dispatch(Action.changeEventTypeIndex(0));
                                                    navigation.dispatch(Action.selectedBallInfo(newItem));
                                                    navigation.dispatch(Action.checkAllianceId(0));
                                                    navigation.dispatch(Action.toggleEventType({ typeEngName: 'in_play_now', typeName: '滚球' }));
                                                    navigation.navigate('Match', { ...newItem });
                                                }}
                                                style={[ styles.recommendTitleRow, { backgroundColor: item.bgColor } ]}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image
                                                        source={item.icon}
                                                        style={{ width: 20, height: 34, resizeMode: 'contain', marginRight: 10 }}
                                                    />
                                                    <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', paddingRight: 10 }}>
                                                    <Text style={{ fontSize: 12 }}>
                                                        <Text style={{ color: item.color }}>{item.eventNum}场</Text>
                                                        <Text style={{ color: '#999' }}>比赛可投注</Text>
                                                    </Text>
                                                    <Icons name="icon-simple-arrow-right" size={14} />
                                                </View>
                                            </TouchableOpacity>
                                            <View style={[ styles.recommendRowView, { height: 30 } ]}>
                                                <View style={{ flex: 1 }}>
                                                </View>
                                                <View style={styles.layoutHalfRowView}>
                                                    <View style={styles.recommendTitleColView}>
                                                        <Text style={{ color: '#999999' }}>主</Text>
                                                    </View>
                                                    <View style={styles.recommendTitleColView}>
                                                        <Text style={{ color: '#999999' }}>和</Text>
                                                    </View>
                                                    <View style={styles.recommendTitleColView}>
                                                        <Text style={{ color: '#999999' }}>客</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            {
                                                item.schedule && item.schedule.length ? item.schedule.map((obj, n) => {
                                                    return (
                                                        <View key={n} style={[ styles.recommendRowView ]}>
                                                            <View style={styles.layoutHalfRowView}>
                                                                <View style={{ flex: 8 }}>
                                                                    <Text style={{ fontSize: 10, color: '#3d6ea6', marginBottom: 3 }}>{obj.matchName}</Text>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                        <Text style={[{ color: '#333333', flex: 7 }, styles.matchInfoPadding]}>{obj.homeName}</Text>
                                                                        <Text style={{ flex: 1.2 }}>{obj.homeScore}</Text>
                                                                    </View>
                                                                    <View style={[{ flexDirection: 'row', alignItems: 'center' }, styles.matchInfoPadding]}>
                                                                        <Text style={{ color: '#333333', flex: 7 }}>{obj.guestName}</Text>
                                                                        <Text style={{ flex: 1.2 }}>{obj.guestScore}</Text>
                                                                    </View>
                                                                    <View style={styles.matchInfoPadding}>
                                                                        <Text style={{ fontSize: 12, color: '#999999' }}>{obj.timer}</Text>                                        
                                                                    </View>
                                                                </View>
                                                            </View>
                                                            <View style={styles.layoutHalfRowView}>
                                                                <View style={[ styles.recommendTitleColView ]}>
                                                                    {
                                                                        obj.odds['1x2'] && obj.odds['1x2']['iorMh'] ?
                                                                        <ImageBackground
                                                                            style={{ width: 45, height: 39 }}
                                                                            resizeMode={'contain'}
                                                                            source={require('../../assets/images/home_bg.png')}
                                                                        >
                                                                            <TouchableOpacity
                                                                                onPress={() => {
                                                                                    this.toggleChangeBetModal(obj, { odds: obj.odds['1x2']['iorMh'], teamName: obj.homeName, oddsKey: 'iorMh', sportType: item.engName, eventType: 'in_play_now', sportId: item.sportId, engName: item.engName, competitionName: '主场' });
                                                                                }}
                                                                                style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
                                                                            >
                                                                                <Text>{obj.odds['1x2']['iorMh']}</Text>
                                                                            </TouchableOpacity>
                                                                        </ImageBackground>
                                                                        :
                                                                        <Text style={{ color: '#999' }}>-</Text>
                                                                    }
                                                                </View>
                                                                <View style={[ styles.recommendTitleColView ]}>
                                                                    {
                                                                        obj.odds['1x2'] && obj.odds['1x2']['iorMn'] ?
                                                                        <TouchableOpacity
                                                                            onPress={() => {
                                                                                this.toggleChangeBetModal(obj, { odds: obj.odds['1x2']['iorMn'], teamName: '和局', oddsKey: 'iorMn', sportType: item.engName, eventType: 'in_play_now', sportId: item.sportId, engName: item.engName, competitionName: '' });
                                                                            }}
                                                                            style={[ { borderWidth: StyleSheet.hairlineWidth, borderRadius: 5, borderColor: '#e3e3e3', width: 45, height: 39, justifyContent: 'center', alignItems: 'center' } ]}
                                                                        >
                                                                            <Text>{obj.odds['1x2']['iorMn']}</Text>
                                                                        </TouchableOpacity>
                                                                        :
                                                                        <Text style={{ color: '#999' }}>-</Text>
                                                                    }
                                                                </View>
                                                                <View style={[ styles.recommendTitleColView ]}>
                                                                {
                                                                    obj.odds['1x2'] && obj.odds['1x2']['iorMc'] ?
                                                                    <ImageBackground
                                                                            style={{ width: 45, height: 39 }}
                                                                            resizeMode={'contain'}
                                                                            source={require('../../assets/images/customer_bg.png')}
                                                                        >
                                                                        <TouchableOpacity
                                                                            onPress={() => {
                                                                                this.toggleChangeBetModal(obj, { odds: obj.odds['1x2']['iorMc'], teamName: obj.guestName, oddsKey: 'iorMc', sportType: item.engName, eventType: 'in_play_now', sportId: item.sportId, engName: item.engName, competitionName: '客场' });
                                                                            }}
                                                                            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
                                                                        >
                                                                            <Text>{obj.odds['1x2']['iorMc']}</Text>
                                                                        </TouchableOpacity>
                                                                    </ImageBackground>
                                                                    :
                                                                    <Text style={{ color: '#999' }}>-</Text>
                                                                }
                                                                </View>
                                                            </View>
                                                        </View>
                                                    )
                                                }) : null
                                            }
                                        </View>
                                    )
                                })
                            }
                        </View>
                        : null
                    }              
                    <View>
                        {
                            hotBall && hotBall.length ?
                                <View style={{ height: 40, alignItems: 'center', flexDirection: 'row' }}>
                                <View
                                    style={{ width: 3, backgroundColor: '#17A84B', height: 18, marginLeft: 1, borderRadius: 2 }}
                                />
                                <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 4 }}>赛事精选</Text>
                            </View>
                            : null
                        }
                        {
                            hotBall && hotBall.length ? hotBall.map((item, index) => {
                                return (
                                    <View  key={index}>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                const newItem = {engName: item.engName, id: item.sportId, name: item.name };
                                                navigation.dispatch(Action.changeEventTypeIndex(0));
                                                navigation.dispatch(Action.selectedBallInfo(newItem));
                                                navigation.dispatch(Action.checkAllianceId(0));
                                                navigation.dispatch(Action.toggleEventType({ typeEngName: item.typeEngName, typeName: item.typeName }));
                                                navigation.navigate('Match', { ...newItem });
                                            }}
                                            style={[ styles.recommendTitleRow, { backgroundColor: item.bgColor }]}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image
                                                    source={item.icon}
                                                    style={{ width: 20, height: 34, resizeMode: 'contain', marginRight: 10 }}
                                                />
                                                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', paddingRight: 10 }}>
                                                <Text style={{ fontSize: 12 }}>
                                                    <Text style={{ color: item.color }}>{item.eventNum}场</Text>
                                                    <Text style={{ color: '#999' }}>比赛可投注</Text>
                                                </Text>
                                                <Icons name="icon-simple-arrow-right" size={14} />
                                            </View>
                                        </TouchableOpacity>
                                        <View style={[ styles.recommendRowView, { height: 30 } ]}>
                                            <View style={{ flex: 1 }}>
                                            </View>
                                            <View style={styles.layoutHalfRowView}>
                                                <View style={styles.recommendTitleColView}>
                                                    <Text style={{ color: '#999999' }}>主</Text>
                                                </View>
                                                <View style={styles.recommendTitleColView}>
                                                    <Text style={{ color: '#999999' }}>和</Text>
                                                </View>
                                                <View style={styles.recommendTitleColView}>
                                                    <Text style={{ color: '#999999' }}>客</Text>
                                                </View>
                                            </View>
                                        </View>
                                        {
                                            item.schedule && item.schedule.length ? item.schedule.map((obj, n) => {
                                                return (
                                                    <View key={n} style={[ styles.recommendRowView ]}>
                                                        <View style={styles.layoutHalfRowView}>
                                                            <View style={{ flex: 8 }}>
                                                                <Text style={{ fontSize: 10, color: '#3d6ea6', marginBottom: 3 }}>{obj.matchName}</Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <Text style={[{ color: '#333333', flex: 7 }, styles.matchInfoPadding]}>{obj.homeName}</Text>
                                                                    <Text style={{ flex: 1.2 }}>{obj.homeScore}</Text>
                                                                </View>
                                                                <View style={[{ flexDirection: 'row', alignItems: 'center' }, styles.matchInfoPadding]}>
                                                                    <Text style={{ color: '#333333', flex: 7 }}>{obj.guestName}</Text>
                                                                    <Text style={{ flex: 1.2 }}>{obj.guestScore}</Text>
                                                                </View>
                                                                <View style={styles.matchInfoPadding}>
                                                                    <Text style={{ fontSize: 12, color: '#999999' }}>{moment(obj.beginTime).format('MM-DD HH:mm')}</Text>                                        
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={styles.layoutHalfRowView}>
                                                            <View style={[ styles.recommendTitleColView ]}>
                                                                {
                                                                    obj.odds['1x2'] && obj.odds['1x2']['iorMh'] ?
                                                                    <ImageBackground
                                                                        style={{ width: 45, height: 39 }}
                                                                        resizeMode={'contain'}
                                                                        source={require('../../assets/images/home_bg.png')}
                                                                    >
                                                                        <TouchableOpacity
                                                                            onPress={() => {
                                                                                this.toggleChangeBetModal(obj, { odds: obj.odds['1x2']['iorMh'], teamName: obj.homeName, oddsKey: 'iorMh', sportType: item.engName, eventType: item.typeEngName, sportId: item.sportId, engName: item.engName, competitionName: '主场' });
                                                                            }}
                                                                            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
                                                                        >
                                                                            <Text>{obj.odds['1x2']['iorMh']}</Text>
                                                                        </TouchableOpacity>
                                                                    </ImageBackground>
                                                                    :
                                                                    <Text style={{ color: '#999' }}>-</Text>
                                                                }
                                                            </View>
                                                            <View style={[ styles.recommendTitleColView ]}>
                                                                {
                                                                    obj.odds['1x2'] && obj.odds['1x2']['iorMn'] ?
                                                                    <TouchableOpacity
                                                                        onPress={() => {
                                                                            this.toggleChangeBetModal(obj, { odds: obj.odds['1x2']['iorMn'], teamName: '和局', oddsKey: 'iorMn', sportType: item.engName, eventType: item.typeEngName, sportId: item.sportId, engName: item.engName, competitionName: '' });
                                                                        }}
                                                                        style={[ { borderWidth: StyleSheet.hairlineWidth, borderRadius: 5, borderColor: '#e3e3e3', width: 45, height: 39, justifyContent: 'center', alignItems: 'center' } ]}
                                                                    >
                                                                        <Text>{obj.odds['1x2']['iorMn']}</Text>
                                                                    </TouchableOpacity>
                                                                    :
                                                                    <Text style={{ color: '#999' }}>-</Text>
                                                                }
                                                            </View>
                                                            <View style={[ styles.recommendTitleColView ]}>
                                                            {
                                                                obj.odds['1x2'] && obj.odds['1x2']['iorMc'] ?
                                                                <ImageBackground
                                                                        style={{ width: 45, height: 39 }}
                                                                        resizeMode={'contain'}
                                                                        source={require('../../assets/images/customer_bg.png')}
                                                                    >
                                                                    <TouchableOpacity
                                                                        onPress={() => {
                                                                            this.toggleChangeBetModal(obj, { odds: obj.odds['1x2']['iorMc'], teamName: obj.guestName, oddsKey: 'iorMc', sportType: item.engName, eventType: item.typeEngName, sportId: item.sportId, engName: item.engName, competitionName: '客场' });
                                                                        }}
                                                                        style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
                                                                    >
                                                                        <Text>{obj.odds['1x2']['iorMc']}</Text>
                                                                    </TouchableOpacity>
                                                                </ImageBackground>
                                                                :
                                                                <Text style={{ color: '#999' }}>-</Text>
                                                            }
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                            }) : null
                                        }
                                    </View>
                                )
                            }) : null
                        }
                    </View>
                    {
                        winnerList && winnerList.length ?
                        <View style={{ marginTop: 10, paddingHorizontal: 10, backgroundColor: '#fff', paddingVertical: 10 }}>
                            {
                                winnerList.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                const newItem = {engName: item.engName, id: item.sportId, name: item.name };
                                                navigation.dispatch(Action.changeEventTypeIndex(0));
                                                navigation.dispatch(Action.selectedBallInfo(newItem));
                                                navigation.dispatch(Action.checkAllianceId(0));
                                                navigation.dispatch(Action.toggleEventType({typeEngName: 'early', typeName: '早盘'}));
                                                navigation.navigate('Match', { ...newItem });
                                            }}
                                            key={index}
                                        >
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 40, alignItems: 'center' }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image
                                                        source={require('../../assets/images/icon_user.png')}
                                                        style={{ resizeMode: 'contain', width: 25, height: 25, marginRight: 5 }}
                                                    />
                                                    <Text style={{ color: '#666666' }}>{item.userName}</Text>
                                                </View>
                                                <View>
                                                    <Text style={{ color: '#999', fontSize: 12 }}>{moment(item.winTime).fromNow()}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F2', paddingHorizontal: 10, paddingVertical: 5 }}>
                                                {
                                                    constants['ballImg'][item.engName] ?
                                                    <Image
                                                        source={constants['ballImg'][item.engName]['image']}
                                                        style={{ width: 35, height: 35, marginRight: 10, resizeMode: 'contain' }}
                                                    />
                                                    :
                                                    <Image
                                                        source={require('../../assets/images/ball_default.png')}
                                                        style={{ width: 35, height: 35, marginRight: 10, resizeMode: 'contain' }}
                                                    />
                                                }
                                                {this.toMoneyConvert(item.content, item.winMoney)}
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View> : null
                    }
                    {
                        loading ?
                            <Image
                                source={require('../../assets/images/default_bg.png')}
                                style={{ width, resizeMode: 'stretch', }}
                            /> : null
                    }
                </ScrollView>
                <Modal
                    isVisible={ modalStatus }
                    backdropOpacity={0.5}
                >
                    <View style={{ paddingBottom: 20, backgroundColor: '#fff' }}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.0 }} end={{ x: 1.0, y: 0.2 }}
                            locations={[0, 0.5, 1.0]}
                            colors={['#83D74F', '#43BB4D', '#17A84B']}>
                            <View style={{ height: 80, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ backgroundColor: 'transparent', color: '#fff', fontSize: 22, fontWeight: 'bold' }}>欢迎免费试玩体验</Text>
                            </View>
                        </LinearGradient>
                        <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
                            <Text style={{ fontSize: 14, color: '#333333', letterSpacing: 0.6, lineHeight: 24 }}><Text style={{ color: '#17A84B', fontWeight: 'bold' }}>试玩账号</Text>只供玩家熟悉游戏,不允许充值和提款且不享有参加优惠活动的权利,有效时间<Text style={{ color: '#FF0000' }}>72小时</Text>。</Text>
                        </View>
                        <View>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    this.setState({ modalStatus: false })
                                }}
                                style={{ width: width/2, height: 30, backgroundColor: '#17A84B', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginVertical: 20, borderRadius: 5 }}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    isVisible={betModalStatus}
                    backdropOpacity={0.5}
                >
                    <TouchableOpacity
                        style={styles.modalView}
                        activeOpacity={1}
                        onPress={() => {
                            this.refs.textInput.blur();
                        }}
                    >
                        <View style={styles.modalTitleView}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>快速投注</Text>
                                {
                                    isLogin ?
                                        <Text style={{ color: '#FFE400', fontSize: 12, marginLeft: 10 }}>余额:{saveUpdateUser.accountBalance}</Text>
                                        :
                                        <TouchableOpacity
                                            style={{ alignItems: 'center', justifyContent: 'center' }}
                                            onPress={() => {
                                                // this.setState({ betModalStatus: false }, () => navigation.navigate('Login'));
                                                this.toggleChangeBetModal({}, {}, () => navigation.navigate('Login'));
                                            }}
                                        >
                                            <Text style={{ color: '#FFE400', fontSize: 12, marginLeft: 10 }}>请先登录</Text>
                                        </TouchableOpacity>
                                }
                                
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    // this.setState({ selectedSchedule: {}, scheduleModel: {}, betModalStatus: false })
                                    this.toggleChangeBetModal({}, {});
                                }}
                            >
                                <Icons name="icon-wrong" color="#fff" size={16} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: 100, paddingHorizontal: 10 }}>
                            <View style={{ flexDirection: 'row', height: 40, alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{selectedSchedule.teamName}</Text>
                                <Text style={{ color: '#FF0000', fontSize: 12 }}>{`${selectedSchedule.competitionName}独赢`}@{odds}</Text>
                            </View>
                            <View style={{ height: 50, justifyContent: 'space-around' }}>
                                <Text style={{ color: '#666666', fontSize: 12 }}>{scheduleModel.matchName}</Text>
                                <Text style={{ color: '#666666', fontSize: 12 }}>{scheduleModel.homeName}VS{scheduleModel.guestName}</Text>
                            </View>
                        </View>
                        <Image
                            source={require('../../assets/images/dashed_bg.png')}
                            style={{ height: 2, width: width * 0.85 }}
                            resizeMode="contain"
                        />
                        <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput
                                    underlineColorAndroid="transparent"
                                    keyboardType="numeric"
                                    ref="textInput"
                                    defaultValue={`${betAmount}`}
                                    placeholder="最低下注10元"
                                    onFocus= {() => {
                                        this.setState({ betAmount: '' })
                                      }}
                                      onBlur= {() => {
                                        if(!betAmount) {
                                          this.setState({ betAmount: 10 })
                                        }
                                      }}
                                      onChangeText={(betAmount) => {
                                        this.setState({ betAmount }, () => {
                                          this.willRendering();
                                        })
                                      }}
                                      maxLength={6}
                                    style={{ height: 24, borderColor: '#979797', paddingVertical: 0,  borderWidth: StyleSheet.hairlineWidth, width: 90, borderRadius: 5, paddingLeft: 5, marginRight: 5, fontSize: 12 }}
                                />
                                <Text style={{ fontSize: 12, color: '#333' }}>元,可赢<Text style={{ color: '#17A84B' }}>{(Math.round(winAmount * 100)/ 100).toFixed(3)}</Text>元</Text>
                            </View>
                            <TouchableOpacity
                                onPress={this.toggleSelect}
                                activeOpacity={0.8}
                                style={{ flexDirection: 'row', marginVertical: 15 }}
                            >
                                {checked ? <Icons name="icon-simple-checked" color="#7E7E7E" size={16} /> : <Icons name="icon-simple-uncheck" color="#7E7E7E" size={16} />}
                                <Text style={{ color: '#666', fontSize: 12 }}> 自动接受较佳赔率</Text>
                            </TouchableOpacity>
                            <View
                                style={{ flexDirection: 'row',  }}
                            >
                                <View
                                    style={{ backgroundColor: '#17A84B', height: 30, flex: 5, alignItems: 'center', justifyContent: 'center', borderRadius: 5, marginRight: 10  }}
                                >
                                {
                                    isBetting ?
                                        <ActivityIndicator size="small" color="#fff" />
                                        :
                                        genBet ?
                                        <View style={{ flexDirection: 'row', height: 30, alignItems: 'center', justifyContent: 'space-around' }}>
                                            <Icons name="icon-right" color="#fff" size={16} />
                                            <Text style={{ color: '#fff', marginLeft: 15 }}>下注成功</Text>                                         
                                        </View>
                                        :
                                        <TouchableOpacity
                                            onPress={this.genOrder}
                                            style={{ flex: 1, justifyContent: 'center', width: 180, alignItems: 'center' }}
                                        >
                                            <Text style={{ color: '#fff' }}>下注</Text>
                                        </TouchableOpacity>
                                }
                                </View>
                                {
                                    startRefresh ?
                                    <View
                                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: '#DFDFE9' }}
                                    >
                                        {
                                            refreshing ?
                                                <ActivityIndicator size="small" color="#fff" />
                                                :
                                                <Text style={{ color: '#fff' }}>{countNum}</Text>
                                        }
                                    </View>
                                    :
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.refreshOdds();
                                        }}
                                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderColor: '#979797', borderWidth: StyleSheet.hairlineWidth, borderRadius: 5 }}
                                    >
                                        <Text style={{ fontSize: 12, color: '#666' }}>刷新</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                        {
                            errorMsg ?
                            <Animatable.View animation="bounce" style={{ height: 24, justifyContent: 'center', paddingHorizontal: 10 }}>
                                <Text style={{ fontSize: 12, color: '#D0021B' }}>{errorMsg}</Text>
                            </Animatable.View>
                            : null
                        }
                    </TouchableOpacity>
                </Modal>
                {
                    isShowPopup ?
                        (accountType === 'guest') ? null :
                        <IndexPopup
                            data={popupInfo && popupInfo.index}
                            isVisible={popClose ? false : (!!popupInfo && !!popupInfo.index)}
                            onClose={this.popModalClose}
                            navigation={navigation}
                        />
                        :null
                }
            </View>
        )
    }
}
const styles =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F9'
    },
    baseView: {
        marginTop: 10,
        backgroundColor: '#fff',
        borderColor: '#E5E5E5',
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },
    marquee: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 35,
        width,
        // borderRadius: 20,
        borderColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    nav: {
        flexDirection: 'row',
        borderColor: 'transparent',
        marginTop: 10
    },
    navItem: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        flex: 1
    },
    Matches: {
        borderColor: 'transparent'
    },
    MatchesTitle: {
        height: 40,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    MatchesList: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingHorizontal: 10
    },
    MatchesListItem: {
        width: width / 2 - 10,
        height: 95,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderColor: '#DCDCDC',
        borderTopWidth: StyleSheet.hairlineWidth
    },
    ballBox: {
        backgroundColor: '#fff',
        height: 30,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5
    },
    ballBoxView: {
        flexDirection: 'column',
        width: 125,
        marginRight: 10
    },
    recommendTitleColView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    recommendRowView: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomColor: '#CBCBCB',
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 5,
        paddingVertical: 10
    },
    recommendTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 34,
        alignItems: 'center',
    },
    layoutHalfRowView: {
        flex: 1,
        flexDirection: 'row'
    },
    matchInfoPadding: {
        paddingVertical: 3
    },
    modalView: {
        backgroundColor: '#fff',
        width: width * 0.85,
        // height: 250,
        alignSelf: 'center',
        borderRadius: 5,
        paddingBottom: 10
    },
    modalTitleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#17A84B',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        height: 40,
        alignItems: 'center',
        paddingHorizontal: 10
    }
});
const mapStateToProps = (state) => {
    return {
        matchEventType: state.match.matchReducer.matchEventType,
        isMounted: state.match.isMounted,
        isLogin: state.match.saveUpdateUser.isLogin,
        userName: state.match.saveUpdateUser.userName,
        accountType: state.match.saveAcountType.type,
        popupInfo: state.match.savePopupInfo.popupInfo,
        saveUpdateUser: state.match.saveUpdateUser,
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        changeUserStatus: (status) => {dispatch(Action.changeAgentAction(status))},
        updateUser: (res) => dispatch(Action.updateUser({ isLogin: true, ...res.data }))
    }
}
export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(Main), 'Main');