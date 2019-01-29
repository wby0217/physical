// 独赢、大小、单双 表格模块

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
import { Icons, noOpenHandler } from '../../../mesosphere';
const moment = require('moment');

class MatchGrid extends Component {
  // 0 表示无变化、1表示上涨、 -1表示下跌
  constructor(props) {
    super(props);
    this.state = {
      half: false,
      matchTypeId: '',
      iorMh: 0, // 独赢主场赔率(全场)
      iorHmh: 0, // 独赢主场赔率(半场)
      iorRh: 0, // 让球主场赔率(全场)
      iorHrh: 0, // 让球主场赔率(半场)
      iorHmc: 0,  // 独赢客场赔率(半场)
      iorMc: 0,   // 独赢客场赔率(全场)
      iorHrc: 0,  // 让球客场赔率(半场)
      iorRc: 0,  // 让球客场赔率(全场)
      iorHmn: 0, //  独赢和局(半场)
      iorMn: 0, // 独赢和局(全场)
      iorHouc: 0, //  大小主赔率(半场)
      iorOuc: 0, // 大小主赔率(全场)
      iorEoo: 0,  // 单双(全场)
      iorHouh: 0,  // 大小 客(半场)
      iorOuh: 0,  // 大小客(全场)
      iorEoe: 0, // 单双 客赔率 (全场)
      prevProps: props.n,
      activeGamesInfex: 0,
    };
    // this.propString = JSON.stringify(props.gameObj['odds']);
    this.toggle = this.toggle.bind(this);
    this.isActive = this.isActive.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextGamesIndex = nextState.activeGamesInfex;
    const games = nextProps.n.games;
    const gameId = games[nextGamesIndex] ? games[nextGamesIndex].gameId : '';
    const newActiveId = nextProps.activeId.toString();
    const preActiveId = nextProps.prevGameId.toArray().toString();
    const lastActiveId = nextProps.prevActiveId.toArray().toString();
    return (
      !_.isEqual(this.props.n, nextProps.n) ||
      this.state.activeGamesInfex !== nextGamesIndex ||
      this.state.isShowAll !== nextState.isShowAll ||
      this.state.half !== nextState.half ||
      (preActiveId && preActiveId.indexOf(`-${gameId}-`) > -1) ||
      newActiveId.indexOf(`-${gameId}-`) > -1 ||
      (lastActiveId && lastActiveId.indexOf(`-${gameId}-`) > -1)
    );
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const activeIds = nextProps.activeId;
  //   const activeIdStr = activeIds.toString();
  //   const gameId = nextProps.gameObj.gameId;
  //   const prevGameId = nextProps.prevGameId.toArray();
  //   const prevGameIdStr = prevGameId.length && prevGameId.toString();
  //   const prevActiveId = nextProps.prevActiveId.toArray();
  //   const prevAtiveIds = prevActiveId.length && prevActiveId.toString();

  //   const obj = nextProps.gameObj['odds'];
  //   const prevObj = JSON.parse(this.propString);
  //   this.propString = JSON.stringify(obj);
  //   return !_.isEqual(obj, prevObj) || activeIdStr.indexOf(`-${gameId}-`) > -1 || (prevAtiveIds && (prevAtiveIds.indexOf(`-${gameId}-`) > -1)) || (prevGameIdStr && (prevGameIdStr.indexOf(`-${gameId}-`) > -1)) || this.state.half !== nextState.half;
  // }
  // componentWillReceiveProps(nextProps) {
  //     const obj = nextProps.gameObj['odds'];
  //     const prevObj = JSON.parse(this.propString)
  //     // 独赢主场赔率(全场)
  //     if (obj.ft1x2 && obj.ft1x2.iorMh && prevObj.ft1x2 && prevObj.ft1x2.iorMh) {
  //       if (parseFloat(obj.ft1x2.iorMh) > parseFloat(prevObj.ft1x2.iorMh)) {
  //         this.setState({ iorMh: 1 });
  //       } else if (parseFloat(obj.ft1x2.iorMh) < parseFloat(prevObj.ft1x2.iorMh)) {
  //         this.setState({ iorMh: -1 });
  //       } else {
  //         this.setState({ iorMh: 0 });
  //       }
  //     }
  //     // 独赢主场赔率(半场)
  //     if (obj['1h1x2'] && obj['1h1x2'].iorHmh && prevObj['1h1x2'] && prevObj['1h1x2'].iorHmh) {
  //       if (parseFloat(obj['1h1x2'].iorHmh) > parseFloat(prevObj['1h1x2'].iorHmh)) {
  //         this.setState({ iorHmh: 1 });
  //       } else if (parseFloat(obj['1h1x2'].iorHmh) < parseFloat(prevObj['1h1x2'].iorHmh)) {
  //         this.setState({ iorHmh: -1 });
  //       } else {
  //         this.setState({ iorHmh: 0 });
  //       }
  //     }
  //     // 让球主场赔率(全场)
  //     if (obj.ftHandicap && obj.ftHandicap.iorRh && prevObj.ftHandicap && prevObj.ftHandicap.iorRh) {
  //       if (parseFloat(obj.ftHandicap.iorRh) > parseFloat(prevObj.ftHandicap.iorRh)) {
  //         this.setState({ iorRh: 1 });
  //       } else if (parseFloat(obj.ftHandicap.iorRh) < parseFloat(prevObj.ftHandicap.iorRh)) {
  //         this.setState({ iorRh: -1 });
  //       } else {
  //         this.setState({ iorRh: 0 });
  //       }
  //     }
  //     // 让球主场赔率(半场)
  //     if (obj['1hHandicap'] && obj['1hHandicap'].iorHrh && prevObj['1hHandicap'] && prevObj['1hHandicap'].iorHrh) {
  //       if (parseFloat(obj['1hHandicap'].iorHrh) > parseFloat(prevObj['1hHandicap'].iorHrh)) {
  //         this.setState({ iorHrh: 1 });
  //       } else if (parseFloat(obj['1hHandicap'].iorHrh) < parseFloat(prevObj['1hHandicap'].iorHrh)) {
  //         this.setState({ iorHrh: -1 });
  //       } else {
  //         this.setState({ iorHrh: 0 });
  //       }
  //     }
  //     // 独赢客场赔率(全场)
  //     if (obj.ft1x2 && obj.ft1x2.iorMc && prevObj.ft1x2 && prevObj.ft1x2.iorMc) {
  //       if (parseFloat(obj.ft1x2.iorMc) > parseFloat(prevObj.ft1x2.iorMc)) {
  //         this.setState({ iorMc: 1 });
  //       } else if (parseFloat(obj.ft1x2.iorMc) < parseFloat(prevObj.ft1x2.iorMc)) {
  //         this.setState({ iorMc: -1 });
  //       } else {
  //         this.setState({ iorMc: 0 });
  //       }
  //     }
  //     // 独赢客场赔率(半场)
  //     if (obj['1h1x2'] && obj['1h1x2'].iorHmc && prevObj['1h1x2'] && prevObj['1h1x2'].iorHmc) {
  //       if (parseFloat(obj['1h1x2'].iorHmc) > parseFloat(prevObj['1h1x2'].iorHmc)) {
  //         this.setState({ iorHmc: 1 });
  //       } else if (parseFloat(obj['1h1x2'].iorHmc) < parseFloat(prevObj['1h1x2'].iorHmc)) {
  //         this.setState({ iorHmc: -1 });
  //       } else {
  //         this.setState({ iorHmc: 0 });
  //       }
  //     }
  //     // 让球客场赔率(全场)
  //     if (obj.ftHandicap && obj.ftHandicap.iorRc && prevObj.ftHandicap && prevObj.ftHandicap.iorRc) {
  //       if (parseFloat(obj.ftHandicap.iorRc) > parseFloat(prevObj.ftHandicap.iorRc)) {
  //         this.setState({ iorRc: 1 });
  //       } else if (parseFloat(obj.ftHandicap.iorRc) < parseFloat(prevObj.ftHandicap.iorRc)) {
  //         this.setState({ iorRc: -1 });
  //       } else {
  //         this.setState({ iorRc: 0 });
  //       }
  //     }
  //     // 让球客场赔率(半场)
  //     if (obj['1hHandicap'] && obj['1hHandicap'].iorHrc && prevObj['1hHandicap'] && prevObj['1hHandicap'].iorHrc) {
  //       if (parseFloat(obj['1hHandicap'].iorHrc) > parseFloat(prevObj['1hHandicap'].iorHrc)) {
  //         this.setState({ iorHrc: 1 });
  //       } else if (parseFloat(obj['1hHandicap'].iorHrc) < parseFloat(prevObj['1hHandicap'].iorHrc)) {
  //         this.setState({ iorHrc: -1 });
  //       } else {
  //         this.setState({ iorHrc: 0 });
  //       }
  //     }
  //     // 独赢和局(全场)
  //     if (obj.ft1x2 && obj.ft1x2.iorMn && prevObj.ft1x2 && prevObj.ft1x2.iorMn) {
  //       if (parseFloat(obj.ft1x2.iorMn) > parseFloat(prevObj.ft1x2.iorMn)) {
  //         this.setState({ iorMn: 1 });
  //       } else if (parseFloat(obj.ft1x2.iorMn) < parseFloat(prevObj.ft1x2.iorMn)) {
  //         this.setState({ iorMn: -1 });
  //       } else {
  //         this.setState({ iorMn: 0 });
  //       }
  //     }
  //     // 独赢和局(半场)
  //     if (obj['1h1x2'] && obj['1h1x2'].iorHmn && prevObj['1h1x2'] && prevObj['1h1x2'].iorHmn) {
  //       if (parseFloat(obj['1h1x2'].iorHmn) > parseFloat(prevObj['1h1x2'].iorHmn)) {
  //         this.setState({ iorHmn: 1 });
  //       } else if (parseFloat(obj['1h1x2'].iorHmn) < parseFloat(prevObj['1h1x2'].iorHmn)) {
  //         this.setState({ iorHmn: -1 });
  //       } else {
  //         this.setState({ iorHmn: 0 });
  //       }
  //     }
  //     // 大小主赔率(全场)
  //     if (obj.ftOu && obj.ftOu.iorOuc && prevObj.ftOu && prevObj.ftOu.iorOuc) {
  //       if (parseFloat(obj.ftOu.iorOuc) > parseFloat(prevObj.ftOu.iorOuc)) {
  //         this.setState({ iorOuc: 1 });
  //       } else if (parseFloat(obj.ftOu.iorOuc) < parseFloat(prevObj.ftOu.iorOuc)) {
  //         this.setState({ iorOuc: -1 });
  //       } else {
  //         this.setState({ iorOuc: 0 });
  //       }
  //     }
  //     // 大小主赔率(半场)
  //     if (obj['1hOu'] && obj['1hOu'].iorHouc && prevObj['1hOu'] && prevObj['1hOu'].iorHouc) {
  //       if (parseFloat(obj['1hOu'].iorHouc) > parseFloat(prevObj['1hOu'].iorHouc)) {
  //         this.setState({ iorHouc: 1 });
  //       } else if (parseFloat(obj['1hOu'].iorHouc) < parseFloat(prevObj['1hOu'].iorHouc)) {
  //         this.setState({ iorHouc: -1 });
  //       } else {
  //         this.setState({ iorHouc: 0 });
  //       }
  //     }
  //     // 大小客赔率(全场)
  //     if (obj.ftOu && obj.ftOu.iorOuh && prevObj.ftOu && prevObj.ftOu.iorOuh) {
  //       if (parseFloat(obj.ftOu.iorOuh) > parseFloat(prevObj.ftOu.iorOuh)) {
  //         this.setState({ iorOuh: 1 });
  //       } else if (parseFloat(obj.ftOu.iorOuh) < parseFloat(prevObj.ftOu.iorOuh)) {
  //         this.setState({ iorOuh: -1 });
  //       } else {
  //         this.setState({ iorOuh: 0 });
  //       }
  //     }
  //     // 大小主赔率(半场)
  //     if (obj['1hOu'] && obj['1hOu'].iorOuh && prevObj['1hOu'] && prevObj['1hOu'].iorOuh) {
  //       if (parseFloat(obj['1hOu'].iorOuh) > parseFloat(prevObj['1hOu'].iorOuh)) {
  //         this.setState({ iorOuh: 1 });
  //       } else if (parseFloat(obj['1hOu'].iorOuh) < parseFloat(prevObj['1hOu'].iorOuh)) {
  //         this.setState({ iorOuh: -1 });
  //       } else {
  //         this.setState({ iorOuh: 0 });
  //       }
  //     }
  //     // 单双主(全场)
  //     if (obj.ftOe && obj.ftOe.iorEoo && prevObj.ftOe && prevObj.ftOe.iorEoo) {
  //       if (parseFloat(obj.ftOe.iorEoo) > parseFloat(prevObj.ftOe.iorEoo)) {
  //         this.setState({ iorEoo: 1 });
  //       } else if (parseFloat(obj.ftOe.iorEoo) < parseFloat(prevObj.ftOe.iorEoo)) {
  //         this.setState({ iorEoo: -1 });
  //       } else {
  //         this.setState({ iorEoo: 0 });
  //       }
  //     }
  //     // 单双 客(全场)
  //     if (obj.ftOe && obj.ftOe.iorEoe && prevObj.ftOe && prevObj.ftOe.iorEoe) {
  //       if (parseFloat(obj.ftOe.iorEoe) > parseFloat(prevObj.ftOe.iorEoe)) {
  //         this.setState({ iorEoe: 1 });
  //       } else if (parseFloat(obj.ftOe.iorEoe) < parseFloat(prevObj.ftOe.iorEoe)) {
  //         this.setState({ iorEoe: -1 });
  //       } else {
  //         this.setState({ iorEoe: 0 });
  //       }
  //     }
  //   }  
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

  onTouchOdds = ({ index, args }) => {
    const { onSelected } = this.props;
    this.setState({ activeGamesInfex: index });
    onSelected && onSelected(args);
  }

  render() {
    const { n, matchTypeId } = this.props;
    const { iorMh, iorHmh, iorRh, iorHrh, iorHmc, iorMc, iorHrc, iorRc, iorHmn, iorMn, iorHouc, iorOuc, iorEoo, iorHouh, iorOuh, iorEoe } = this.state;
    const onSelected = this.onTouchOdds;
    return n.games && n.games.map((gameObj, key) => {
      const oddsObj = gameObj.odds;
      return (
        <Grid key={key} style={{ paddingRight: 6, marginTop: 10 }}>
          <Row style={{ alignItems: 'center', height: 50 }}>
            <Col size={1} style={{ alignItems: 'center' }}>
              {n.inPlayNow === 'yes' && matchTypeId !== 'in_play_now' ? <Icons name="icon-football" color="#17A84B" /> : null}
              {matchTypeId === 'in_play_now' ? !n.beginTime ? <Text style={{ color: '#17A84B', fontSize: 12 }}>{n.beginTime ? moment(n.beginTime).format('MM-DD HH:mm').split(' ')[0] : ''}{'\n'}{n.beginTime ? moment(n.beginTime).format('MM-DD HH:mm').split(' ')[1] : ''}</Text> :
                <View style={{ alignItems: 'center' }} >
                  {n.timer.split(' ')[0] ? <Text style={{ color: '#17A84B' }}>{n.timer.split(' ')[0]}</Text> : null}
                  {n.timer.split(' ')[1] ? <Text style={{ color: '#17A84B' }}>{n.timer.split(' ')[1]}</Text> : null}
                </View> : <Text style={{ color: '#17A84B', fontSize: 12 }}>{n.beginTime ? moment(n.beginTime).format('MM-DD HH:mm').split(' ')[0] : ''}{'\n'}{n.beginTime ? moment(n.beginTime).format('MM-DD HH:mm').split(' ')[1] : ''}</Text>
              }
              {matchTypeId === 'in_play_now' && !isNaN(n.homeScore) && !isNaN(n.guestScore) ? <Text style={{ color: '#17A84B' }}>{`${n.homeScore}-${n.guestScore}`}</Text> : null}
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
              {n.gameType ? <View style={{ backgroundColor: '#B452C8', borderRadius: 2, padding: 2 }}><Text style={{ fontSize: 11, color: '#fff', borderRadius: 5 }}>{n.gameType}</Text></View> : null}
            </Col>
            <Col size={2} style={[styles.alginCenter, { flexDirection: 'row', justifyContent: 'flex-end' }]}>
              <View style={{ alignItems: 'center', flex: 1 }} ><Text>{n.guestName}</Text></View>
              {matchTypeId === 'in_play_now' && n.guestRed > 0 ?
                <View style={{ backgroundColor: '#FF4D4D', width: 20, height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 2, marginHorizontal: 2 }}>
                  <Text style={{ color: '#fff' }}>{n.guestRed}</Text>
                </View>
                : null}
            </Col>
            <Col size={1} style={styles.alginCenter}><Text>和局</Text></Col>
          </Row>
          <Row style={{ height: 80 }}>
            <Col size={1}>
              <Row style={[styles.alginCenter, styles.justifyCenter]}><Text style={styles.platyStyleText}>独赢</Text></Row>
              <Row style={[styles.alginCenter, styles.justifyCenter]}><Text style={styles.platyStyleText}>让球</Text></Row>
            </Col>
            <Col size={2.5} style={[styles.bgWhite, { borderLeftColor: '#B6B6B6', borderLeftWidth: StyleSheet.hairlineWidth }]}>
              {
                (() => {
                  const args = (this.state.half ? ['iorHmh', '1h1x2', oddsObj['1h1x2'].iorHmh] : ['iorMh', 'ft1x2', oddsObj.ft1x2.iorMh]).concat([gameObj.gameId, n.homeName, n.parlayMin || [], n.parlayMax || [], n.scheduleId]);
                  const isActive = this.isActive(args);
                  return (this.state.half ? oddsObj['1h1x2'].iorHmh : oddsObj.ft1x2.iorMh) ?
                    <Row
                      style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth },
                      isActive ? styles.activeViewClass : null]}
                    >
                      <TouchableOpacity
                        activeOpacity={1} style={[{ flex: 1 }, { justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }]}
                        onPress={() => { // 独赢主赔率
                          onSelected({ args, index: key });
                        }}
                      >
                        <View>
                          <Text style={isActive ? styles.activeTextClass : null}>
                            {this.state.half ? oddsObj['1h1x2'].iorHmh : oddsObj.ft1x2.iorMh}
                          </Text>
                        </View>
                        {
                          this.state.half ?
                            <View style={{ width: 20, alignItems: 'center' }}>
                              {iorHmh > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorHmh < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                            </View>
                            :
                            <View style={{ width: 20, alignItems: 'center' }}>
                              {iorMh > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorMh < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                            </View>
                        }
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
                  const ratio = this.state.half ? oddsObj['1hHandicap'].hratio : oddsObj.ftHandicap.ratio;
                  const strong = this.state.half ? oddsObj['1hHandicap'].hstrong : oddsObj.ftHandicap.strong;
                  const args = (this.state.half ? ['iorHrh', '1hHandicap', oddsObj['1hHandicap'].iorHrh] : ['iorRh', 'ftHandicap', oddsObj.ftHandicap.iorRh]).concat([gameObj.gameId, n.homeName, n.parlayMin || [], n.parlayMax || [], n.scheduleId, this.state.half ? "hratio" : "ratio", ratio, strong, 'H']);
                  const isActive = this.isActive(args);
                  return (<Row style={[styles.gridRightTopColor]}>
                    {(this.state.half ? oddsObj['1hHandicap'].iorHrh : oddsObj.ftHandicap.iorRh) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 让球主赔率
                          onSelected({ args, index: key });
                        }}
                        style={[{ flex: 1 }, { justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' },
                        isActive ? styles.activeViewClass : null]}
                      >
                        <Text>
                          <Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>
                            {this.state.half ? (oddsObj['1hHandicap'].hstrong === 'H' ? oddsObj['1hHandicap'].hratio : null) : (oddsObj.ftHandicap.strong === 'H' ? oddsObj.ftHandicap.ratio : null)}
                          </Text>
                          <Text style={isActive ? styles.activeTextClass : null}>
                            {` ${this.state.half ? oddsObj['1hHandicap'].iorHrh : oddsObj.ftHandicap.iorRh}`}
                          </Text>
                        </Text>
                        {
                          this.state.half ?
                            <View style={{ width: 20, alignItems: 'center' }}>
                              {iorHrh > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorHrh < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                            </View>
                            :
                            <View style={{ width: 20, alignItems: 'center' }}>
                              {iorRh > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorRh < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                            </View>
                        }
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
                const args = (this.state.half ? ['iorHmc', '1h1x2', oddsObj['1h1x2'].iorHmc] : ['iorMc', 'ft1x2', oddsObj.ft1x2.iorMc]).concat([gameObj.gameId, n.guestName, n.parlayMin || [], n.parlayMax || [], n.scheduleId]);
                const isActive = this.isActive(args);
                return (<Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                  {(this.state.half ? oddsObj['1h1x2'].iorHmc : oddsObj.ft1x2.iorMc) ?
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => { // 独赢 客赔率
                        onSelected({ args, index: key });
                      }}
                      style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                    >
                      <View>
                        <Text style={isActive ? styles.activeTextClass : null}>{this.state.half ? oddsObj['1h1x2'].iorHmc : oddsObj.ft1x2.iorMc}</Text>
                      </View>
                      {
                        this.state.half ?
                          <View style={{ width: 20, alignItems: 'center' }}>
                            {iorHmc > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorHmc < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                          </View>
                          :
                          <View style={{ width: 20, alignItems: 'center' }}>
                            {iorMc > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorMc < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                          </View>
                      }
                    </TouchableOpacity>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ color: '#999' }}>/</Text>
                    </View>
                  }
                </Row>)
              })()}
              {(() => {
                const ratio = this.state.half ? oddsObj['1hHandicap'].hratio : oddsObj.ftHandicap.ratio;
                const strong = this.state.half ? oddsObj['1hHandicap'].hstrong : oddsObj.ftHandicap.strong;
                const args = (this.state.half ? ['iorHrc', '1hHandicap', oddsObj['1hHandicap'].iorHrc] : ['iorRc', 'ftHandicap', oddsObj.ftHandicap.iorRc]).concat([gameObj.gameId, n.guestName, n.parlayMin || [], n.parlayMax || [], n.scheduleId, this.state.half ? "hratio" : "ratio", ratio, strong, 'C']);
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {(this.state.half ? oddsObj['1hHandicap'].iorHrc : oddsObj.ftHandicap.iorRc) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 让球 客赔率
                          onSelected({ args, index: key });
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <Text>
                          <Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>
                            {this.state.half ? (oddsObj['1hHandicap'].hstrong === 'C' ? oddsObj['1hHandicap'].hratio : null) : (oddsObj.ftHandicap.strong === 'C' ? oddsObj.ftHandicap.ratio : null)}
                          </Text>
                          <Text style={[isActive ? styles.activeTextClass : null]}>
                            {` ${this.state.half ? oddsObj['1hHandicap'].iorHrc : oddsObj.ftHandicap.iorRc}`}
                          </Text>
                        </Text>
                        {
                          this.state.half ?
                            <View style={{ width: 20, alignItems: 'center' }}>
                              {iorHrc > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorHrc < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                            </View>
                            :
                            <View style={{ width: 20, alignItems: 'center' }}>
                              {iorRc > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorRc < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                            </View>
                        }
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
            <Col size={1} style={[styles.bgWhite, { borderRightColor: '#B6B6B6', borderRightWidth: StyleSheet.hairlineWidth }]}>
              {(() => {
                const args = (this.state.half ? ['iorHmn', '1h1x2', oddsObj['1h1x2'].iorHmn] : ['iorMn', 'ft1x2', oddsObj.ft1x2.iorMn]).concat([gameObj.gameId, '和局', n.parlayMin || [], n.parlayMax || [], n.scheduleId]);
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                    {(this.state.half ? oddsObj['1h1x2'].iorHmn : oddsObj.ft1x2.iorMn) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 独赢 和局赔率
                          onSelected({ args, index: key });
                        }}
                        style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <View>
                          <Text style={isActive ? styles.activeTextClass : null}>
                            {this.state.half ? oddsObj['1h1x2'].iorHmn : oddsObj.ft1x2.iorMn}
                          </Text>
                        </View>
                        {
                          this.state.half ?
                            <View style={{ width: 15, alignItems: 'center' }}>
                              {iorHmn > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorHmn < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                            </View>
                            :
                            <View style={{ width: 15, alignItems: 'center' }}>
                              {iorMn > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorMn < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                            </View>
                        }
                      </TouchableOpacity>
                      :
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#999' }}>/</Text>
                      </View>
                    }

                  </Row>
                );
              })()}

              <Row style={[styles.gridRightTopColor]}>
                <TouchableOpacity
                  style={[{ justifyContent: 'center', backgroundColor: '#FFFAC7', alignItems: 'center', flexDirection: 'row', flex: 1 }]}
                  onPress={this.toggle}
                >
                  <Text style={[{ marginRight: 1, color: '#878787' }, this.state.half ? null : { backgroundColor: '#FF8500', color: '#fff', padding: 2 }]}>全</Text>
                  <Icons name="icon-toggle-horizontal" size={10} color="#878787" />
                  <Text style={[{ marginLeft: 1, color: '#878787' }, this.state.half ? { backgroundColor: '#FF8500', color: '#fff', padding: 2 } : null]}>半</Text>
                </TouchableOpacity>
              </Row>
            </Col>
          </Row>
          <Row style={{ height: 80 }}>
            <Col size={1}>
              <Row style={[styles.alginCenter, styles.justifyCenter]}><Text style={styles.platyStyleText}>大小</Text></Row>
              <Row style={[styles.alginCenter, styles.justifyCenter]}><Text style={styles.platyStyleText}>单双</Text></Row>
            </Col>
            <Col size={2.5} style={[styles.bgWhite, { borderLeftColor: '#B6B6B6', borderLeftWidth: StyleSheet.hairlineWidth, borderBottomColor: '#B6B6B6', borderBottomWidth: StyleSheet.hairlineWidth }]}>
              {(() => {
                const args = (this.state.half ? ['iorHouc', '1hOu', oddsObj['1hOu'].iorHouc] : ['iorOuc', 'ftOu', oddsObj.ftOu.iorOuc]).concat([gameObj.gameId, `大`, n.parlayMin || [], n.parlayMax || [], n.scheduleId, (this.state.half ? "hratioO" : "ratioO"), (this.state.half ? oddsObj['1hOu'].hratioO : oddsObj.ftOu.ratioO)]);
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {(this.state.half ? oddsObj['1hOu'].iorHouc : oddsObj.ftOu.iorOuc) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 大小球 主赔率
                          onSelected({ args, index: key });
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <Text>
                          {this.state.half ?
                            <Text>
                              <Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>大{oddsObj['1hOu'].hratioO}</Text>
                              <Text style={[isActive ? styles.activeTextClass : null]}>{` ${oddsObj['1hOu'].iorHouc}`}</Text>
                            </Text> :
                            <Text>
                              <Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>大{oddsObj.ftOu.ratioO}</Text>
                              <Text style={[isActive ? styles.activeTextClass : null]}>{` ${oddsObj.ftOu.iorOuc}`}</Text>
                            </Text>
                          }
                        </Text>
                        {
                          this.state.half ?
                            <View style={{ width: 20, alignItems: 'center' }}>
                              {iorHouc > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorHouc < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                            </View>
                            :
                            <View style={{ width: 20, alignItems: 'center' }}>
                              {iorOuc > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorOuc < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                            </View>
                        }
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
                const args = ['iorEoo', 'ftOe', oddsObj.ftOe.iorEoo, gameObj.gameId, '单', n.parlayMin || [], n.parlayMax || [], n.scheduleId];
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {(this.state.half ? '' : oddsObj.ftOe.iorEoo) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 单双 主赔率
                          onSelected({ args, index: key });
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <Text>
                          <Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>单</Text>
                          <Text style={[isActive ? styles.activeTextClass : null]}>{` ${oddsObj.ftOe.iorEoo}`}</Text>
                        </Text>
                        <View style={{ width: 20, alignItems: 'center' }}>
                          {iorEoo > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorEoo < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
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
            <Col size={2.5} style={[styles.bgWhite, { borderBottomColor: '#B6B6B6', borderBottomWidth: StyleSheet.hairlineWidth }]}>
              {(() => {
                const args = (this.state.half ? ['iorHouh', '1hOu', oddsObj['1hOu'].iorHouh] : ['iorOuh', 'ftOu', oddsObj.ftOu.iorOuh]).concat([gameObj.gameId, `小`, n.parlayMin || [], n.parlayMax || [], n.scheduleId, (this.state.half ? "hratioU" : "ratioU"), (this.state.half ? oddsObj['1hOu'].hratioU : oddsObj.ftOu.ratioU)]);
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {(this.state.half ? oddsObj['1hOu'].iorHouh : oddsObj.ftOu.iorOuh) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 大小 客赔率
                          onSelected({ args, index: key });
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <Text>
                          {this.state.half ?
                            <Text>
                              <Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>小{oddsObj['1hOu'].hratioU}</Text>
                              <Text style={[isActive ? styles.activeTextClass : null]}>{` ${oddsObj['1hOu'].iorHouh}`}</Text>
                            </Text> :
                            <Text>
                              <Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>小{oddsObj.ftOu.ratioU}</Text>
                              <Text style={[isActive ? styles.activeTextClass : null]}>{` ${oddsObj.ftOu.iorOuh}`}</Text>
                            </Text>}
                        </Text>
                        {
                          this.state.half ?
                            <View style={{ width: 20, alignItems: 'center' }}>
                              {iorHouh > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorHouh < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                            </View>
                            :
                            <View style={{ width: 20, alignItems: 'center' }}>
                              {iorOuh > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorOuh < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
                            </View>
                        }
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
                const args = ['iorEoe', 'ftOe', oddsObj.ftOe.iorEoe, gameObj.gameId, '双', n.parlayMin || [], n.parlayMax || [], n.scheduleId];
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {(this.state.half ? '' : oddsObj.ftOe.iorEoe) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 单双 客赔率
                          onSelected({ args, index: key });
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <Text style={isActive ? styles.activeTextClass : null}>
                          <Text style={[styles.grayColor, isActive ? styles.activeTextClass : null]}>双</Text>
                          <Text style={isActive ? styles.activeTextClass : null}>{` ${oddsObj.ftOe.iorEoe}`}</Text>
                        </Text>
                        <View style={{ width: 20, alignItems: 'center' }}>
                          {iorEoe > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorEoe < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
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
            <Col size={1} style={[styles.alginCenter, styles.justifyCenter, { backgroundColor: '#DCF1D8' }, styles.gridRightTopColor, { borderRightColor: '#B6B6B6', borderRightWidth: StyleSheet.hairlineWidth, borderBottomColor: '#B6B6B6', borderBottomWidth: StyleSheet.hairlineWidth }]}>
              <TouchableOpacity
                onPress={noOpenHandler}
                style={[{ flex: 1 }, styles.alginCenter, styles.justifyCenter,]}
              >
                <Text style={{ color: '#81907E' }}>所有{'\n'}玩法</Text>
                <Icons name="icon-arrow-bottom-large" color="#81907E" size={14} />
              </TouchableOpacity>
            </Col>
          </Row>
        </Grid>
      );
    }) || null;
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
  }
});

const mapStateToProps = (state) => {
  return {
    matchEventType: state.match.matchEventType
  };
};

export default connect(mapStateToProps)(MatchGrid);
