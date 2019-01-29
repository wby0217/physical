// 总进球 表格
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

export default class AllEntryGrid extends Component {
    constructor(props) {
        super(props);
        this.isActive = this.isActive.bind(this);
    }
    shouldComponentUpdate(nextProps) {
        const activeIds = nextProps.activeId;
        const activeIdStr = activeIds.toString();
        const gameId = nextProps.n.games[0].gameId;
        const prevGameId = nextProps.prevGameId.toArray();
        const prevGameIdStr = prevGameId.length && prevGameId.toString();
        const prevActiveId = nextProps.prevActiveId.toArray();
        const prevAtiveIds = prevActiveId.length && prevActiveId.toString();
        return activeIdStr.indexOf(`-${gameId}-`) > -1 || (prevAtiveIds && (prevAtiveIds.indexOf(`-${gameId}-`) > -1)) || (prevGameIdStr && (prevGameIdStr.indexOf(`-${gameId}-`) > -1));
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
            <Row style={{ alignItems: 'center', height: 50 }}>
              <Col size={0.8} style={{ alignItems: 'center' }}>
                {n.inPlayNow === 1 ? <Icons name="icon-football" color="#17A84B" size={14} /> : null}
                <Text style={{ color: '#17A84B', fontSize: 12 }}>{ n.beginTime ? moment(n.beginTime).format('MM-DD HH:mm').split(' ')[0] : ''}{'\n'}{ n.beginTime ? moment(n.beginTime).format('MM-DD HH:mm').split(' ')[1] : ''}</Text>
              </Col>
              <Col size={5} style={styles.alginCenter}><Text>{n.homeName}（主） VS {n.guestName}（客）</Text></Col>
            </Row>
            <Row style={{ height: 80 }}>
              <Col size={0.8}>
                <Row style={[styles.alginCenter, styles.justifyCenter, { paddingHorizontal: 2 }]}><Text>全场</Text></Row>
                <Row style={[styles.alginCenter, styles.justifyCenter, { paddingHorizontal: 2 }]}><Text>半场</Text></Row>
              </Col>
              <Col size={1} style={[styles.bgWhite, { borderLeftColor: '#B6B6B6', borderLeftWidth: StyleSheet.hairlineWidth, borderBottomColor: '#B6B6B6', borderBottomWidth: StyleSheet.hairlineWidth }]}>
                {(() => {
                    const args = ['iorT01', 'ftTotalGoals', oddsObj.ftTotalGoals.iorT01, n.games[0].gameId, '0#1'].concat(n.parlayMin || [], n.parlayMax || []);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                        {oddsObj.ftTotalGoals.iorT01 ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 总入球  全场 0-1
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>0-1</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj.ftTotalGoals.iorT01}</Text>
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
                    const args = ['iorHt0', '1hTotalGoals', oddsObj['1hTotalGoals'].iorHt0, n.games[0].gameId, '0'].concat(n.parlayMin || [], n.parlayMax || []);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor]}>
                        {oddsObj['1hTotalGoals'].iorHt0 ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 总入球  半场 0
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>0</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hTotalGoals'].iorHt0}</Text>
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
              <Col size={1} style={[styles.bgWhite, { borderBottomColor: '#B6B6B6', borderBottomWidth: StyleSheet.hairlineWidth }]}>
                {(() => {
                    const args = ['iorT23', 'ftTotalGoals', oddsObj.ftTotalGoals.iorT23, n.games[0].gameId, '2#3'].concat(n.parlayMin || [], n.parlayMax || []);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                        {oddsObj.ftTotalGoals.iorT23 ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 总入球 全场 2-3
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>2-3</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj.ftTotalGoals.iorT23}</Text>
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
                    const args = ['iorHt1', '1hTotalGoals', oddsObj['1hTotalGoals'].iorHt1, n.games[0].gameId, '1'].concat(n.parlayMin || [], n.parlayMax || []);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor]}>
                        {oddsObj['1hTotalGoals'].iorHt1 ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 总入球 半场 1
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>1</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hTotalGoals'].iorHt1}</Text>
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
              <Col size={1} style={[styles.bgWhite, { borderBottomColor: '#B6B6B6', borderBottomWidth: StyleSheet.hairlineWidth }]}>
                {(() => {
                    const args = ['iorT46', 'ftTotalGoals', oddsObj.ftTotalGoals.iorT46, n.games[0].gameId, '4#6'].concat(n.parlayMin || [], n.parlayMax || []);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                        {oddsObj.ftTotalGoals.iorT46 ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 总入球 全场 4-6
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>4-6</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj.ftTotalGoals.iorT46}</Text>
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
                    const args = ['iorHt2', '1hTotalGoals', oddsObj['1hTotalGoals'].iorHt2, n.games[0].gameId, '2'].concat(n.parlayMin || [], n.parlayMax || []);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor]}>
                        {oddsObj['1hTotalGoals'].iorHt2 ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 总入球 半场 2
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>2</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hTotalGoals'].iorHt2}</Text>
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
              <Col size={1} style={[styles.bgWhite, { borderBottomColor: '#B6B6B6', borderBottomWidth: StyleSheet.hairlineWidth }]}>
                {(() => {
                    const args = ['iorOver', 'ftTotalGoals', oddsObj.ftTotalGoals.iorOver, n.games[0].gameId, '7+'].concat(n.parlayMin || [], n.parlayMax || []);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                        {oddsObj.ftTotalGoals.iorOver ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 总入球 全场 7+
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>7+</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj.ftTotalGoals.iorOver}</Text>
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
                    const args = ['iorHtov', '1hTotalGoals', oddsObj['1hTotalGoals'].iorHtov, n.games[0].gameId, '3+'].concat(n.parlayMin || [], n.parlayMax || []);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor]}>
                        {oddsObj['1hTotalGoals'].iorHtov ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 总入球 半场 3+
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>3+</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj['1hTotalGoals'].iorHtov}</Text>
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
              <Col size={0.8} style={[styles.alginCenter, styles.justifyCenter, { backgroundColor: '#DCF1D8' }, styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth, borderRightColor: '#B6B6B6', borderRightWidth: StyleSheet.hairlineWidth, borderBottomColor: '#B6B6B6', borderBottomWidth: StyleSheet.hairlineWidth }]}>
                  <TouchableOpacity
                    onPress={noOpenHandler}
                    style={[styles.alginCenter, styles.justifyCenter,{ flex: 1, flexDirection:'row' }]}
                  >
                    <Text style={{ color: '#81907E' }}>所有{'\n'}玩法</Text>
                    <Icons name="icon-arrow-bottom-large" color="#81907E" size={14} />
                  </TouchableOpacity>
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
    itemHeight: {
        height: 40
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
