// 篮球玩法模板

import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Immutable, { Map, List } from 'immutable';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Icons } from '../../../mesosphere';
const moment = require('moment');

let prevProps = {};
class BasketBallGrid extends Component {
  // 0 表示无变化、1表示上涨、 -1表示下跌
  constructor(props) {
    super(props);
    this.state = {
      half: false,
      matchTypeId: '',
      iorMh: 0, // 独赢主场赔率(全场)
      iorRh: 0, // 让球主场赔率(全场)
      iorMc: 0,   // 独赢客场赔率(全场)
      iorRc: 0,  // 让球客场赔率(全场)
      iorOuc: 0, // 大小主赔率(全场)
      iorEoo: 0,  // 单双(全场)
      iorOuh: 0,  // 大小客(全场)
      iorEoe: 0, // 单双 客赔率 (全场)
      prevProps: props.n
    };
    this.propString = JSON.stringify(props.n);
    this.toggle = this.toggle.bind(this);
    this.isActive = this.isActive.bind(this);

  }
  shouldComponentUpdate(nextProps, nextState) {
    const activeIds = nextProps.activeId;
    const activeIdStr = activeIds.toString();
    const gameId = nextProps.n.games[0].gameId;
    const prevGameId = nextProps.prevGameId.toArray();
    const prevGameIdStr = prevGameId.length && prevGameId.toString();
    const prevActiveId = nextProps.prevActiveId.toArray();
    const prevAtiveIds = prevActiveId.length && prevActiveId.toString();

    const obj = nextProps.n;
    const prevObj = JSON.parse(this.propString);
    this.propString = JSON.stringify(obj);
    return !_.isEqual(obj, prevObj) || activeIdStr.indexOf(`-${gameId}-`) > -1 || (prevAtiveIds && (prevAtiveIds.indexOf(`-${gameId}-`) > -1)) || (prevGameIdStr && (prevGameIdStr.indexOf(`-${gameId}-`) > -1)) || this.state.half !== nextState.half;
  }
  // componentWillReceiveProps(nextProps) {
  //     const obj = nextProps.n.odds;
  //     const prevObj = JSON.parse(this.propString)
  // 独赢主场赔率(全场)
  // if(obj['1x2'] && obj['1x2'].iorMh && prevObj['1x2'] && prevObj['1x2'].iorMh) {
  //    if(parseFloat(obj['1x2'].iorMh) > parseFloat(prevObj['1x2'].iorMh)) {
  //       this.setState({ iorMh: 1 });
  //    } else if(parseFloat(obj['1x2'].iorMh) < parseFloat(prevObj['1x2'].iorMh) ) {
  //       this.setState({ iorMh: -1 });
  //    } else {
  //       this.setState({ iorMh: 0 });
  //    }
  // }
  // 让球主场赔率(全场)
  //   if(obj.handicap && obj.handicap.iorRh && prevObj.handicap && prevObj.handicap.iorRh) {
  //     if(parseFloat(obj.handicap.iorRh) > parseFloat(prevObj.handicap.iorRh)) {
  //        this.setState({ iorRh: 1 });
  //     } else if(parseFloat(obj.handicap.iorRh) < parseFloat(prevObj.handicap.iorRh) ) {
  //        this.setState({ iorRh: -1 });
  //     } else {
  //        this.setState({ iorRh: 0 });
  //     }
  //  }
  // 独赢客场赔率(全场)
  //   if(obj['1x2'] && obj['1x2'].iorMc && prevObj['1x2'] && prevObj['1x2'].iorMc) {
  //     if(parseFloat(obj['1x2'].iorMc) > parseFloat(prevObj['1x2'].iorMc)) {
  //        this.setState({ iorMc: 1 });
  //     } else if(parseFloat(obj['1x2'].iorMc) < parseFloat(prevObj['1x2'].iorMc) ) {
  //        this.setState({ iorMc: -1 });
  //     } else {
  //        this.setState({ iorMc: 0 });
  //     }
  //  }
  // 让球客场赔率(全场)
  //      if(obj.handicap && obj.handicap.iorRc && prevObj.handicap && prevObj.handicap.iorRc) {
  //        if(parseFloat(obj.handicap.iorRc) > parseFloat(prevObj.handicap.iorRc)) {
  //           this.setState({ iorRc: 1 });
  //        } else if(parseFloat(obj.handicap.iorRc) < parseFloat(prevObj.handicap.iorRc) ) {
  //           this.setState({ iorRc: -1 });
  //        } else {
  //           this.setState({ iorRc: 0 });
  //        }
  //     }
  //      // 大小主赔率(全场)
  //      if(obj.ou && obj.ou.iorOuc && prevObj.ou && prevObj.ou.iorOuc) {
  //       if(parseFloat(obj.ou.iorOuc) > parseFloat(prevObj.ou.iorOuc)) {
  //          this.setState({ iorOuc: 1 });
  //       } else if(parseFloat(obj.ou.iorOuc) < parseFloat(prevObj.ou.iorOuc) ) {
  //          this.setState({ iorOuc: -1 });
  //       } else {
  //          this.setState({ iorOuc: 0 });
  //       }
  //    }
  //    // 大小主赔率(全场)
  //    if(obj.ou && obj.ou.iorOuh && prevObj.ou && prevObj.ou.iorOuh) {
  //     if(parseFloat(obj.ou.iorOuh) > parseFloat(prevObj.ou.iorOuh)) {
  //        this.setState({ iorOuh: 1 });
  //     } else if(parseFloat(obj.ou.iorOuh) < parseFloat(prevObj.ou.iorOuh) ) {
  //        this.setState({ iorOuh: -1 });
  //     } else {
  //        this.setState({ iorOuh: 0 });
  //     }
  //  }
  //   // 单双主(全场)
  //   if(obj.oe && obj.oe.iorEoo && prevObj.oe && prevObj.oe.iorEoo) {
  //       if(parseFloat(obj.oe.iorEoo) > parseFloat(prevObj.oe.iorEoo)) {
  //         this.setState({ iorEoo: 1 });
  //       } else if(parseFloat(obj.oe.iorEoo) < parseFloat(prevObj.oe.iorEoo) ) {
  //         this.setState({ iorEoo: -1 });
  //       } else {
  //         this.setState({ iorEoo: 0 });
  //       }
  //   }
  //   // 单双 客(全场)
  //   if(obj.oe && obj.oe.iorEoe && prevObj.oe && prevObj.oe.iorEoe) {
  //         if(parseFloat(obj.oe.iorEoe) > parseFloat(prevObj.oe.iorEoe)) {
  //           this.setState({ iorEoe: 1 });
  //         } else if(parseFloat(obj.oe.iorEoe) < parseFloat(prevObj.oe.iorEoe) ) {
  //           this.setState({ iorEoe: -1 });
  //         } else {
  //           this.setState({ iorEoe: 0 });
  //         }
  //     }
  //     }
  toggle() {
    this.setState({
      half: !this.state.half
    });
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
    const { iorMh, iorHmh, iorRh, iorHrh, iorHmc, iorMc, iorHrc, iorRc, iorHmn, iorMn, iorHouc, iorOuc, iorEoo, iorHouh, iorOuh, iorEoe } = this.state;
    return n.games && n.games.map((gameObj, key) => {
      const oddsObj = gameObj.odds;
      return (
        <Grid key={key} style={{ paddingRight: 6, marginTop: 10 }}>
          <Row style={{ alignItems: 'center', height: 50 }}>
            <Col size={1} style={{ alignItems: 'center' }}>
              {n.inPlayNow === 'yes' && matchTypeId !== 'in_play_now' ? <Icons name="icon-aliance" color="#AB300B" /> : null}
              {matchTypeId === 'in_play_now' && !isNaN(n.homeScore) && !isNaN(n.guestScore) ? <Text style={{ color: '#17A84B' }}>{`${n.homeScore}-${n.guestScore}`}</Text> : null}
              {matchTypeId === 'in_play_now' ? !n.timer ?
                <Text style={{ color: '#17A84B', fontSize: 12 }}>
                  {n.quarter}{'\n'}{n.beginTime ? moment(n.beginTime).format('MM-DD HH:mm').split(' ')[1] : ''}
                </Text> :
                <View style={{ alignItems: 'center' }} >
                  {n.timer.split(' ')[0] ? <Text style={{ color: '#17A84B' }}>{n.timer.split(' ')[0]}</Text> : null}
                  {n.timer.split(' ')[1] ? <Text style={{ color: '#17A84B' }}>{n.timer.split(' ')[1]}</Text> : null}
                  {n.quarter ? <Text style={{ color: '#17A84B' }}>{n.quarter}</Text> : null}
                </View> : <Text style={{ color: '#17A84B', fontSize: 12 }}>{n.beginTime ? moment(n.beginTime).format('MM-DD HH:mm').split(' ')[0] : ''}{'\n'}{n.beginTime ? moment(n.beginTime).format('MM-DD HH:mm').split(' ')[1] : ''}</Text>
              }
            </Col>
            <Col size={2} style={[styles.alginCenter, { flexDirection: 'row' }]}>
              {matchTypeId === 'in_play_now' && n.homeRed > 0 ?
                <View style={{ backgroundColor: '#FF4D4D', width: 20, height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 2, marginHorizontal: 2 }}>
                  <Text style={{ color: '#fff' }}>{n.homeRed}</Text>
                </View>
                : null}
              <View style={{ alignItems: 'center', flex: 1 }} ><Text>{n.homeName}</Text></View>
            </Col>
            <Col size={1} style={styles.alginCenter}>
              {n.neutral === 'yes' ? <View style={{ backgroundColor: '#3B6EAA', borderRadius: 2, marginBottom: 4, paddingHorizontal: 5, paddingVertical: 2 }}><Text style={{ fontSize: 12, color: '#fff' }}>中</Text></View> : null}
              {gameObj.gameType ? <View style={{ backgroundColor: '#B452C8', borderRadius: 2, paddingHorizontal: 5, paddingVertical: 2 }}><Text style={{ fontSize: 12, color: '#fff', borderRadius: 5 }}>{gameObj.gameType}</Text></View> : null}
            </Col>
            <Col size={2} style={[styles.alginCenter, { flexDirection: 'row', justifyContent: 'flex-end' }]}>
              <View style={{ alignItems: 'center', flex: 1 }} ><Text>{n.guestName}</Text></View>
              {matchTypeId === 'in_play_now' && n.guestRed > 0 ?
                <View style={{ backgroundColor: '#FF4D4D', width: 20, height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 2, marginHorizontal: 2 }}>
                  <Text style={{ color: '#fff' }}>{n.guestRed}</Text>
                </View>
                : null}
            </Col>
          </Row>
          <Row style={{ height: 80 }}>
            <Col size={1}>
              <Row style={[styles.alginCenter, styles.justifyCenter]}><Text style={styles.platyStyleText}>独赢</Text></Row>
              <Row style={[styles.alginCenter, styles.justifyCenter]}><Text style={styles.platyStyleText}>让球</Text></Row>
            </Col>
            <Col size={2.5} style={[styles.bgWhite, { borderLeftColor: '#B6B6B6', borderLeftWidth: StyleSheet.hairlineWidth }]}>
              {
                (() => {
                  const args = ['iorMh', '1x2', oddsObj['1x2'].iorMh].concat([n.games[0].gameId, n.homeName, n.parlayMin || [], n.parlayMax || [], n.scheduleId]);
                  const isActive = this.isActive(args);
                  return oddsObj['1x2'].iorMh ?
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
                            {oddsObj['1x2'].iorMh}
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
                  const ratio = oddsObj.handicap.ratio;
                  const strong = oddsObj.handicap.strong;
                  const args = ['iorRh', 'handicap', oddsObj.handicap.iorRh].concat([n.games[0].gameId, n.homeName, n.parlayMin || [], n.parlayMax || [], n.scheduleId, 'ratio', ratio, strong, 'H']);
                  const isActive = this.isActive(args);
                  return (<Row style={[styles.gridRightTopColor]}>
                    {oddsObj.handicap.iorRh ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 让球主赔率
                          onSelected(args);
                        }}
                        style={[{ flex: 1 }, { justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' },
                        isActive ? styles.activeViewClass : null]}
                      >
                        <View>
                          <Text style={isActive ? styles.activeTextClass : null}>
                            <Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>
                              {oddsObj.handicap.strong === 'H' ? oddsObj.handicap.ratio : null}
                            </Text> {oddsObj.handicap.iorRh}
                          </Text>
                        </View>
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
            </Col>
            <Col size={2.5} style={[styles.bgWhite, { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: '#B6B6B6' }]}>
              {(() => {
                const args = ['iorMc', '1x2', oddsObj['1x2'].iorMc].concat([n.games[0].gameId, n.guestName, n.parlayMin || [], n.parlayMax || [], n.scheduleId]);
                const isActive = this.isActive(args);
                return (<Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                  {oddsObj['1x2'].iorMc ?
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => { // 独赢 客赔率
                        onSelected(args);
                      }}
                      style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                    >
                      <View>
                        <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1x2'].iorMc}</Text>
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
                const ratio = oddsObj.handicap.ratio;
                const strong = oddsObj.handicap.strong;
                const args = ['iorRc', 'handicap', oddsObj.handicap.iorRc].concat([n.games[0].gameId, n.guestName, n.parlayMin || [], n.parlayMax || [], n.scheduleId, 'ratio', ratio, strong, 'C']);
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {oddsObj.handicap.iorRc ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 让球 客赔率
                          onSelected(args);
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <View>
                          <Text style={isActive ? styles.activeTextClass : null}>
                            <Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>
                              {oddsObj.handicap.strong === 'C' ? oddsObj.handicap.ratio : null}
                            </Text> {oddsObj.handicap.iorRc}</Text>
                        </View>
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
            </Col>
          </Row>

          <Row style={{ height: 40 }}>
            <Col size={1}>
              <Row style={[styles.alginCenter, styles.justifyCenter]}><Text style={styles.platyStyleText}>大小</Text></Row>
            </Col>
            <Col size={2.5} style={[styles.bgWhite, { borderLeftColor: '#B6B6B6', borderLeftWidth: StyleSheet.hairlineWidth, borderBottomColor: '#EAEAEA', borderBottomWidth: StyleSheet.hairlineWidth }]}>
              {(() => {
                const args = ['iorOuc', 'ou', oddsObj.ou.iorOuc].concat([n.games[0].gameId, `大`, n.parlayMin || [], n.parlayMax || [], n.scheduleId, 'ratioO', oddsObj.ou.ratioO]);
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {oddsObj.ou.iorOuc ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 大小球 主赔率
                          onSelected(args);
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <Text style={isActive ? styles.activeTextClass : null}>
                          {<Text><Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>大{oddsObj.ou.ratioO}</Text> {oddsObj.ou.iorOuc}</Text>}
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
                );
              })()}
            </Col>
            <Col size={2.5} style={[styles.bgWhite, { borderBottomColor: '#EAEAEA', borderBottomWidth: StyleSheet.hairlineWidth, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: '#B6B6B6' }]}>
              {(() => {
                const args = ['iorOuh', 'ou', oddsObj.ou.iorOuh].concat([n.games[0].gameId, `小`, n.parlayMin || [], n.parlayMax || [], n.scheduleId, 'ratioU', oddsObj.ou.ratioU]);
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {oddsObj.ou.iorOuh ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 大小 客赔率
                          onSelected(args);
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <Text style={isActive ? styles.activeTextClass : null}>
                          {<Text><Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>小{oddsObj.ou.ratioU}</Text> {oddsObj.ou.iorOuh}</Text>}
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
          </Row>

          <Row style={{ height: 80 }}>
            <Col size={1}>
              <Row style={[styles.alginCenter, styles.justifyCenter, { flex: 2 }]}><Text style={{ color: '#81907E' }}>球队{'\n'}得分{'\n'}大小</Text></Row>
            </Col>
            <Col size={2.5} style={[styles.bgWhite, { borderLeftColor: '#B6B6B6', borderLeftWidth: StyleSheet.hairlineWidth, borderBottomColor: '#B6B6B6', borderBottomWidth: StyleSheet.hairlineWidth }]}>
              {(() => {
                const args = ['iorOuho', 'ouTeam', oddsObj.ouTeam.iorOuho].concat([n.games[0].gameId, `大`, n.parlayMin || [], n.parlayMax || [], n.scheduleId, 'ratioOuho', oddsObj.ouTeam.ratioOuho]);
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {oddsObj.ouTeam.iorOuho ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 球队得分大小(主大)
                          onSelected(args);
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <Text style={isActive ? styles.activeTextClass : null}>
                          {<Text><Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>大{oddsObj.ouTeam.ratioOuho}</Text> {oddsObj.ouTeam.iorOuho}</Text>}
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
              {(() => {
                const args = ['iorOuhu', 'ouTeam', oddsObj.ouTeam.iorOuhu].concat([n.games[0].gameId, `小`, n.parlayMin || [], n.parlayMax || [], n.scheduleId, 'ratioOuhu', oddsObj.ouTeam.ratioOuhu]);
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {oddsObj.ouTeam.iorOuhu ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 球队得分大小(主小)
                          onSelected(args);
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <Text style={isActive ? styles.activeTextClass : null}>
                          {<Text><Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>小{oddsObj.ouTeam.ratioOuhu}</Text> {oddsObj.ouTeam.iorOuhu}</Text>}
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
            <Col size={2.5} style={[styles.bgWhite, { borderBottomColor: '#B6B6B6', borderBottomWidth: StyleSheet.hairlineWidth, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: '#B6B6B6' }]}>
              {(() => {
                const args = ['iorOuco', 'ouTeam', oddsObj.ouTeam.iorOuco].concat([n.games[0].gameId, `大`, n.parlayMin || [], n.parlayMax || [], n.scheduleId, 'ratioOuco', oddsObj.ouTeam.ratioOuco]);
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {oddsObj.ouTeam.iorOuco ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 球队得分大小(客大)
                          onSelected(args);
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <Text style={isActive ? styles.activeTextClass : null}>
                          {<Text><Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>大{oddsObj.ouTeam.ratioOuco}</Text> {oddsObj.ouTeam.iorOuco}</Text>}
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
              {(() => {
                const args = ['iorOucu', 'ouTeam', oddsObj.ouTeam.iorOucu].concat([n.games[0].gameId, `小`, n.parlayMin || [], n.parlayMax || [], n.scheduleId, 'ratioOucu', oddsObj.ouTeam.ratioOucu]);
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {oddsObj.ouTeam.iorOucu ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 球队得分大小(客小)
                          onSelected(args);
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <Text style={isActive ? styles.activeTextClass : null}>
                          {<Text><Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>小{oddsObj.ouTeam.ratioOucu}</Text> {oddsObj.ouTeam.iorOucu}</Text>}
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
          </Row>
        </Grid>
      );
    }) || null
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
    borderRightWidth: 1,
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
  }
});

const mapStateToProps = (state) => {
  return {
    matchEventType: state.match.matchEventType
  };
};

export default connect(mapStateToProps)(BasketBallGrid);
