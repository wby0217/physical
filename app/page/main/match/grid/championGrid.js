// 冠军数据表格

import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import _ from 'lodash';
import Accordion from '../../../../component/Accordion';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Icons } from '../../../mesosphere';
const moment = require('moment');

export default class ChampionGrid extends Component {
    constructor(props) {
        super(props);
        this.isActive = this.isActive.bind(this);
    }
    shouldComponentUpdate(nextProps) {
        const activeIds = nextProps.activeId;
        const prevIds = nextProps.prevGameId.toArray();
        const prevId =  prevIds.length && prevIds[0].split('-')[3];

        const prevGameIds = nextProps.prevActiveId.toArray();
        const prevGameId = prevGameIds.length && prevGameIds[0].split('-')[3];
        const championGames = nextProps.rowData.games;
        const currGameId = activeIds.length && activeIds[0].split('-')[3];
        return prevGameId && _.find(championGames, (item) => item.gameId == prevGameId ) || currGameId && _.find(championGames, (item) => item.gameId == currGameId ) || prevId && _.find(championGames, (item) => item.gameId == prevId ) || false
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
        const { rowData, onSelected } = this.props;
        changeRowData(rowData);
        return (
          <View style={{ marginBottom: 10, flex: 1 }}>
            <Accordion 
                title={rowData.matchName}
                rightText={
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Text style={{ fontSize: 11, color: '#17A84B' }}> {moment(rowData.endTime).format('YYYY-MM-DD HH:mm')}  </Text>
                    </View>
                }
            >
                {rowData.games.length ? rowData.games.map((item, i) => {
                    console.log('item///', item)
                  const outrightKeys = Object.keys(item.odds);
                  const arr = [];
                  //console.log('pp', outrightKeys)
                  for (const id in outrightKeys) {
                      //console.log('id', )
                      if (id % 2 !== 0) continue;
                      const args = [outrightKeys[parseInt(id)], 'outright', item.odds[outrightKeys[id]].odds, item.gameId, item.odds[outrightKeys[id]].team].concat(item.parlayMin || [], item.parlayMax || []);
                     const evenArgs = [outrightKeys[parseInt(id) + 1], 'outright', item.odds[outrightKeys[parseInt(id) + 1]] && item.odds[outrightKeys[parseInt(id) + 1]].odds, item.gameId, item.odds[outrightKeys[parseInt(id) + 1]] && item.odds[outrightKeys[parseInt(id) + 1]].team].concat(item.parlayMin || [], item.parlayMax || []);
                      arr.push(<Row style={styles.rowView} key={parseInt(id)} >
                        <Col size={1} style={[styles.column, this.isActive(args) ? styles.activeViewClass : null]}>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                onSelected(args);
                            }}
                            style={styles.btnView}>
                            <View style={{ flex: 4 }}>
                                <Text style={[{ color: '#7D7D7D' }, this.isActive(args) ? styles.activeTextClass : null]}>{item.odds[outrightKeys[parseInt(id)]].team}</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={this.isActive(args) ? styles.activeTextClass : null}>{item.odds[outrightKeys[parseInt(id)]].odds}</Text>
                            </View>
                          </TouchableOpacity>
                        </Col>
                        <Col size={1} style={[styles.column, { borderLeftColor: '#EAEAEA', borderLeftWidth: StyleSheet.hairlineWidth }, this.isActive(evenArgs) ? styles.activeViewClass : null]}>
                          {item.odds[outrightKeys[parseInt(id) + 1]] ?
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => {
                                  onSelected(evenArgs);
                              }}
                              style={styles.btnView}>
                              <View style={{ flex: 4 }}>
                                 <Text style={[{ color: '#7D7D7D' }, this.isActive(evenArgs) ? styles.activeTextClass : null]}>{item.odds[outrightKeys[parseInt(id) + 1]].team}</Text>
                              </View>
                              <View style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={this.isActive(evenArgs) ? styles.activeTextClass : null}>{item.odds[outrightKeys[parseInt(id) + 1]].odds}</Text>
                              </View>
                            </TouchableOpacity>
                            :
                            <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
                              <Text style={{ color: '#7D7D7D' }}>/</Text>
                            </View>
                            }
                        </Col>
                      </Row>);
                  }
                  return (
                    <Grid style={{ marginHorizontal: 8 }} key={i}>
                      <Col style={{ paddingHorizontal: 10, paddingVertical: 5 }}><Text style={{ color: '#999999' }}>{item.gameType}</Text></Col>
                        {arr}
                    </Grid>
                  );
              })
                :
                null
                }
            </Accordion>
          </View>
        );
    }
}

const changeRowData = (rowData) => {
    rowData.games.length && rowData.games.map((obj) => {
        // console.log('obj', obj)
        for (const key in obj.outright) {
            if(parseFloat(obj.outright[key].odds) === 0) {
                delete obj.outright[key];
            }
        }
    });
}

const styles = StyleSheet.create({
    defaultTitle: {
        height: 40,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E3E3E3',
    },
    column: {
        
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    rowView: {
        backgroundColor: '#fff',
        
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#EAEAEA'
    },
    btnView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center'
    },
    activeViewClass: {
        backgroundColor: '#17A84B'
    },
    activeTextClass: {
        color: '#fff',
    }
});

