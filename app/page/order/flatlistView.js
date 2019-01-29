// 公共list部分
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { Icons, service, ErrorHandle, Action, constants, LoadMoreFooter } from '../mesosphere';
import { isDangerous, chooseStatus } from './enum';
import { Nodata } from '../../component/tips';

export default class FlatListView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datalist: [],
            refreshing: false,
            totalPage: 1,
            noDataStatus: false,
            isLoadAll: false,
            orderData: {}
        }
        this.pageIndex = 1;
        this.totalPage = 1;
        this.ballTypeId = 0;
        this.startTime = '';
        this.endTime = '';
    }
    clearData = () => {
        this.pageIndex = 1;
        this.totalPage = 1;
        this.setState({
            datalist: [],
            isLoadAll: false
        })
    }
    fetchData = (params) => {
        const { type, navigation } = this.props;
        const { datalist } = this.state;
        if(this.pageIndex > this.totalPage) {
            this.setState({ isLoadAll: true });
            return;
        }
        params && params.ballTypeId !== undefined ? this.ballTypeId = params.ballTypeId : null;
        params && params.period && params.period.startTime !== undefined ? this.startTime = params.period.startTime : null;
        params && params.period && params.period.endTime !== undefined ? this.endTime = params.period.endTime : null;
        service.getBetListService({ sportId: this.ballTypeId, status: type ? type : '', page: this.pageIndex, startTime: this.startTime, endTime: this.endTime })
        .then(res => {
            if(res.data.totalPage === 1) {
                this.setState({ isLoadAll: true });
            }
            if(res.data && res.data.result.length > 0) {
                this.totalPage = res.data.totalPage;
                this.setState({
                    datalist: this.pageIndex === 1 ? res.data.result : datalist.concat(res.data.result),
                    noDataStatus: false
                })
            } else {
                this.setState({
                    noDataStatus: true
                })
            }
            this.setState({
                refreshing: false,
                orderData: res.data
            })
        })
        .catch(err => {
            this.setState({
                refreshing: false,
                isLoadAll: null
            })
            err.navigation = navigation;
            ErrorHandle(err);
        })
    }
    renderItem = ({ item, index }) => {
        if (!item) return null;
        const invalidColor = item.status === 'cancel' ? { color: '#8F8F8F' } : null;
        const { navigation, initBindHandle } = this.props;
        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.6}
            onPress={() => {
                    navigation.navigate('BetDetails', { rowId: item.id, playType: item.playType, betNum: item.betNum, initBindHandle })
                }}
            style={[styles.itemView, item.status === 'cancel' ? { backgroundColor: '#F2F2F2' } : null]}>
            <View style={[styles.orderItem]}>
              {
                item.betNum === 1 ?
                    item.playType === 'outright' ? // 是否是冠军
                      <View>
                        <View style={{ flexDirection: 'row', paddingVertical: 3, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={[{ fontSize: 14, color: '#333' }, invalidColor]}><Icons style={styles.titleIcon} name="icon-medals" color={item.status === 'cancel' ? '#8F8F8F' : '#FB9709'} size={17} /> {item.matchName} </Text>
                        </View>   
                        <Text style={[{ paddingVertical: 3, marginLeft: 20 }, invalidColor]}>{item.gameType}</Text>
                        <View style={{ flexDirection: 'row', paddingVertical: 3, marginLeft: 20, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={invalidColor}>{item.betInfoString}</Text>
                                <Text style={[{ color: '#FF0000' }, invalidColor]}> @{item.odds}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                 {(item.status === 'wait' || item.status === 'cancel') && isDangerous(item.dangerous, item.remark)}
                            </View>
                        </View>
                      </View>
                    :
                    <View>
                        <View style={{ flexDirection: 'row', paddingVertical: 3, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={[{ fontSize: 14, color: '#333' }, invalidColor]}><Icons style={styles.titleIcon} name="icon-medals" color={item.status === 'cancel' ? '#8F8F8F' : '#FB9709'} size={17} /> {item.gameType} {item.inPlayNow === 'yes' ? '滚球' : null}{item.playTypeName} </Text>
                        </View>   
                        <Text style={[{ paddingVertical: 3, marginLeft: 20, color: '#333' }, invalidColor]}>{item.homeName} vs {item.guestName}</Text>
                        <View style={{ flexDirection: 'row', paddingVertical: 3, marginLeft: 20, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>  
                                <Text style={[ {color: '#333'}, invalidColor ]}>{item.betInfoString}</Text>
                                <Text style={[{ color: '#FF0000' }, invalidColor]}> @{item.odds}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                {(item.status === 'wait' || item.status === 'cancel') && isDangerous(item.dangerous, item.remark)}
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: 20, justifyContent: 'space-between' }}>
                            <Text>实际盈亏</Text>
                            <Text>{item.bonusNoPrincipal}</Text>
                        </View>
                    </View>
                :
                <View>
                  <View style={{ flexDirection: 'row', paddingVertical: 3, alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={[{ fontSize: 14, color: '#333' }, invalidColor]}><Icons style={styles.titleIcon} name="icon-medals" color={item.status === 'cancel' ? '#8F8F8F' : '#FB9709'} size={17} /> 综合过关</Text>
                  </View>
                  <View style={{ flexDirection: 'row', paddingVertical: 3, marginLeft: 20, justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>  
                      <Text style={invalidColor}>{item.betNum}串1</Text>
                    </View>
                    <Text style={invalidColor}>已结束: {item.haveResult}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginLeft: 20, justifyContent: 'space-between' }}>
                     <Text>实际盈亏</Text>
                     <Text>{item.bonusNoPrincipal}</Text>
                  </View>
                </View>
              }
            </View>
            <View style={{ paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[{ color: '#333', marginLeft: 20 }, invalidColor]}>下注:{item.betAmount}元</Text>
                {item.betNum > 1 && item.status !== 'win' ? <Text>  可赢{item.toWin}元</Text> : null}
              </View>
              {chooseStatus(item.status)}
              {item.status === 'win' ? <Text style={{ color: '#FF0000', fontWeight: 'bold' }}>中奖{item.bonus}元</Text> : null}
            </View>
          </TouchableOpacity>
        );
    }
    onRefresh = () => {
        this.pageIndex = 1;
        this.setState({
            refreshing: true
        }, () => {
            this.fetchData();
        })
    }
    handleLoadMore = () => {
        this.pageIndex ++;
        this.fetchData();
    }
    renderFooter = () => {
        const { isLoadAll } = this.state;
        return <LoadMoreFooter isLoadAll={isLoadAll} />
    }
    renderHeader = () => {
        const { orderData } = this.state;
        const sum = orderData.totalActualBonus || 0;
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 30, alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 10, marginBottom: 5, borderRadius: 5 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: '#333' }}>投注量:</Text>
                    <Text style={{ color: '#00AC3C' }}>{ orderData.totalBetAmount || 0 }</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: '#333' }}>盈亏量:</Text>
                    <Text style={{ color: '#00AC3C' }}>{ sum > 0 ? '+': '' }{sum}</Text>
                </View>
            </View>
        )
    }
    render() {
        const { datalist, refreshing, noDataStatus } = this.state;
        return (
            <View style={{ flex: 1 }}>
                {
                    noDataStatus? <Nodata onRefresh={this.fetchData} refreshing={refreshing}/>
                    :
                    <FlatList
                        data={datalist}
                        renderItem= {this.renderItem}
                        refreshing= {refreshing}
                        onEndReached={this.handleLoadMore}
                        ListHeaderComponent={this.renderHeader}
                        ListFooterComponent = {this.renderFooter}
                        onEndReachedThreshold={0.1}
                        style={{ flex: 1, backgroundColor: '#F5F5F9' }}
                        onRefresh = {this.onRefresh}
                        keyExtractor={(item, index) => {
                            return index;
                        }}
                    />
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    orderItem: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#ddd',
        borderStyle: 'solid',
        borderLeftWidth: 0,
        borderTopWidth: 0,
        paddingBottom: 5
        // marginTop: 5,
    },
    itemView: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 5
    },
    invalidColor: {
        color: '#8F8F8F'
    },
    titleIcon: {
        marginTop: 5
    }
});