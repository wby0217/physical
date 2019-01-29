// 综合过关购物车
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Image,
    TextInput,
    Animated,
    Easing,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    Alert
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import Immutable, {  Map, List } from 'immutable';
import { Nodata, OverlaySpinner, Succtips } from '../../../component/tips';
import { Icons, service, ErrorHandle, Action, constants, showToast, Header } from '../../mesosphere';
import commonFn from './commonFn';
import CountDown from './countDown';

const dismissKeyboard = require('dismissKeyboard');
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
const AUROODDSENUM = { true: 'yes', false: 'no' };
const isIos = Platform.OS === 'ios';
class ParlayOrder extends Component {
    static navigationOptions = ({ navigation }) => ({
            header: null,
            headerTitle: '综合过关',
    });
    parlayMin = 0; // 最小串关
    parlayMax = 0;  // 最大串关
      constructor(props) {
        super(props);
        this.state = {
            checked: true,
            autoOdds: 'yes', //  yes为自动接收赔率  no为不接受自动赔率
            wager: 10, // 下单金额
            dataInfo: [], // 根据props中的activeid得到数据
            activeIds: props.navigation.state.params.activeId || [],
            isOpenSucc: false,
            isConnecting: false,
            paddingBottomHeight: 0,
            timeNumber: 10,
            winAmount: 0,
            sumOdds: 1,
            isStopBet: false,
            stopRefresh: false,
            showBottom: true
        };
        this.timer = null;
        this.timeNumber = 10;
        this.spinValue = new Animated.Value(0);
        this.pinValue = this.spinValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '360deg']
                        });
    }
    componentDidMount() {
       // 监听键盘事件
        this.keyboardDidShowListener = isIos ?
        Keyboard.addListener('keyboardWillShow', this.updateKeyboardSpace.bind(this)) : Keyboard.addListener('keyboardDidShow', this.updateKeyboardSpace.bind(this))
        this.keyboardDidHideListener = isIos ?
        Keyboard.addListener('keyboardWillHide', this.resetKeyboardSpace.bind(this)): Keyboard.addListener('keyboardDidHide', this.resetKeyboardSpace.bind(this));
        this.toggleLoading(true);
        this.getNewInfo();
        this.operationWin();
    }
    updateKeyboardSpace(frames) {
        // 处理键盘兼容问题
      //  this.setState({ paddingBottomHeight: 65 });
    }
    resetKeyboardSpace(frames) {
        // 处理键盘兼容问题
      //  this.setState({ paddingBottomHeight : 0 });
    }
    getNewInfo = () => {
        // 获取最新赔率数据
         const { activeIds } = this.state;
         const { navigation } = this.props.navigation.state.params;
            if(!activeIds.length) {
                return false;
            }
            const betinfoArr = [];
            activeIds.map((item) => {
                const betInfoItem = item.split('-');
                betInfoItem[8] ?
                  betinfoArr.push({
                    gameId: betInfoItem[3],
                    eventType: 'parlay',
                    playType: betInfoItem[1],
                    oddsKey: betInfoItem[0],
                    ratioKey: betInfoItem[8]
                }) :
                  betinfoArr.push({
                    gameId: betInfoItem[3],
                    eventType: 'parlay',
                    playType: betInfoItem[1],
                    oddsKey: betInfoItem[0]
                });
          });
        const oderInfoParam = {
            gameInfo: JSON.stringify(betinfoArr),
            sportType: navigation.state.params.engName
        };
       
        service.getParlayInfoByActiveIdService(oderInfoParam)
        .then(json => {
            this.toggleLoading(false);
            // if(!json.data || !!!json.data.length) return;
            const newList = Immutable.List(json.data);
            const prevList = Immutable.List(this.state.dataInfo);
            if(!Immutable.is(newList, prevList)) {
              this.setState({
                  dataInfo: newList.toArray()
              });
            }
        })
        .catch(err => {
            this.toggleLoading(false);
            ErrorHandle(err);
        })
    }
    toggleSelect = () => {
        this.setState({
            checked: !this.state.checked,
            autoOdds: AUROODDSENUM[this.state.checked]
        });
    }
    genOrder = () => {
        const { activeIds, autoOdds, wager, dataInfo } = this.state;
        const { activeId, navigation, isLogin } = this.props;
        const { genOrderInfo, selectedBallInfo } = navigation.state.params;
        const { params } = navigation.state.params.navigation.state;
        const sportsId = params.id;
        dismissKeyboard();
        if(!isLogin) {
            commonFn.toLogin(navigation, ['Main', { routeName: 'Match', params }]);
            return;
        }
        if (activeIds.length < parlayMin) {
            showToast(`请至少选择${parlayMin}场比赛!`);
            return false;
        }
        if (activeIds.length > parlayMax) {
            showToast(`最多可选择${parlayMax}场比赛!`);
            return false;
        }
        const betinfoArr = [];

            dataInfo.map((item) => {
              if(item.strong && item.ratioKey) {
                    betinfoArr.push({
                        gameId: item.gameId,
                        odds: item.odds,
                        playType: item.playType,
                        oddsKey: item.oddsKey,
                        ratioKey: item.ratioKey,
                        ratio: item.ratio,
                        strong: item.strong
                    })
              } else if (item.ratioKey) {
                    betinfoArr.push({
                        gameId: item.gameId,
                        odds: item.odds,
                        playType: item.playType,
                        oddsKey: item.oddsKey,
                        ratioKey: item.ratioKey,
                        ratio: item.ratio
                    })
              } else {
                    betinfoArr.push({
                        gameId: item.gameId,
                        odds: item.odds,
                        playType: item.playType,
                        oddsKey: item.oddsKey
                    })
              }
            })

        const orderParam = {
                autoOdds: autoOdds,
                betAmount: wager,
                sportId: selectedBallInfo.id,
                eventType: genOrderInfo.eventType,
                betInfo: JSON.stringify(betinfoArr)
            };
        this.setState({ isStopBet: true });
        service.genOrderBetService(orderParam)
            .then(json => {
                this.setState({
                    isOpenSucc: true,
                    isStopBet: false
                })
            })
            .catch(err => {
             if( err.errorcode && err.errorcode === 103001) {
                if(navigation.state.params.accountType && (navigation.state.params.accountType == 'guest')) {
                  return Alert.alert('', '下注金额已超过可用金额', [{ text: '确认', style: 'cancel', onPress: () => { this.setState({ isConnecting: false, isStopBet: false }) } }]);
                }
                  return Alert.alert('', '当前余额不足',[ { text: '取消', style: 'cancel', onPress: () => { } }, {
                    text: '去充值', onPress: () => {
                      this.clearRefreshTimer
                      navigation.navigate('Recharge', { countDown: this.countDown });
                    }
                  }])
              }
              this.setState({ isStopBet: false });
                err.navigation = navigation;
                err.routeNames = ['Main', 'Match']
                ErrorHandle(err);
            })
    }
    sliceParlayOrder = (item) => {
            // 删除综合订单
        const { navigation } = this.props;
        _.remove(this.state.dataInfo, (obj) => obj.gameId === item.gameId);
        const activeIndex =  _.findIndex(this.state.activeIds, (activeId) => {
            return (activeId.indexOf(`-${item.gameId}-`) > -1)
        })
        let arrTemp = [].concat(this.state.activeIds)
            arrTemp.splice(activeIndex, 1)
        let odds = 1;
        const { wager, dataInfo } = this.state;
        if(arrTemp.length > 0 ) {
            arrTemp.map((item) => {
              odds *= parseFloat(item.split('-')[2]);
            });
            this.setState({
              winAmount: wager * odds - wager,
              sumOdds: odds
            })
        } else {
            this.setState({
              showBottom: false
            })
        }
        this.setState({
            dataInfo: this.state.dataInfo,
            activeIds: arrTemp
        });
        if(!dataInfo.length) {
          this.setState({
            isStopBet: true
          })
          this.clearRefreshTimer();
          navigation.state.params && navigation.state.params.clearActiveId && navigation.state.params.clearActiveId();
          return;
      }
    }
    addMatchs = () => {
        // 添加赛事
        const { navigation } = this.props;
        this.clearRefreshTimer();
        navigation.state.params.countDown && navigation.state.params.countDown();
        navigation.state.params && navigation.state.params.clearActiveId && navigation.state.params.clearActiveId(this.state.activeIds);
        navigation.goBack();
    }
    onClose = (data) => {
        const { navigation } = this.props;
        this.timeNumber = 10;
        this.clearRefreshTimer();
        navigation.state.params.countDown && navigation.state.params.countDown();
        navigation.state.params && navigation.state.params.clearActiveId && navigation.state.params.clearActiveId();
        navigation.goBack();
    }
    clearAll = () => {
        const { navigation } = this.props;
        if(!this.state.activeIds.length) {
          return this.dropdown.alertWithType('warn', '提醒!', '你已没有注单了,快去重新下注吧?');
        }
        // 清空重选
        Alert.alert("","确定清空所选投注吗?",[
            {text:"取消",style:"cancel"},
            {text:"确定",onPress:()=> {
                this.setState({
                  dataInfo: [],
                  activeIds: [],
                  isStopBet: true
                });
              this.timeNumber = 10;
              this.clearRefreshTimer();
              navigation.state.params.countDown && navigation.state.params.countDown();
              navigation.state.params && navigation.state.params.clearActiveId && navigation.state.params.clearActiveId();
              navigation.goBack();
            }}
        ]);
    }
    modalDidClose = () => {
        this.clearRefreshTimer();
        const { navigation } = this.props;
        navigation.state.params && navigation.state.params.clearActiveId && navigation.state.params.clearActiveId();
        navigation.state.params && navigation.state.params.countDown && navigation.state.params.countDown();
        navigation.goBack();
    }
    toggleLoading = (status) => {
        const { isConnecting } = this.state;
        this.setState({ isConnecting: status !== undefined ? status : !isConnecting })
    }
    componentWillUnmount() {
        this.clearRefreshTimer();
    }
    headerRight = () => {
      const { navigation } = this.props;
      return <CountDown countOverHandler={this.getNewInfo} ref={ ref => this.countDownRef = ref } />
    }
    headerLeft = () => {
      return (<TouchableOpacity
                  onPress={() => {
                    const { navigation } = this.props;
                    this.clearRefreshTimer();
                    navigation.state.params.countDown && navigation.state.params.countDown();
                    this.setState({
                      stopRefresh: true
                    },() => {
                      navigation.state.params.clearActiveId && navigation.state.params.clearActiveId();
                      navigation.goBack();
                    })
                  }}
              >
              <Icons name="icon-back-normal" size={22} color='#fff' />
            </TouchableOpacity>)
    }
    restartRefresh = () => {
        this.countDownRef && this.countDownRef.startRefresh && this.countDownRef.startRefresh();
    }
    clearRefreshTimer = () => {
        this.countDownRef && this.countDownRef.pauseRefresh && this.countDownRef.pauseRefresh();
    }
    operationWin = () => {
      let winAmount = 0; // 可赢金额
      let odds = 1;   // 赔率
      const { activeIds, sumOdds, wager } = this.state;
      if(activeIds.length > 0) {
          activeIds.map((item) => {
            odds *= parseFloat(item.split('-')[2]);
          });
          this.setState({
            winAmount: this.state.wager * odds - wager,
            sumOdds: odds
          })
        } else {
          this.setState({
            winAmount: 0,
            sumOdds: 0
          })
        }
    }
    render() {
        let odds = 1;   // 赔率
        const { gameInfoArry, navigation } = this.props;
        const { activeIds, isConnecting, winAmount, sumOdds } = this.state;

    if(activeIds.length > 0) {
        const activeIdArr = activeIds[0].split('-');
        parlayMin = activeIdArr[5];
        parlayMax = activeIdArr[6];
        for(let i=0; i<activeIds.length; i++){
          const activeIdItem = activeIds[i].split('-');
          if(parlayMin < activeIdItem[5]) {
            // 最小串关数取最大值
            parlayMin = activeIdItem[5]
          }
          if(parlayMax > activeIdItem[6]) {
            // 最大串关数取最小值
            parlayMax = activeIdItem[6];
          }
        }
    } else {
      parlayMin = 0;
      parlayMax = 0;
    }
    const title = (<Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>综合过关</Text>);
    const { isOpenSucc, paddingBottomHeight, wager, isStopBet, showBottom } = this.state;
    return (
      <KeyboardAvoidingView behavior={isIos ? "padding" : ''} style={{ flex: 1, backgroundColor: '#F5F5F9' }}>
        <Header
           headerTitle="综合过关"
           headerRight = {this.headerRight}
           navigation = {navigation}
           headerLeft = {this.headerLeft}
        />
        <View style={styles.topBtnView}>
          <TouchableOpacity
            onPress={this.addMatchs.bind(this)}
            style={styles.topbtn} activeOpacity={0.8}>
            <Icons name="icon-cycle-add" color="#BDBDBD" size={18} />
            <Text style={{ color: '#666', marginLeft: 5 }}>添加赛事</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.clearAll.bind(this)}
            style={styles.topbtn} activeOpacity={0.8}>
            <Icons name="icon-simple-recycle" color="#BDBDBD" size={18} />
            <Text style={{ color: '#666', marginLeft: 5 }}>清空重选</Text>
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, height: deviceHeight - 200 }}>
          <View style={styles.topback}>
            <View style={styles.topbackmid}></View>
          </View>
          <ScrollView style={{ marginTop: -10 }} showsVerticalScrollIndicator={false}>
            <View style={styles.scrollView}>
              {this.state.dataInfo.length > 0 && this.state.dataInfo.map((item, i) => {
                return (
                  <View style={[styles.orderItem, (i === this.state.dataInfo.length - 1) ? { borderBottomWidth: 0 } : null]} key={i}>
                    <View style={{flexDirection:'row', paddingVertical: 3, alignItems:'center',justifyContent:'space-between'}}>
                      <Text style={{ fontSize:14 }}><Icons name="icon-medals" color="#FB9709" size={17} /> {item.matchName}</Text>
                      <Text style={{ fontSize:14 }}>{item.playTypeName}</Text>
                    </View>
                    <Text style={{ paddingVertical: 3 }}>{item.homeName} vs {item.guestName}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
                      <Text>
                        <Text>{item.betInfoString}</Text>
                        <Text style={{ color: '#FF0000' }}> @{Number(item.odds).toFixed(2)}</Text>
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this.sliceParlayOrder.bind(this, item)}
                      >
                        <Icons name="icon-recycle" color="#BDBDBD" size={18} />
                      </TouchableOpacity>
                    </View>
                    {
                      item.gameType ?
                        <Text style={{ paddingVertical: 3 }}>{item.gameType}</Text>
                        :
                        null
                    }
                  </View>
                );
              })}
              <Image
                source={ require('../../../assets/images/bottom_border.png')}
                style={{ resizeMode: 'contain', width: (deviceWidth * 0.92 + 18), position: 'absolute', left: -9, bottom: -24 }}
                />
            </View>
          </ScrollView>
        </View>
       {
         showBottom ?
         <View style={{ paddingBottom: paddingBottomHeight }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 10, backgroundColor: '#E2E2E2' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#666' }}>{this.state.activeIds.length}串1 </Text>
                    <Text style={{ color: '#FF0000', fontWeight: 'bold' }}>@{Math.floor(sumOdds * 100)/ 100}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={this.toggleSelect}
                    activeOpacity={0.8}
                    style={{ flexDirection: 'row' }}
                  >
                    {this.state.checked ? <Icons name="icon-simple-checked" color="#666" size={16} /> : <Icons name="icon-simple-uncheck" color="#666" size={16} />}
                    <Text style={{ color: '#666' }}> 自动接受较佳赔率</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      style={{ height: 30, borderColor: 'gray', borderWidth: 1, width: deviceWidth / 4, borderRadius: 5, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 0 }}
                      underlineColorAndroid="transparent"
                      keyboardType="numeric"
                      defaultValue={`${wager}`}
                      onFocus={() => {
                        this.setState({
                          wager: ''
                        })
                      }}
                      onBlur = {() => {
                        const { wager } = this.state;
                        if(!wager) {
                          this.setState({
                            wager: 10
                          })
                        }
                      }}
                      onChangeText={
                        (wager) => this.setState({ wager }, () => {
                          this.operationWin()
                        })
                      }
                      maxLength={6}
                    />
                    <Text style={{ color: '#fff' }}> 元,可赢<Text style={{ color: '#FFE400', fontWeight: 'bold' }}>{(Math.round(winAmount * 1000)/ 1000).toFixed(3)}</Text>元</Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      style={[{ backgroundColor: '#17A84B', borderRadius: 5, width: deviceWidth / 5, height: 30, justifyContent: 'center', alignItems: 'center' }, isStopBet ?  { backgroundColor: '#6F9B7F' } : null]}
                      onPress={this.genOrder}
                      activeOpacity={0.8}
                      disabled={isStopBet}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>下 注</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            </View>
            : null
       }
             <OverlaySpinner
                  visible= {isConnecting}
                  cancelable= {true}
                  onTouchShade={() => {
                      this.setState({
                          isConnecting: !isConnecting
                      })
                  }}
              />
          <Succtips isVisible={isOpenSucc} onBackdropPress={this.modalDidClose} onModalHide={this.modalDidClose} />
          <DropdownAlert ref={ref => this.dropdown = ref} closeInterval={1800} onClose={data => this.onClose(data)} />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  topback: {
    backgroundColor: '#fff',
    width: deviceWidth * 0.97,
    flexDirection: 'row',
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 5
  },
  topbackmid: {
    height: 8,
    backgroundColor: '#ccc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1
  },
  scrollView: {
    borderWidth: StyleSheet.hairlineWidth,
    width: deviceWidth * 0.92,
    borderColor: '#ccc',
    paddingTop: 160,
    top: -160,
    backgroundColor: '#fff',
    borderBottomWidth: 0,
    shadowColor: '#ddd'
  },
  topBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10
  },
  topbtn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    backgroundColor: '#fff'
  },
  orderItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    borderStyle: 'solid',
    borderLeftWidth: 0,
    borderTopWidth: 0
  }
});
const mapStateToProps = (state) => {
  return {
    isLogin: state.match.saveUpdateUser.isLogin,
  };
};

export default connect(mapStateToProps)(ParlayOrder);