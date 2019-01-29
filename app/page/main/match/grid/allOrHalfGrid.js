// 全、半场 表格
import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import _ from 'lodash';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Icons, noOpenHandler } from '../../../mesosphere';
const moment = require('moment');

export default class AllOrHalfGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            half: false
        };
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
        return activeIdStr.indexOf(`-${gameId}-`) > -1 || (prevAtiveIds && (prevAtiveIds.indexOf(`-${gameId}-`) > -1)) || (prevGameIdStr && (prevGameIdStr.indexOf(`-${gameId}-`) > -1)) || this.state.half !== nextState.half ;
    }
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
        const { n, onSelected } = this.props;
        const oddsObj = n.games[0].odds;
        return (
          <Grid style={{ paddingHorizontal: 6, paddingTop: 5 }}>
            <Row style={{ alignItems: 'center', height: 50 }}>
              <Col size={0.8} style={{ alignItems: 'center' }}>
                {n.inPlayNow === 1 ? <Icons name="icon-football" color="#17A84B" size={14} /> : null}
                <Text style={{ color: '#17A84B', fontSize: 12 }}>{ n.beginTime ? moment(n.beginTime).format('MM-DD HH:mm').split(' ')[0] : ''}{'\n'}{ n.beginTime ? moment(n.beginTime).format('MM-DD HH:mm').split(' ')[1] : ''}</Text>
              </Col>
              <Col size={5} style={styles.alginCenter}><Text>{n.homeName}（主） VS {n.guestName}（客）</Text></Col>
            </Row>
            <Row style={{ height: 80 }}>
              <Col size={1} style={[styles.bgWhite, { borderLeftColor: '#B6B6B6', borderLeftWidth: StyleSheet.hairlineWidth, borderBottomColor: '#B6B6B6', borderBottomWidth: StyleSheet.hairlineWidth }]}>
                {(() => {
                    const args = ['iorFhh', 'htFt', oddsObj.htFt.iorFhh, n.games[0].gameId, '主/主'].concat(n.parlayMin || [], n.parlayMax || []);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                        {oddsObj.htFt.iorFhh ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 全半场 主/主
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>主/主</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj.htFt.iorFhh}</Text>
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
                    const args = ['iorFch', 'htFt', oddsObj.htFt.iorFch, n.games[0].gameId, '客/主'].concat(n.parlayMin || [], n.parlayMax || []);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor]}>
                        {oddsObj.htFt.iorFch ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 全半场 客/主
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>客/主</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj.htFt.iorFch}</Text>
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
                    const args = ['iorFhn', 'htFt', oddsObj.htFt.iorFhn, n.games[0].gameId, '主/和'].concat(n.parlayMin || [], n.parlayMax || []);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                        {oddsObj.htFt.iorFhn ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 全半场 主/和
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>主/和</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj.htFt.iorFhn}</Text>
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
                    const args = ['iorFcn', 'htFt', oddsObj.htFt.iorFcn, n.games[0].gameId, '客/和'].concat(n.parlayMin || [], n.parlayMax || []);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor]}>
                        {oddsObj.htFt.iorFcn ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 全半场 客/和
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>客/和</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj.htFt.iorFcn}</Text>
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
                    const args = ['iorFnh', 'htFt', oddsObj.htFt.iorFnh, n.games[0].gameId, '和/主'].concat(n.parlayMin || [], n.parlayMax || []);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                        {oddsObj.htFt.iorFnh ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 全半场 和/主
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>和/主</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj.htFt.iorFnh}</Text>
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
                    const args = ['iorFcc', 'htFt', oddsObj.htFt.iorFcc, n.games[0].gameId, '客/客'].concat(n.parlayMin || [], n.parlayMax || []);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor]}>
                        {oddsObj.htFt.iorFcc ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 全半场 客/客
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>客/客</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj.htFt.iorFcc}</Text>
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
                    const args = ['iorFnn', 'htFt', oddsObj.htFt.iorFnn, n.games[0].gameId, '和/和'].concat(n.parlayMin || [], n.parlayMax || []);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                        {oddsObj.htFt.iorFnn ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 全半场 和/和
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>和/和</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj.htFt.iorFnn}</Text>
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
                    const args = ['iorFnc', 'htFt', oddsObj.htFt.iorFnc, n.games[0].gameId, '和/客'].concat(n.parlayMin || [], n.parlayMax || []);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor]}>
                        {oddsObj.htFt.iorFnc ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 全半场 和/客
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>和/客</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj.htFt.iorFnc}</Text>
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
              <Col size={1} style={[styles.bgWhite, { borderBottomColor: '#B6B6B6', borderBottomWidth: StyleSheet.hairlineWidth, borderRightColor: '#B6B6B6', borderRightWidth: StyleSheet.hairlineWidth }]}>
                {(() => {
                    const args = ['iorFhc', 'htFt', oddsObj.htFt.iorFhc, n.games[0].gameId, '主/客'].concat(n.parlayMin || [], n.parlayMax || []);
                    const isActive = this.isActive(args);
                    return (
                      <Row style={[styles.gridRightTopColor, { borderTopColor: '#B6B6B6', borderTopWidth: StyleSheet.hairlineWidth }]}>
                        {oddsObj.htFt.iorFhc ?
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { // 全半场 和/和
                                onSelected(args);
                            }}
                            style={[{ flex: 1 }, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, isActive ? styles.activeViewClass : null]}
                          >
                            <Text style={[styles.grayColor, { fontSize: 12 }, isActive ? styles.activeTextClass : null]}>主/客</Text>
                            <Text style={isActive ? styles.activeTextClass : null}>{oddsObj.htFt.iorFhc}</Text>
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
                      <Row style={[  { backgroundColor: '#DCF1D8', marginBottom: StyleSheet.hairlineWidth }, styles.gridRightTopColor,]}>
                        <TouchableOpacity
                          onPress={noOpenHandler}
                          style={[styles.alginCenter, styles.justifyCenter, { flex: 1, flexDirection: 'row' }]}
                        >
                          <Text style={{ color: '#81907E' }}>所有{'\n'}玩法</Text>
                          <Icons name="icon-arrow-bottom-large" color="#81907E" size={14} />
                        </TouchableOpacity>
                      </Row>
                    );
                })()}
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
