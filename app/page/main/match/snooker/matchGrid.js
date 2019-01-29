// 网球


// 独赢、大小、单双 表格模块

import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Immutable, { Map, List } from 'immutable';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Icons } from '../../../mesosphere';
const moment = require('moment');

let prevProps = {};
class TennisMatchGrid extends Component {
  // 0 表示无变化、1表示上涨、 -1表示下跌
  constructor(props) {
    super(props);
    this.state = {
      // half: false,
      // matchTypeId: '',
      // prevProps: props.n
      iorOuho: 0, // 球员局数大小-主/大
      iorMh: 0, // 独赢主赔率
      iorRh: 0, // 让球主赔率
      iorMc: 0, // 独赢客赔率
      iorRc: 0,  // 让球 客赔率
      iorOuh: 0, // 大小球 -客
      iorOuc: 0, // 大小球 -主
      iorOuhu: 0, // 球员局数大小-主/小
      iorOuco: 0, // 球员局数大小-客/大
      iorOucu: 0, // 球员局数大小-客/小
      gameTypeIndex: 0,
      activeGamesInfex: 0
    };
    this.propString = JSON.stringify(props.n['games']);
    this.isActive = this.isActive.bind(this);

  }
  shouldComponentUpdate(nextProps, nextState) {
    const activeIds = nextProps.activeId;
    const activeIdStr = activeIds.toString();
    const obj = nextProps.n['games'];
    const gameId = obj[nextState.activeGamesInfex] ? obj[nextState.activeGamesInfex].gameId : '';
    const prevGameId = nextProps.prevGameId.toArray();
    const prevGameIdStr = prevGameId.length && prevGameId.toString();
    const prevActiveId = nextProps.prevActiveId.toArray();
    const prevAtiveIds = prevActiveId.length && prevActiveId.toString();

    const prevObj = JSON.parse(this.propString);
    this.propString = JSON.stringify(obj);
    return !_.isEqual(obj[nextState.activeGamesInfex], prevObj[nextState.activeGamesInfex]) || activeIdStr.indexOf(`-${gameId}-`) > -1 || prevAtiveIds && prevAtiveIds.indexOf(gameId) > -1 || prevGameIdStr && prevGameIdStr.indexOf(gameId) > -1 || this.state.activeGamesInfex !== nextState.activeGamesInfex
  }

