// 下单底部弹出模块

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    TouchableOpacity,
    TextInput,
    Dimensions,
    Animated,
    Easing,
    Alert,
    Image
} from 'react-native';
import _ from 'lodash';
import Toast from 'react-native-root-toast';
import Immutable from 'immutable';
import { View, Text } from 'react-native-animatable';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc';
import Modalbox from 'react-native-modal';
import { Icons, service, ErrorHandle, Action } from '../../mesosphere';
import commonFn from './commonFn';
import { OverlaySpinner } from '../../../component/tips';

const { width } = Dimensions.get('window');
const formatStr = (str) => {
  if (str) {
    return str.replace('#', '-');
  }
  return str;
};
const AUROODDSENUM = {
  true: 'yes',
  false: 'no'
};
// 玩法   大小、 让球 赔率 * 本金
const PLAYTYPEINARRY = ['ftOu', 'ftHandicap', '1hOu', '1hHandicap', 'handicap', 'ou', 'ouPg', 'ouTeam'];
export default class OrderPop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: true,
      fadeInOpacity: new Animated.Value(1),
      betAmount: 10, // 下单金额
      isParlayType: false, // 是否为综合玩法
      winAmount: 0,
      isConnecting: false,
      isStopBet: false,
      oddsModal: false,
      ratio: (props.activeId.length && props.activeId[0].split('-')[9]) || '',
      odds: (props.activeId.length && props.activeId[0].split('-')[2]) || 0, // 赔率刷新
      strong: (props.activeId.length && props.activeId[0].split('-')[10]) || ''
    };
    this.toggleSelect = this.toggleSelect.bind(this);
    this.navation = props.navigationActions;
    this.willRendering = this.willRendering.bind(this);
    this.countdown = this.countdown.bind(this); // 倒计时刷新赔率
    this.user = {};
    this.timer = null; // 倒计时
    this.odds = (props.activeId.length && props.activeId[0].split('-')[2]) || 1 ;
    this.parlayMin = 0; // 最小串关
    this.parlayMax = 0;  // 最大串关
  }
  willRendering(nextProps) {
    const { activeId, matchEventType } = nextProps || this.props;
    if(matchEventType) {
       if(matchEventType.typeEngName === 'parlay') {
          // 综合过关
          this.odds = 1;
          let maxBetArr = [];
          let minBetArr = [];
          activeId.map((item, index) => {
            const activeIds = item.length && item.split('-');
            this.odds *= activeIds[2];
            minBetArr.push(activeIds[5]);
            maxBetArr.push(activeIds[6]);
          })
          this.parlayMin = Math.max(...minBetArr);
          this.parlayMax = Math.min(...maxBetArr);
       } else {
         // 非综合过关
          let winAmount = 0;
          // debugger;
          const activeIds = activeId.length && activeId[0].split('-');
          if (PLAYTYPEINARRY.includes(activeIds[1])) {
            // 让球 、大小 赔率计算
            winAmount = this.state.betAmount * activeIds[2];
          } else {
            winAmount = this.state.betAmount * (activeIds[2] - 1);
          }
          // clearInterval(this.timer);
          // this.timer = setInterval(() => {
          //   this.refreshOdds(nextProps);
          // }, 30 * 1000);
          this.setState({
            winAmount,
            odds: activeIds[2],
            ratio: activeIds[9],
            strong: activeIds[10]
          })
       }
    }
  }
  componentWillReceiveProps(nextProps) {
    this.willRendering(nextProps);
  }
  componentDidMount() {
    this.willRendering(this.props);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  refreshOdds = (nextProps) => {
    const { activeId, genOrderInfo, navigation } = nextProps || this.props;
    const activeIds = activeId.length && activeId[0].split('-');
    const oddsParams = {
        gameId: activeIds[3],
        eventType: genOrderInfo.eventType,
        playType: activeIds[1],
        oddsKey: activeIds[0],
        sportType: navigation.state.params.engName
      }
      if(activeIds[9]) {
          oddsParams['oddsKey'] = activeIds[8]
      }
      service.refreshOddsService(oddsParams)
      .then(json => {
          this.setState({
            odds: json.data.odds,
            ratio: json.data.ratio,
            strong: json.data.strong
          })
      })
      .catch(err => {
        ErrorHandle(err);
      })
  }
  toggleSelect() {
    this.setState({
      checked: !this.state.checked
    });
  }
  countdown() {
    //倒计时10秒钟 刷新赔率
    const { activeId, genOrderInfo } = this.props;
  }
  genOrder = (lastOdds, lastRatio, lastStrong) => {
    const { activeId, genOrderInfo, navigation, isLogin, selectedBallInfo, succCallback } = this.props;
    const { betAmount, odds, ratio, strong } = this.state;
    if(!isLogin) {
        this.props.clearTimerHandle && this.props.clearTimerHandle();
        commonFn.toLogin(navigation, ['Main', { routeName: 'Match', params: navigation.state.params }], this.props);
        return;
    }
    this.setState({ isConnecting: true, isStopBet: true });
    const betInfoArr = activeId.length && activeId[0].split('-');
    let betInfo = '';
    if(strong && betInfoArr[8]) {
      betInfo = JSON.stringify([
        {
          gameId: betInfoArr[3],
          odds: isNaN(lastOdds) ? odds : lastOdds,
          playType: betInfoArr[1],
          oddsKey: betInfoArr[0],
          ratioKey: betInfoArr[8],
          ratio: isNaN(lastRatio) ? ratio : lastRatio,
          strong: isNaN(lastStrong) ? strong: lastStrong
        }
      ]);
    } else if(betInfoArr[8]) {
      betInfo = JSON.stringify([
        {
          gameId: betInfoArr[3],
          odds: isNaN(lastOdds) ? odds : lastOdds,
          playType: betInfoArr[1],
          oddsKey: betInfoArr[0],
          ratioKey: betInfoArr[8],
          ratio: isNaN(lastRatio) ? ratio : lastRatio,
        }
      ]);
    } else {
      betInfo = JSON.stringify([
        {
          gameId: betInfoArr[3],
          odds: isNaN(lastOdds) ? odds : lastOdds,
          playType: betInfoArr[1],
          oddsKey: betInfoArr[0]
        }
      ]);
    }
    const param = {
      autoOdds: AUROODDSENUM[this.state.checked],
      betAmount,
      sportId: selectedBallInfo.id,
      eventType: genOrderInfo.eventType,
      betInfo
    };
    service.genOrderBetService(param)
    .then(res => {
      this.setState({ isConnecting: false }, () => {
        succCallback && succCallback();
      });
    })
    .catch(err => {
      if(err.errorcode) {
          if(err.errorcode === 103012) {
              this.refreshOdds();
              if(err.data && err.data.odds) {
                this.setState({ odds: err.data.odds });
              }
              return Alert.alert("",`赔率发生变化为${err.data.odds},确定进行下注吗?`,[
                  { text: '取消', style: "cancel", onPress: () => {
                    this.setState({ isConnecting: false, isStopBet: false })
                  }},
                  { text: "确定", onPress: () => {
                    this.genOrder(err.data && err.data.odds ? err.data.odds : undefined,  err.data && err.data.ratio ? err.data.ratio : undefined, err.data && err.data.strong ? err.data.strong : undefined);
                  }}
              ]);
          } else if(err.errorcode === 103001) {
              if(this.props.accountType == 'guest') {
                return Alert.alert('', '下注金额已超过可用金额', [{ text: '确认', style: 'cancel', onPress: () => { this.setState({ isConnecting: false, isStopBet: false }) } }]);
              }
              return Alert.alert('', '当前余额不足',[ { text: '取消', style: 'cancel', onPress: () => { this.setState({ isConnecting: false, isStopBet: false }) } }, {
                text: '去充值', onPress: () => {
                    this.props.clearTimerHandle && this.props.clearTimerHandle();
                    this.setState({ isConnecting: false, isStopBet: false },() => {
                    navigation.navigate('Recharge', { ...this.props });
                  })
                }
              } ])
          } else if(err.errorcode === 103020) {
            this.refreshOdds();
            if(err.data && err.data.strong) {
              this.setState({ strong: err.data.strong });
            }
            return Alert.alert("",err.message,[
                { text: '取消', style: "cancel", onPress: () => {
                  this.setState({ isConnecting: false, isStopBet: false })
                }},
                { text: "确定", onPress: () => {
                  this.genOrder(err.data && err.data.odds ? err.data.odds : undefined,  err.data && err.data.ratio ? err.data.ratio : undefined, err.data && err.data.strong ? err.data.strong : undefined);
                }}
            ]);
          } else if([103016,103017,103018,103019].includes(err.errorcode)) {
            this.refreshOdds();
            if(err.data && err.data.ratio) {
              this.setState({ ratio: err.data.ratio });
            }
            return Alert.alert("",`${err.message}`,[
                { text: '取消', style: "cancel", onPress: () => {
                  this.setState({ isConnecting: false, isStopBet: false })
                }},
                { text: "确定", onPress: () => {
                  this.genOrder(err.data && err.data.odds ? err.data.odds : undefined,  err.data && err.data.ratio ? err.data.ratio : undefined, err.data && err.data.strong ? err.data.strong : undefined);
                }}
            ]);
          }
      }
      if(typeof(err) === 'object') {
        err.navigation = navigation;
        err.routeNames = ['Main', 'Match']
      }
      this.setState({ isConnecting: false, isStopBet: false },() => ErrorHandle(err));
    })
  }
  genParlayOrder() {
    const { navigation, isLogin } = this.props;
    // 综合过关生成订单
    const obj = Object.assign({},this.props);
    delete obj.tabView
    this.props.clearTimerHandle && this.props.clearTimerHandle();
    if(!isLogin) {
        commonFn.toLogin(navigation, ['Main', { routeName: 'Match', params: {...navigation.state.params} }], obj);
        return;
    }
    if (this.props.activeId.length < this.parlayMin) {
      Toast.show(`请至少选择${this.parlayMin}场比赛!`, {
        position: Toast.positions.CENTER,
      });
      return false;
    }
    if (this.props.activeId.length > this.parlayMax) {
      Toast.show(`最多可选择${this.parlayMax}场比赛!`, {
        position: Toast.positions.CENTER,
      });
      return false;
    }
    // this.props.clearActiveId && this.props.clearActiveId();
    navigation.navigate('ParlayOrder', obj);
  }
  render() {
    const { activeId, matchEventType } = this.props;
    const { isOpenSucc, fadeInOpacity, isParlayType, odds, checked, winAmount, isConnecting, betAmount, isStopBet, oddsModal, ratio, strong } = this.state;
    const activeInfo = activeId.length && activeId[0].split('-');
    return (
      <View animation="fadeInUp" style={{ opacity: fadeInOpacity, }}>
          <View>
            { matchEventType.typeEngName !== "parlay" ?
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 10, backgroundColor: '#E2E2E2' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 5, paddingRight: 3 }}>
                    <Text style={{ color: '#666' }}>
                      {formatStr(activeInfo[4])}
                      {strong ? strong === activeInfo[11] ? ratio : null : ratio}
                      <Text style={{ color: '#FF0000' }}>  @{Number(odds).toFixed(2)}</Text>
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={this.toggleSelect}
                    activeOpacity={0.8}
                    style={{ flexDirection: 'row', flex: 4, justifyContent: 'flex-end' }}
                  >
                    {checked ? <Icons name="icon-simple-checked" color="#666" size={16} /> : <Icons name="icon-simple-uncheck" color="#666" size={16} />}
                    <Text style={{ color: '#666' }}> 自动接受较佳赔率</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      style={{ height: 30, borderColor: 'gray', borderWidth: 1, width: width / 4, borderRadius: 5, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 0, fontSize: 16 }}
                      underlineColorAndroid="transparent"
                      keyboardType="numeric"
                      defaultValue={`${betAmount}`}
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
                    />
                    <Text style={{ color: '#fff' }}> 元,可赢<Text style={{ color: '#FFE400' }}>{(Math.round(winAmount * 100)/ 100).toFixed(3)}</Text>元</Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      style={[{ backgroundColor: '#17A84B', borderRadius: 5, width: width / 5, height: 30, justifyContent: 'center', alignItems: 'center' },isStopBet ?  { backgroundColor: '#6F9B7F' } : null ]}
                      onPress={this.genOrder}
                      activeOpacity={0.8}
                      disabled={isStopBet}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold',fontSize: 16 }}>下 注</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View> :
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, backgroundColor: '#565957', paddingHorizontal: 10, alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#fff'}}>{ this.props.activeId && this.props.activeId.length }串1 @</Text>
                    <Text style={{ color: '#FFE400' }}> {Math.floor(this.odds * 100)/ 100}</Text>
                    {this.props.activeId.length < this.parlayMin ?
                      <Text animation="bounceIn" style={{ color: '#fff', marginLeft: 5 }}>
                        (最小串{this.parlayMin}关)
                      </Text>
                      :
                      null
                    }
                  </View>
                  <View>
                    <TouchableOpacity
                      style={{ backgroundColor: '#17A84B', borderRadius: 5, width: width / 5, height: 30, justifyContent: 'center', alignItems: 'center' }}
                      onPress={this.genParlayOrder.bind(this)}
                      activeOpacity={0.8}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>确 定</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            }
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
          {/* <Modalbox
              isVisible={this.state.oddsModal}
              style={{ alignItems: 'center' }}
          >
              <TouchableOpacity
                style={{ alignSelf: 'flex-end', marginRight: 40 }}
                onPress={() => {
                  this.setState({ oddsModal: false, isStopBet: false  })
                }}
              >
                <Icons  name="icon-cycle-close" color="#fff" size={24} style={{ top: -20 }}/>
              </TouchableOpacity>
              <View style={{ backgroundColor: '#fff', marginHorizontal: 30 }}>
                  <View style={{ alignItems: 'center', height: 40, justifyContent: 'center' }}>
                     <Image source={require('../../../assets/images/icon_warn.png')} style={{ width: 24, height: 24, resizeMode: 'contain' }} />
                  </View>
                  <View style={{ paddingHorizontal: 20, paddingVertical: 15, alignItems: 'center' }}>
                      <Text style={{ color: '#333333' }}>赔率更新为<Text style={{ color: '#FF0000' }}>{this.lastOdds}</Text>,确定进行下注吗?</Text>
                  </View>
                  <View style={{ paddingVertical: 15, backgroundColor: '#EAEAEA' }}>
                      <TouchableOpacity
                        style={{ backgroundColor: '#17A84B', marginHorizontal: 30, height: 24, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}
                        activeOpacity={0.6}
                        onPress={() => {
                          this.setState({ oddsModal: false, isStopBet: false })
                          this.genOrder(this.lastOdds ? this.lastOdds : undefined)
                        }}
                      >
                          <Text style={{ color: '#fff', fontWeight: 'bold' }}>确定</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </Modalbox> */}
      </View>
    );
  }
}



