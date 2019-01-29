// 网球波胆

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
class TennisCrorretGrid extends Component {
  // 0 表示无变化、1表示上涨、 -1表示下跌
  constructor(props) {
    super(props);
    this.state = {
      iorH2c0: 0,
      iorH2c1: 0,
      iorH3c0: 0,
      iorH3c1: 0,
      iorH3c2: 0,
      iorH0c2: 0,
      iorH1c2: 0,
      iorH0c3: 0,
      iorH1c3: 0,
      iorH2c3: 0
    }
    this.isActive = this.isActive.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    const activeIds = nextProps.activeId;
    const activeIdStr = activeIds.toString();
    const gameId = nextProps.n.gameId;
    const prevGameId = nextProps.prevGameId.toArray();
    const prevGameIdStr = prevGameId.length && prevGameId.toString();
    const prevActiveId = nextProps.prevActiveId.toArray();
    const prevAtiveIds = prevActiveId.length && prevActiveId.toString();
    return activeIdStr.indexOf(`-${gameId}-`) > -1 || (prevAtiveIds && (prevAtiveIds.indexOf(`-${gameId}-`) > -1)) || (prevGameIdStr && (prevGameIdStr.indexOf(`-${gameId}-`) > -1)) || this.state.half !== nextState.half;
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
    const { iorH2c0, iorH2c1, iorH3c0, iorH3c1, iorH3c2, iorH0c2, iorH1c2, iorH0c3, iorH1c3, iorH2c3 } = this.state;
    const curGameInfo = n;
    return (
      <View>
        <Grid style={{ paddingRight: 6, marginTop: 10 }}>
          <Row style={{ alignItems: 'center', height: 50 }}>
            <Col size={1} style={{ alignItems: 'center' }}>
              {n.inPlayNow === 'yes' && matchTypeId !== 'in_play_now' ? <Icons name="icon-football" color="#17A84B" /> : null}
              {matchTypeId === 'in_play_now' ? !n.timer ? <Text style={{ color: '#17A84B', fontSize: 12 }}>{n.beginTime ? moment(n.beginTime).format('MM-DD HH:mm').split(' ')[0] : ''}{'\n'}{n.beginTime ? moment(n.beginTime).format('MM-DD HH:mm').split(' ')[1] : ''}</Text> :
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
          <Row style={{ height: 200 }}>
            <Col size={1}>
              <Row style={[styles.alginCenter, styles.justifyCenter, { flex: 1 }]}><Text style={styles.platyStyleText}>2-0</Text></Row>
              <Row style={[styles.alginCenter, styles.justifyCenter, { flex: 1 }]}><Text style={styles.platyStyleText}>2-1</Text></Row>
              <Row style={[styles.alginCenter, styles.justifyCenter, { flex: 1 }]}><Text style={styles.platyStyleText}>3-0</Text></Row>
              <Row style={[styles.alginCenter, styles.justifyCenter, { flex: 1 }]}><Text style={styles.platyStyleText}>3-1</Text></Row>
              <Row style={[styles.alginCenter, styles.justifyCenter, { flex: 1 }]}><Text style={styles.platyStyleText}>3-2</Text></Row>
            </Col>
            <Col size={2.5} style={[styles.bgWhite, { borderLeftColor: '#B6B6B6', borderLeftWidth: StyleSheet.hairlineWidth }]}>
              {
                (() => {
                  const args = (['iorH2c0', 'correctScore', curGameInfo.odds['correctScore'].iorH2c0]).concat([curGameInfo.gameId, '2#0', n.parlayMin || [], n.parlayMax || []]);
                  const isActive = this.isActive(args);
                  return (curGameInfo.odds['correctScore'].iorH2c0) ?
                    <Row
                      style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth },
                      isActive ? styles.activeViewClass : null]}
                    >
                      <TouchableOpacity
                        activeOpacity={1} style={[{ flex: 1 }, { justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }]}
                        onPress={() => { // 主 2-0
                          onSelected(args);
                        }}
                      >
                        <View>
                          <Text style={isActive ? styles.activeTextClass : null}>
                            {curGameInfo.odds['correctScore'].iorH2c0}
                          </Text>
                        </View>
                        <View style={{ width: 20, alignItems: 'center' }}>
                          {iorH2c0 > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorH2c0 < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
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
                  const args = ['iorH2c1', 'correctScore', curGameInfo.odds['correctScore'].iorH2c1].concat([curGameInfo.gameId, '2#1', n.parlayMin || [], n.parlayMax || []]);
                  const isActive = this.isActive(args);
                  return (<Row style={[styles.gridRightTopColor]}>
                    {(curGameInfo.odds['correctScore'].iorH2c1) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 主 2-1
                          onSelected(args);
                        }}
                        style={[{ flex: 1 }, { justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' },
                        isActive ? styles.activeViewClass : null]}
                      >
                        <Text>
                          <Text style={isActive ? styles.activeTextClass : null}>
                            {curGameInfo.odds['correctScore'].iorH2c1}
                          </Text>
                        </Text>
                        <View style={{ width: 20, alignItems: 'center' }}>
                          {iorH2c1 > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorH2c1 < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
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
              {(() => {
                const args = ['iorH3c0', 'correctScore', curGameInfo.odds['correctScore'].iorH3c0].concat([curGameInfo.gameId, '3#0', n.parlayMin || [], n.parlayMax || []]);
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {(curGameInfo.odds['correctScore'].iorH3c0) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 主 3-0
                          onSelected(args);
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <Text style={[isActive ? styles.activeTextClass : null]}>{curGameInfo.odds['correctScore'].iorH3c0}</Text>
                        <View style={{ width: 20, alignItems: 'center' }}>
                          {iorH3c0 > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorH3c0 < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
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
              {
                (() => {
                  const args = ['iorH3c1', 'correctScore', curGameInfo.odds['correctScore'].iorH3c1].concat([curGameInfo.gameId, '3#1', n.parlayMin || [], n.parlayMax || []]);
                  const isActive = this.isActive(args);
                  return (<Row style={[styles.gridRightTopColor]}>
                    {(curGameInfo.odds['correctScore'].iorH3c1) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 主 3-1
                          onSelected(args);
                        }}
                        style={[{ flex: 1 }, { justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' },
                        isActive ? styles.activeViewClass : null]}
                      >

                        <Text style={[isActive ? styles.activeTextClass : null]}>{curGameInfo.odds['correctScore'].iorH3c1}</Text>
                        <View style={{ width: 20, alignItems: 'center' }}>
                          {iorH3c1 > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorH3c1 < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
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
              {(() => {
                const args = ['iorH3c2', 'correctScore', curGameInfo.odds['correctScore'].iorH3c2, curGameInfo.gameId, '3#2', n.parlayMin || [], n.parlayMax || []];
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {(curGameInfo.odds['correctScore'].iorH3c2) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 主 3-2
                          onSelected(args);
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <Text style={[isActive ? styles.activeTextClass : null]}>{curGameInfo.odds['correctScore'].iorH3c2}</Text>
                        <View style={{ width: 20, alignItems: 'center' }}>
                          {iorH3c2 > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorH3c2 < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
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
            <Col size={2.5} style={styles.bgWhite}>
              {(() => {
                const args = ['iorH0c2', 'correctScore', curGameInfo.odds['correctScore'].iorH0c2].concat([curGameInfo.gameId, '0#2', n.parlayMin || [], n.parlayMax || []]);
                const isActive = this.isActive(args);
                return (<Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                  {curGameInfo.odds['correctScore'].iorH0c2 ?
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => { // 客 0-2
                        onSelected(args);
                      }}
                      style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                    >
                      <View>
                        <Text style={isActive ? styles.activeTextClass : null}>{curGameInfo.odds['correctScore'].iorH0c2}</Text>
                      </View>
                      <View style={{ width: 20, alignItems: 'center' }}>
                        {iorH0c2 > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorH0c2 < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
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
                const args = ['iorH1c2', 'correctScore', curGameInfo.odds['correctScore'].iorH1c2].concat([curGameInfo.gameId, '1#2', n.parlayMin || [], n.parlayMax || []]);
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {(curGameInfo.odds['correctScore'].iorH1c2) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 客 1-2
                          onSelected(args);
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <View>
                          <Text style={isActive ? styles.activeTextClass : null}>{curGameInfo.odds['correctScore'].iorH1c2}</Text>
                        </View>
                        <View style={{ width: 20, alignItems: 'center' }}>
                          {iorH1c2 > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorH1c2 < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
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
                const args = ['iorH0c3', 'correctScore', curGameInfo.odds['correctScore'].iorH0c3].concat([curGameInfo.gameId, '0#3', n.parlayMin || [], n.parlayMax || []]);
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {(curGameInfo.odds['correctScore'].iorH0c3) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 客 0-3
                          onSelected(args);
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <View>
                          <Text style={isActive ? styles.activeTextClass : null}>{curGameInfo.odds['correctScore'].iorH0c3}</Text>
                        </View>
                        <View style={{ width: 20, alignItems: 'center' }}>
                          {iorH0c3 > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorH0c3 < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
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
                const args = ['iorH1c3', 'correctScore', curGameInfo.odds['correctScore'].iorH1c3].concat([curGameInfo.gameId, '1#3', n.parlayMin || [], n.parlayMax || []]);
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {(curGameInfo.odds['correctScore'].iorH1c3) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 球员局数大小-客/大
                          onSelected(args);
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <View>
                          <Text style={isActive ? styles.activeTextClass : null}>{curGameInfo.odds['correctScore'].iorH1c3}</Text>
                        </View>
                        <View style={{ width: 20, alignItems: 'center' }}>
                          {iorH1c3 > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorH1c3 < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
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
                const args = ['iorH2c3', 'correctScore', curGameInfo.odds['correctScore'].iorH2c3, curGameInfo.gameId, '2#3', n.parlayMin || [], n.parlayMax || []];
                const isActive = this.isActive(args);
                return (
                  <Row style={[styles.gridRightTopColor]}>
                    {(curGameInfo.odds['correctScore'].iorH2c3) ?
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { // 球员局数大小-客/小
                          onSelected(args);
                        }}
                        style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }, isActive ? styles.activeViewClass : null]}
                      >
                        <View>
                          <Text style={isActive ? styles.activeTextClass : null}>{curGameInfo.odds['correctScore'].iorH2c3}</Text>
                        </View>
                        <View style={{ width: 20, alignItems: 'center' }}>
                          {iorH2c3 > 0 ? <Icons name="icon-arrow-top" color="#FF6E6E" /> : iorH2c3 < 0 ? <Icons name="icon-arrow-down" color="#9BFF95" /> : null}
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
      </View>
    );
  }
}
const convertGameName = (name) => {
  switch (name) {
    case 'handicap':
      return '让球';
    case '1st':
      return '第一盘';
    case '2nd':
      return '第二盘';
    case '3rd':
      return '第三盘';
    case '4th':
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
    backgroundColor: '#17A84B'
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

export default connect(mapStateToProps)(TennisCrorretGrid);