  isActive(selectIds) {
    const selectId = selectIds.length && selectIds.join('-');
    const { activeId } = this.props;
    if (_.indexOf(activeId, selectId) > -1) {
      return true;
    }
    return false;
  }
  render() {
    const { n, onSelected, matchTypeId } = this.props;
    const { iorOuho, iorMh, iorRh, iorMc, iorRc, iorOuh, iorOuc, iorOuhu, iorOuco, iorOucu, gameTypeIndex, activeGamesInfex } = this.state;
    // const homeScore = (parseInt(n.homeScore1st) + parseInt(n.homeScore2nd) + parseInt(n.homeScore3rd) + parseInt(n.homeScore4th) + parseInt(n.homeScore5th));
    // const guestScore = (parseInt(n.guestScore1st) + parseInt(n.guestScore2nd) + parseInt(n.guestScore3rd) + parseInt(n.guestScore4th) + parseInt(n.guestScore5th));
    const totalScore = n.homeScore + n.guestScore;
    const curGameInfo = activeGamesInfex > n['games'].length ? n['games'][0] : n['games'][activeGamesInfex];
    return (
      <View>
        {/* { matchTypeId === 'in_play_now' ?
              <Grid style={{ backgroundColor: '#FFFCE7',marginTop: 5 }}>
                <Row style={{ paddingHorizontal: 10,  flex: 1, height: 35, alignItems: 'center' }}>
                    <Col style={{ flex: 6 }}>
                      <Text>{n.best}|总局数<Text style={{ color: '#FF001F' }}>{n.homeScore}-{n.guestScore} ({totalScore})</Text></Text>
                    </Col>
                    <Col style={{ flex: 1, justifyContent:'center', alignItems: 'center' }}>
                      <Text>分</Text>
                    </Col>
                    <Col style={{ flex: 1, justifyContent:'center', alignItems: 'center' }}>
                      <Text>局</Text>
                    </Col>
                    <Col style={{ flex: 1, justifyContent:'center', alignItems: 'center' }}>
                      <Text>盘</Text>
                    </Col>
                </Row>
                <Row style={{ paddingHorizontal: 10,  flex: 1, height: 35, alignItems: 'center' }}>
                    <Col style={{ flex: 6, flexDirection: 'row', alignItems: 'center' }}>
                      {n.nowServer == 'h' ? <Image source={require('../../../../assets/images/serve_ball.png')} style={{ width: 14, height: 14, resizeMode: 'contain' }}/> : <View style={{ width: 14 }}/>}
                      <Text style={{ marginLeft: 5 }} numberOfLines={1}>{n.homeName}</Text>
                    </Col>
                    <Col style={{ flex: 1, justifyContent:'center', alignItems: 'center' }}>
                      <Text>{n.homePointScore}</Text>
                    </Col>
                    <Col style={{ flex: 1, justifyContent:'center', alignItems: 'center' }}>
                      <Text>{n.homeSetScore}</Text>
                    </Col>
                    <Col style={{ flex: 1, justifyContent:'center', alignItems: 'center' }}>
                      <Text>{n.homeGameScore}</Text>
                    </Col>
                </Row>
                <Row style={{ paddingHorizontal: 10,  flex: 1, height: 35, alignItems: 'center' }}>
                    <Col style={{ flex: 6, flexDirection: 'row', alignItems: 'center' }}>
                      {n.nowServer == 'c' ? <Image source={require('../../../../assets/images/serve_ball.png')} style={{ width: 14, height: 14, resizeMode: 'contain' }}/> : <View style={{ width: 14 }}/>}
                      <Text style={{ marginLeft: 5 }} numberOfLines={1}>{n.guestName}</Text>
                    </Col>
                    <Col style={{ flex: 1, justifyContent:'center', alignItems: 'center' }}>
                      <Text>{n.guestPointScore}</Text>
                    </Col>
                    <Col style={{ flex: 1, justifyContent:'center', alignItems: 'center' }}>
                      <Text>{n.guestSetScore}</Text>
                    </Col>
                    <Col style={{ flex: 1, justifyContent:'center', alignItems: 'center' }}>
                      <Text>{n.guestGameScore}</Text>
                    </Col>
                </Row>
              </Grid>
              : null } */}
        <Grid style={{ paddingRight: 6, marginTop: 10 }}>
          <Row style={{ alignItems: 'center', height: 50 }}>
            <Col size={1} style={{ alignItems: 'center' }}>
              {n.inPlayNow === 'yes' && matchTypeId !== 'in_play_now' ?
                <Icons name="icon-tennis" color="#B4D909" /> : null}
              {matchTypeId === 'in_play_now' ? !n.timer ?
                <Text style={{ color: '#17A84B', fontSize: 12 }}>
                  {n.beginTime ? moment(n.beginTime).format('MM-DD HH:mm').split(' ')[0] : ''}{'\n'}{n.beginTime ? moment(n.beginTime).format('MM-DD HH:mm').split(' ')[1] : ''}
                </Text>
                :
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                  <Text style={{ color: '#666' }}>滚球中</Text>
                  {/* <Text style={{ color: '#17A84B', fontSize: 12 }}>{ n.best }</Text> */}
                </View> :
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                  <Text style={{ color: '#17A84B', fontSize: 12 }}>{n.beginTime ? moment(n.beginTime).format('MM-DD HH:mm').split(' ')[0] : ''}</Text>
                  <Text style={{ color: '#17A84B', fontSize: 12 }}>{n.beginTime ? moment(n.beginTime).format('MM-DD HH:mm').split(' ')[1] : ''}</Text>
                  <Text style={{ color: '#17A84B', fontSize: 12 }}>{n.best}</Text>
                </View>
              }
              {matchTypeId === 'in_play_now' && !isNaN(n.homeScore) && !isNaN(n.guestScore) ? <Text style={{ color: '#17A84B' }}>{`${n.homeScore}-${n.guestScore}`}</Text> : null}
            </Col>
            <Col size={2} style={[styles.alginCenter, { flexDirection: 'row' }]}>
              {matchTypeId === 'in_play_now' && n.homeRed > 0 ?
                <View style={{ backgroundColor: '#FF4D4D', width: 20, height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 2, marginHorizontal: 2 }}>
                  <Text style={{ color: '#fff' }}>{n.homeRed}</Text>
                </View>
                : null}
              <View style={{ alignItems: 'center', flex: 1 }} ><Text numberOfLines={3}>{n.homeName}</Text></View>
            </Col>
            <Col size={1} style={styles.alginCenter}>
              {n.neutral === 'yes' ? <View style={{ backgroundColor: '#3B6EAA', borderRadius: 2, marginBottom: 4, paddingHorizontal: 5, paddingVertical: 2 }}><Text style={{ fontSize: 12, color: '#fff' }}>中</Text></View> : null}
              {n.gameType ? <View style={{ backgroundColor: '#B452C8', borderRadius: 2, paddingHorizontal: 5, paddingVertical: 2 }}><Text style={{ fontSize: 12, color: '#fff', borderRadius: 5 }}>{n.gameType}</Text></View> : null}
            </Col>
            <Col size={2} style={[styles.alginCenter, { flexDirection: 'row', justifyContent: 'flex-end' }]}>
              <View style={{ alignItems: 'center', flex: 1 }} ><Text numberOfLines={3}>{n.guestName}</Text></View>
              {matchTypeId === 'in_play_now' && n.guestRed > 0 ?
                <View style={{ backgroundColor: '#FF4D4D', width: 20, height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 2, marginHorizontal: 2 }}>
                  <Text style={{ color: '#fff' }}>{n.guestRed}</Text>
                </View>
                : null}
            </Col>
            <Col size={1} style={styles.alginCenter}></Col>
          </Row>
          {/*============================== 标题结束 ===========================*/}
          <Row style={{ height: 150 }}>
            <Col size={1}>
              <Row style={[styles.alginCenter, styles.justifyCenter, { flex: 1 }]}><Text style={styles.platyStyleText}>独赢</Text></Row>
              <Row style={[styles.alginCenter, styles.justifyCenter, { flex: 1 }]}><Text style={styles.platyStyleText}>让盘</Text></Row>
              <Row style={[styles.alginCenter, styles.justifyCenter, { flex: 1 }]}><Text style={styles.platyStyleText}>大小</Text></Row>
            </Col>
            <Col size={2.5} style={[styles.bgWhite, { borderLeftColor: '#B6B6B6', borderLeftWidth: StyleSheet.hairlineWidth }]}>
              {
                (() => {
                  const args = (['iorMh', '1x2', curGameInfo.odds['1x2'].iorMh]).concat([curGameInfo.gameId, n.homeName, n.parlayMin || [], n.parlayMax || [], n.scheduleId]);
                  const isActive = this.isActive(args);
                  return (curGameInfo.odds['1x2'].iorMh) ?
                    <Row
                      style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth },
                      isActive ? styles.activeViewClass : null]}
                    >
                      <TouchableOpacity
                        activeOpacity={1} style={[{ flex: 1 }, { justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }]}
                        onPress={() => { // 独赢主赔率
                          onSelected(args);
                        }}
                      >
                        <View>
                          <Text style={isActive ? styles.activeTextClass : null}>
                            {curGameInfo.odds['1x2'].iorMh}
                          </Text>
                        </View>
                        <View style={{ width: 20, alignItems: 'center' }}>
                          {iorMh > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorMh < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                        </View>
                      </TouchableOpacity>
                    </Row>
                    :
                    <Row
                      style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth },
                      isActive ? styles.activeViewClass : null]}
                    >
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#999' }}>/</Text>
                      </View>
                    </Row>
                })()
              }
              {
                (() => {
                  const ratio = curGameInfo.odds.handicap.ratio;
                  const strong = curGameInfo.odds.handicap.strong;
                  const args = ['iorRh', 'handicap', curGameInfo.odds.handicap.iorRh].concat([curGameInfo.gameId, n.homeName, n.parlayMin || [], n.parlayMax || [], n.scheduleId, "ratio", ratio, strong, 'H']);
                  const isActive = this.isActive(args);
                  return (<Row style={[styles.gridRightTopColor]}>
                    {(curGameInfo.odds.handicap.iorRh) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 让球主赔率
                          onSelected(args);
                        }}
                        style={[{ flex: 1 }, { justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' },
                        isActive ? styles.activeViewClass : null]}
                      >
                        <Text>
                          <Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>
                            {curGameInfo.odds.handicap.strong === 'H' ? curGameInfo.odds.handicap.ratio : null}
                          </Text>
                          <Text style={isActive ? styles.activeTextClass : null}>
                            {` ${curGameInfo.odds.handicap.iorRh}`}
                          </Text>
                        </Text>
                        <View style={{ width: 20, alignItems: 'center' }}>
                          {iorRh > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorRh < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                        </View>
                      </TouchableOpacity>
                      :
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#999' }}>/</Text>
                      </View>
                    }
                  </Row>
                  )
                }
                )()
              }
              {
                (() => {
                  const args = ['iorOuc', 'ou', curGameInfo.odds.ou.iorOuc].concat([curGameInfo.gameId, `大`, n.parlayMin || [], n.parlayMax || [], n.scheduleId, "ratioO", (curGameInfo.odds.ou.ratioO)]);
                  const isActive = this.isActive(args);
                  return (<Row style={[styles.gridRightTopColor, { borderBottomColor: '#B6B6B6', borderBottomWidth: StyleSheet.hairlineWidth }]}>
                    {(curGameInfo.odds.ou.iorOuc) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 大小球 -主
                          onSelected(args);
                        }}
                        style={[{ flex: 1 }, { justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' },
                        isActive ? styles.activeViewClass : null]}
                      >
                        <Text>
                          <Text>
                            <Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>大{curGameInfo.odds.ou.ratioO}</Text>
                            <Text style={[isActive ? styles.activeTextClass : null]}>{` ${curGameInfo.odds.ou.iorOuc}`}</Text>
                          </Text>
                        </Text>
                        <View style={{ width: 20, alignItems: 'center' }}>
                          {iorOuc > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorOuc < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                        </View>
                      </TouchableOpacity>
                      :
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#999' }}>/</Text>
                      </View>
                    }
                  </Row>
                  )
                }
                )()
              }

            </Col>
            <Col size={2.5} style={styles.bgWhite}>
              {(() => {
                const args = ['iorMc', '1x2', curGameInfo.odds['1x2'].iorMc].concat([curGameInfo.gameId, n.guestName, n.parlayMin || [], n.parlayMax || [], n.scheduleId]);
                const isActive = this.isActive(args);
                return (<Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                  {curGameInfo.odds['1x2'].iorMc ?
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => { // 独赢 客赔率
                        onSelected(args);
                      }}
                      style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                    >
                      <View>
                        <Text style={isActive ? styles.activeTextClass : null}>{curGameInfo.odds['1x2'].iorMc}</Text>
                      </View>
                      <View style={{ width: 20, alignItems: 'center' }}>
                        {iorMc > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorMc < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                      </View>
                    </TouchableOpacity>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ color: '#999' }}>/</Text>
                    </View>
                  }
                </Row>)
              })()}
              {(() => {
                const ratio = curGameInfo.odds.handicap.ratio;
                const strong = curGameInfo.odds.handicap.strong;
                const args = ['iorRc', 'handicap', curGameInfo.odds.handicap.iorRc].concat([curGameInfo.gameId, n.guestName, n.parlayMin || [], n.parlayMax || [], n.scheduleId, "ratio", ratio, strong, 'C']);
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {(curGameInfo.odds.handicap.iorRc) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 让球 客赔率
                          onSelected(args);
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <Text>
                          <Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>
                            {curGameInfo.odds.handicap.strong === 'C' ? curGameInfo.odds.handicap.ratio : null}
                          </Text>
                          <Text style={[isActive ? styles.activeTextClass : null]}>
                            {` ${curGameInfo.odds.handicap.iorRc}`}
                          </Text>
                        </Text>
                        <View style={{ width: 20, alignItems: 'center' }}>
                          {iorRc > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorRc < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                        </View>
                      </TouchableOpacity>
                      :
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#999' }}>/</Text>
                      </View>
                    }
                  </Row>
                );
              })()}
              {(() => {
                const args = ['iorOuh', 'ou', curGameInfo.odds.ou.iorOuh].concat([curGameInfo.gameId, `小`, n.parlayMin || [], n.parlayMax || [], n.scheduleId, 'ratioU', curGameInfo.odds.ou.ratioU]);
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor, { borderBottomColor: '#B6B6B6', borderBottomWidth: StyleSheet.hairlineWidth }]}>
                    {(curGameInfo.odds.ou.iorOuh) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 大小球 -客
                          onSelected(args);
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <Text>
                          <Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>小{curGameInfo.odds.ou.ratioU}</Text>
                          <Text style={[isActive ? styles.activeTextClass : null]}>{` ${curGameInfo.odds.ou.iorOuh}`}</Text>
                        </Text>
                        <View style={{ width: 20, alignItems: 'center' }}>
                          {iorOuh > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorOuh < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                        </View>
                      </TouchableOpacity>
                      :
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#999' }}>/</Text>
                      </View>
                    }
                  </Row>
                );
              })()}
            </Col>
            <Col size={1} style={[styles.bgWhite, { borderRightColor: '#B6B6B6', borderRightWidth: StyleSheet.hairlineWidth }, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth, backgroundColor: '#EAEAEA' }, { borderBottomColor: '#B6B6B6', borderBottomWidth: StyleSheet.hairlineWidth }]}>
              <ScrollView>
                {(() => {
                  const _index = _.findIndex(n.games, (o) => o.isMaster === 'yes');
                  return (
                    n.games.map((obj, index) =>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 主盘口
                          this.setState({
                            activeGamesInfex: index
                          })
                        }}
                        key={index}
                        style={[{ alignItems: 'center', height: 40, justifyContent: 'center', flexDirection: 'row' }, activeGamesInfex === index ? styles.btnActiveViewClass : null, { borderBottomColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth }]}
                      >
                        <Text style={[activeGamesInfex === index ? styles.activeTextClass : null]}>
                          {_index > -1 ? convertGameIndex(index) : convertGameName(index)}
                        </Text>
                      </TouchableOpacity>
                    )
                  )
                })()}
              </ScrollView>
            </Col>
          </Row>
        </Grid>
      </View>
    );
  }
}
const convertGameName = (index) => {
  switch (index) {
    case 0:
      return '第一盘';
    case 1:
      return '第二盘';
    case 2:
      return '第三盘';
    case 3:
      return '第四盘';
    case 4:
      return '第五盘';
    default:
      return '主盘口';
  }
}
const convertGameIndex = (index) => {
  switch (index) {
    case 0:
      return '主盘口';
    case 1:
      return '第一盘';
    case 2:
      return '第二盘';
    case 3:
      return '第三盘';
    case 4:
      return '第四盘';
    default:
      return '主盘口';
  }
}

const styles = StyleSheet.create({

  alginCenter: {
    alignItems: 'center'
  },
  justifyCenter: {
    justifyContent: 'center'
  },
  platyStyleText: {
    fontSize: 12,
    color: '#999'
  },
  bgWhite: {
    backgroundColor: '#fff'
  },
  gridRightTopColor: {
    borderColor: '#EAEAEA',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderLeftWidth: 0
  },
  fill: {
    paddingRight: 15
  },
  bottomBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#B6B6B6'
  },
  grayColor: {
    color: '#A3A3A3'
  },
  activeViewClass: {
    backgroundColor: '#17A84B'
  },
  activeTextClass: {
    color: '#fff',
  },
  btnActiveViewClass: {
    backgroundColor: '#FF8500'
  },
  btnActiveTextClass: {
    color: '#fff'
  }
});

const mapStateToProps = (state) => {
  return {
    matchEventType: state.match.matchEventType
  };
};

export default connect(mapStateToProps)(TennisMatchGrid);
