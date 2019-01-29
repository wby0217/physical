// 波胆表格
import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import _ from 'lodash';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Icons, noOpenHandler } from '../../../mesosphere';
const moment = require('moment');

export default class CorrectGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            half: true
        };
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
        return activeIdStr.indexOf(`-${gameId}-`) > -1 || (prevAtiveIds && (prevAtiveIds.indexOf(`-${gameId}-`) > -1)) || (prevGameIdStr && (prevGameIdStr.indexOf(`-${gameId}-`) > -1)) ;
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
        const { n, onSelected } = this.props;
        const oddsObj = n.games[0].odds;
        return (
          <Grid style={{ paddingRight: 6, paddingTop: 5 }}>
            <Row style={{ alignItems: 'center', height: 30 }}>
              <Col style={{ alignItems: 'center', flexDirection: 'row', paddingLeft: 10, height: 25 }}>
                {n.inPlayNow === 1 ? <Icons name="icon-football" color="#17A84B" size={14} /> : null}
                <Text style={{ color: '#17A84B', marginLeft: 5, fontSize: 12 }}>{n.beginTime ? moment(n.beginTime).format('YYYY-MM-DD HH:mm'): ''}</Text>
              </Col>
            </Row>
            <Row style={{ height: 80 }}>
              <Col size={0.8}>
                <Row style={[styles.alginCenter, styles.justifyCenter, { paddingHorizontal: 2 }]}><Text>{n.homeName}</Text></Row>
              </Col>
              <Col size={1.2} style={[styles.bgWhite, { borderLeftColor: '#B6B6B6', borderLeftWidth: StyleSheet.hairlineWidth }]}>
                {(() => {
                    const args = (['iorH1c0', '1hCorrectScore', oddsObj['1hCorrectScore'].iorH1c0]).concat([n.games[0].gameId, '1#0', n.parlayMin || [], n.parlayMax || []]);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                        {(oddsObj['1hCorrectScore'].iorH1c0) ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {  // 波胆 主赔率 1-0
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>1-0</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hCorrectScore'].iorH1c0}</Text>
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
                    const args = (['iorH3c1', '1hCorrectScore', oddsObj['1hCorrectScore'].iorH3c1]).concat([n.games[0].gameId, '3#1', n.parlayMin || [], n.parlayMax || []]);
                    const isActive = this.isActive((['iorH3c1', '1hCorrectScore', oddsObj['1hCorrectScore'].iorH3c1]).concat([n.games[0].gameId, '3#1', n.parlayMin || [], n.parlayMax || []]));
                    return (
                      <Row style={[styles.gridRightTopColor]}>
                        {(oddsObj['1hCorrectScore'].iorH3c1) ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 波胆 主赔率 3-1
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>3-1</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hCorrectScore'].iorH3c1}</Text>
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
              <Col size={1.2} style={styles.bgWhite}>
                {(() => {
                    const args = (['iorH2c0', '1hCorrectScore', oddsObj['1hCorrectScore'].iorH2c0]).concat([n.games[0].gameId, '2#0', n.parlayMin || [], n.parlayMax || []]);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                        {(oddsObj['1hCorrectScore'].iorH2c0) ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 波胆 主赔率 2-0
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>2-0</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hCorrectScore'].iorH2c0}</Text>
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
                    const args = (['iorH3c2', '1hCorrectScore', oddsObj['1hCorrectScore'].iorH3c2]).concat([n.games[0].gameId, '3#2', n.parlayMin || [], n.parlayMax || []]);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor]}>
                        {(oddsObj['1hCorrectScore'].iorH3c2) ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 波胆 主赔率 3-2
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>3-2</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hCorrectScore'].iorH3c2}</Text>
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
              <Col size={1.2} style={styles.bgWhite}>
                {(() => {
                    const args = (['iorH2c1', '1hCorrectScore', oddsObj['1hCorrectScore'].iorH2c1]).concat([n.games[0].gameId, '2#1', n.parlayMin || [], n.parlayMax || []]);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                        {(oddsObj['1hCorrectScore'].iorH2c1) ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 波胆 主赔率 2-1   // todo finish 4.24
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>2-1</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hCorrectScore'].iorH2c1}</Text>
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
                    return (
                      <Row style={[styles.gridRightTopColor]}>
                          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#999' }}>/</Text>
                          </View>
                      </Row>
                    );
                })()}
              </Col>
              <Col size={1.2} style={styles.bgWhite}>
                {(() => {
                    const args = (['iorH3c0', '1hCorrectScore', oddsObj['1hCorrectScore'].iorH3c0]).concat([n.games[0].gameId, '3#0', n.parlayMin || [], n.parlayMax || []]);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                        {(oddsObj['1hCorrectScore'].iorH3c0) ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 波胆  主赔率 3-0
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>3-0</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hCorrectScore'].iorH3c0}</Text>
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
                    return (
                      <Row style={[styles.gridRightTopColor]}>
                          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#999' }}>/</Text>
                          </View>
                      </Row>
                    );
                })()}
              </Col>
            </Row>
            <Row style={{ height: 80 }}>
              <Col size={0.8}>
                <Row style={[styles.alginCenter, styles.justifyCenter, { paddingHorizontal: 2 }]}><Text>{n.guestName}</Text></Row>
              </Col>
              <Col size={1.2} style={[styles.bgWhite, { borderLeftColor: '#B6B6B6', borderLeftWidth: StyleSheet.hairlineWidth }]}>
                {(() => {
                    const args = (['iorH0c1', '1hCorrectScore', oddsObj['1hCorrectScore'].iorH0c1]).concat([n.games[0].gameId, '0#1', n.parlayMin || [], n.parlayMax || []]);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                        {(oddsObj['1hCorrectScore'].iorH0c1) ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 波胆 客赔率 0-1
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>0-1</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hCorrectScore'].iorH0c1}</Text>
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
                    const args = (['iorH1c3', '1hCorrectScore', oddsObj['1hCorrectScore'].iorH1c3]).concat([n.games[0].gameId, '1#3', n.parlayMin || [], n.parlayMax || []]);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor]}>
                        {(oddsObj['1hCorrectScore'].iorH1c3) ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 波胆 客赔率  1-3
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>1-3</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hCorrectScore'].iorH1c3}</Text>
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
              <Col size={1.2} style={styles.bgWhite}>
                {(() => {
                    const args = (['iorH0c2', '1hCorrectScore', oddsObj['1hCorrectScore'].iorH0c2]).concat([n.games[0].gameId, '0#2', n.parlayMin || [], n.parlayMax || []]);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                        {(oddsObj['1hCorrectScore'].iorH0c2) ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 波胆 客赔率 0-2
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>0-2</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hCorrectScore'].iorH0c2}</Text>
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
                    const args = (['iorH2c3', '1hCorrectScore', oddsObj['1hCorrectScore'].iorH2c3]).concat([n.games[0].gameId, '2#3', n.parlayMin || [], n.parlayMax || []]);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor]}>
                        {(oddsObj['1hCorrectScore'].iorH2c3) ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 波胆 客赔率 2-3
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>2-3</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hCorrectScore'].iorH2c3}</Text>
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
              <Col size={1.2} style={styles.bgWhite}>
                {(() => {
                    const args = (['iorH1c2', '1hCorrectScore', oddsObj['1hCorrectScore'].iorH1c2]).concat([n.games[0].gameId, '1#2', n.parlayMin || [], n.parlayMax || []]);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                        {(oddsObj['1hCorrectScore'].iorH1c2) ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 波胆 客赔率 1-2
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>1-2</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hCorrectScore'].iorH1c2}</Text>
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
                    return (
                      <Row style={[styles.gridRightTopColor]}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{ color: '#999' }}>/</Text>
                        </View>
                      </Row>
                    );
                })()}
              </Col>
              <Col size={1.2} style={styles.bgWhite}>
                {(() => {
                    const args = (['iorH0c3', '1hCorrectScore', oddsObj['1hCorrectScore'].iorH0c3]).concat([n.games[0].gameId, '0#3', n.parlayMin || [], n.parlayMax || []]);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                        {(oddsObj['1hCorrectScore'].iorH0c3) ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 波胆 客赔率 0-3
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>0-3</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hCorrectScore'].iorH0c3}</Text>
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
                    return (
                      <Row style={[styles.gridRightTopColor]}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{ color: '#999' }}>/</Text>
                        </View>
                      </Row>
                    );
                })()}
              </Col>
            </Row>
            <Row style={{ height: 80 }}>
              <Col size={0.8}>
                <Row style={[styles.alginCenter, styles.justifyCenter, { paddingHorizontal: 2 }]}><Text>和局</Text></Row>
                <Row style={[styles.alginCenter, styles.justifyCenter, { paddingHorizontal: 2 }]}><Text>其它</Text></Row>
              </Col>
              <Col size={4.8}>
                <Row>
                  <Col style={[styles.bgWhite, { borderLeftColor: '#B6B6B6', borderLeftWidth: StyleSheet.hairlineWidth }]}>
                    {(() => {
                        const args = (['iorH0c0', '1hCorrectScore', oddsObj['1hCorrectScore'].iorH0c0]).concat([n.games[0].gameId, '0#0', n.parlayMin || [], n.parlayMax || []]);
                        const isActive = this.isActive(args);
                        return (
                          <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                            {(oddsObj['1hCorrectScore'].iorH0c0) ?
                              <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => { // 波胆 和局 0-0
                                    onSelected(args);
                                }}
                                style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                              >
                                <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>0-0</Text>
                                <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hCorrectScore'].iorH0c0}</Text>
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
                  <Col style={styles.bgWhite}>
                    {(() => {
                        const args = (['iorH1c1', '1hCorrectScore', oddsObj['1hCorrectScore'].iorH1c1]).concat([n.games[0].gameId, '1#1', n.parlayMin || [], n.parlayMax || []]);
                        const isActive = this.isActive(args);
                        return (
                          <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                            {(oddsObj['1hCorrectScore'].iorH1c1) ?
                              <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => { // 波胆 和局 1-1
                                    onSelected(args);
                                }}
                                style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                              >
                                <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>1-1</Text>
                                <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hCorrectScore'].iorH1c1}</Text>
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
                  <Col style={styles.bgWhite}>
                    {(() => {
                        const args = (['iorH2c2', '1hCorrectScore', oddsObj['1hCorrectScore'].iorH2c2]).concat([n.games[0].gameId, '2#2', n.parlayMin || [], n.parlayMax || []]);
                        const isActive = this.isActive(args);
                        return (
                          <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                            {(oddsObj['1hCorrectScore'].iorH2c2) ?
                              <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => { // 波胆 和局 2-2
                                    onSelected(args);
                                }}
                                style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                              >
                                <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>2-2</Text>
                                <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hCorrectScore'].iorH2c2}</Text>
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
                  <Col style={styles.bgWhite}>
                    {(() => {
                        const args = (['iorH3c3', '1hCorrectScore', oddsObj['1hCorrectScore'].iorH3c3]).concat([n.games[0].gameId, '3#3', n.parlayMin || [], n.parlayMax || []]);
                        const isActive = this.isActive(args);
                        return (
                          <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                            {(oddsObj['1hCorrectScore'].iorH3c3) ?
                              <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => { // 波胆 和局 3-3
                                    onSelected(args);
                                }}
                                style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                              >
                                <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>3-3</Text>
                                <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hCorrectScore'].iorH3c3}</Text>
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
                <Row>
                  <Col size={1} style={[styles.bgWhite, { borderLeftColor: '#B6B6B6', borderLeftWidth: StyleSheet.hairlineWidth }]}>
                    {(() => {
                        const args = (['iorOvh', '1hCorrectScore', oddsObj['1hCorrectScore'].iorOvh]).concat([n.games[0].gameId, '其它', n.parlayMin || [], n.parlayMax || []]);
                        const isActive = this.isActive(args);
                        return (
                          <Row style={[styles.gridRightTopColor, { borderBottomColor: '#B6B6B6', borderBottomWidth: StyleSheet.hairlineWidth }]}>
                            {(oddsObj['1hCorrectScore'].iorOvh) ?
                              <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => { // 波胆 和局 其它
                                    onSelected(args);
                                }}
                                style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                              >
                                <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>其它</Text>
                                <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hCorrectScore'].iorOvh}</Text>
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
                  <Col size={1} style={[{ backgroundColor: '#FFF9C7' }]}>
                    <Row style={[styles.alginCenter, { justifyContent: 'flex-end' }, styles.gridRightTopColor, { borderBottomColor: '#B6B6B6', borderBottomWidth: StyleSheet.hairlineWidth }]}>
                      <TouchableOpacity
                        activeOpacity={1}
                        style={[{ justifyContent: 'center', backgroundColor: '#FFFAC7', alignItems: 'center', flexDirection: 'row', flex: 1 }]}
                      >
                        <Text style={[{ marginRight: 1, color: '#878787' }, { backgroundColor: '#FF8500', color: '#fff', padding: 2 }]}>半</Text>
                      </TouchableOpacity>
                    </Row>
                  </Col>
                  <Col size={2} style={{ backgroundColor: '#DCF1D8' }}>
                    <Row style={[styles.alginCenter, { justifyContent: 'center' }, styles.gridRightTopColor, { borderBottomColor: '#B6B6B6', borderBottomWidth: StyleSheet.hairlineWidth, borderRightColor: '#B6B6B6', borderRightWidth: StyleSheet.hairlineWidth }]}>
                        <TouchableOpacity
                            onPress={noOpenHandler}
                            style={[ styles.alginCenter, styles.justifyCenter, { flex: 1, flexDirection: 'row' }  ]}
                          >
                           <Text style={{ color: '#81907E' }}>所有玩法</Text><Icons name="icon-arrow-bottom-large" color="#81907E" size={14} />
                      </TouchableOpacity>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Grid>
        );
    }
}

const styles = StyleSheet.create({
    alginCenter: {
        alignItems: 'center'
    },
    justifyCenter: {
        justifyContent: 'center'
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

