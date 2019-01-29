// 注单详情

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Clipboard
} from 'react-native';
import { Icons, service, ErrorHandle, Action, constants, showToast } from '../mesosphere';
import { calculateResult } from './enum';

const { width, height } = Dimensions.get('window');
export default class BetDeatails extends Component {
    static navigationOptions = ({ navigation }) => {
        return ({
            header: null,
        })
    }
    constructor(props){
        super(props)
        this.state = {
            data: {}
        }
    }
    componentDidMount() {
        this.fetchData();
    }
    fetchData = () => {
        const { rowId } = this.props.navigation.state.params;
        service.getBetDetailsService({ id: rowId })
        .then(res => {
            this.setState({
                data: res.data
            })
        })
        .catch(err => {
            ErrorHandle(err)
        })
    }
    setClipboard = () => {
        // 设置剪贴板
        Clipboard.setString(this.state.data.orderNo);
        showToast('注单号复制成功!');
    }
    render() {
        const { navigation } = this.props;
        const { playType, betNum } = navigation.state.params;
        const startReg = /^1h/;
        const { data } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={require('../../assets/images/bet_bg.png')} style={{ width, height }}>
                    <View style={{ height: 90, backgroundColor: 'rgba(0,0,0,0)', flexDirection: 'column', marginBottom: 25 }}>
                        <View style={{ height: 55, justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                style={{ paddingVertical: 5, paddingHorizontal: 15 }}
                                onPress={
                                    () => {
                                        navigation.goBack()
                                    }}
                                >
                                <Icons name="icon-back-normal" color="#ffffff" size={22} />
                            </TouchableOpacity>
                        </View>
                        {betNum > 1 ?
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', flex: 1, }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>{betNum}串一</Text>
                        </View>
                        :
                        playType !== 'outright' ?
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1, paddingHorizontal: 5 }}>
                            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}><Text style={styles.title}>{data.homeName}</Text></View>
                            <View style={[styles.cycle, { marginHorizontal: 5 }]}>
                                <Text style={{ color: '#17A84B' }}>VS</Text>
                            </View>
                            <View style={{ flex: 1, }}><Text style={styles.title}>{data.guestName}</Text></View>
                        </View>
                        :
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', flex: 1, }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>{data.matchName}</Text>
                        </View>
                        }
                    </View>
                    <ScrollView style={{ marginBottom: 30 }}>
                        {betNum > 1 ?
                        <View>
                            <View style={{ marginHorizontal: 15, backgroundColor: '#fff', paddingVertical: 35, borderRadius: 5 }}>
                            <View style={{ paddingTop: 15, borderBottomColor: '#D6D6D6' }}>
                                <View style={[styles.textRow, { backgroundColor: '#F7F7F7' }]}>
                                    <Text style={styles.listText}>下注金额</Text>
                                    <Text style={styles.listText}>{data.betAmount || 0}</Text>
                                </View>
                                <View style={[styles.textRow]}>
                                      <Text style={styles.listText}>可赢金额</Text>
                                      <Text style={styles.listText}>{data.toWin || 0}</Text>
                                </View>
                                <View style={[styles.textRow, { backgroundColor: '#F7F7F7' }]}>
                                    <Text style={styles.listText}>返水比例</Text>
                                    <Text style={styles.listText}>{data.rebateRatio ? `${data.rebateRatio}%` : '/'}</Text>
                                </View>
                                <View style={[styles.textRow]}>
                                    <Text style={styles.listText}>返水金额</Text>
                                    <Text style={styles.listText}>{data.rebateAmount || 0}</Text>
                                </View>
                                <View style={[styles.textRow, { backgroundColor: '#F7F7F7' }]}>
                                    <Text style={styles.listText}>结算结果</Text>
                                    <Text style={styles.listText}>{data.bonus || 0}</Text>
                                </View>
                                <View style={[styles.textRow]}>
                                    <Text style={styles.listText}>实际盈亏</Text>
                                    <Text style={styles.listText}>{data.bonusNoPrincipal || 0}</Text>
                                </View>
                                <View style={[styles.textRow, { backgroundColor: '#F7F7F7' }]}>
                                    <Text style={styles.listText}>下注时间</Text>
                                    <Text style={styles.listText}>{data.betTime || '/'}</Text>
                                </View>
                            </View>
                        </View>
                            {data.betInfo && data.betInfo.length ? data.betInfo.map((obj, i) =>
                            <View key={i} style={{ backgroundColor: '#fff', marginHorizontal: 15, borderRadius: 5, padding: 15, marginTop: 8 }}>
                                <View style={{ flexDirection: 'row', paddingVertical: 3, alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={[{ fontWeight: 'bold' }]}>综合过关</Text>
                                </View>
                                <Text style={[{ paddingVertical: 5 }]}>{obj.playTypeName}</Text>
                                <Text style={[{ paddingVertical: 5 }]}>{obj.matchName}</Text>
                                <Text style={[{ paddingVertical: 5 }]}>{obj.homeName} VS {obj.guestName}</Text>
                                <View style={{ flexDirection: 'row', paddingVertical: 3, justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', flex: 10 }}>
                                        <Text>{obj.betInfoString}@<Text style={[{ color: '#FF0000' }]}>{obj.odds}</Text></Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', flex: 3, justifyContent: 'flex-end' }}>
                                        <Text style={{ fontWeight: 'bold' }}>{calculateResult()[obj.calculateResult]}</Text>
                                    </View>
                                </View>
                                {obj.gameType ?
                                    <Text style={[{ paddingVertical: 5 }]}>{obj.gameType}</Text>
                                    :
                                    null
                                }
                                <Text style={[{ paddingVertical: 5 }]}>开赛时间:{obj.beginTime}</Text>
                            </View>
                            )
                            :
                            null}
                        </View>
                        :
                        <View style={{ marginHorizontal: 15, backgroundColor: '#fff', paddingVertical: 35, borderRadius: 5 }}>
                            <View style={{ paddingBottom: 10, borderBottomColor: '#f7f7f7', borderBottomWidth: StyleSheet.hairlineWidth }}>
                            <View style={[styles.textRow, { backgroundColor: '#F7F7F7' }]}>
                                <Text style={styles.listText}>联赛</Text>
                                <Text style={styles.listText}>{data.matchName || '/'}</Text>
                            </View>
                            {playType !== 'outright' ?
                                <View>
                                <View style={[styles.textRow]}>
                                    <Text style={[ styles.listText, { flex: 1 } ]}>球队</Text>
                                    <Text style={[styles.listText, { flex: 6, textAlign: 'right' }]} numberOfLines={1} >{data.homeName}VS{data.guestName}</Text>
                                </View>
                                <View style={[styles.textRow, { backgroundColor: '#F7F7F7' }]}>
                                    <Text style={styles.listText}>类型</Text>
                                    <Text style={styles.listText}> {data.gameType ? data.gameType : (startReg.test(data.playType) ? '半场' : '全场' || '/')}</Text>
                                </View>
                                </View>
                                :
                                null
                            }
                            <View style={[styles.textRow]}>
                                    <Text style={styles.listText}>玩法</Text>
                                    {playType === 'outright' ?
                                    <Text>{data.gameType || '/'}</Text>
                                    :
                                    <Text>{data.inPlayNow === 'yes' ? '滚球' : null}{data.playTypeName || '/'}</Text>
                                    }
                                </View>
                            <View style={[styles.textRow, { backgroundColor: '#F7F7F7' }]}>
                                <Text style={styles.listText}>投注</Text>
                                <Text style={styles.listText}>{data.betInfoString}@<Text style={{ color: '#FF0000' }}>{data.odds || 1}</Text></Text>
                            </View>
                            <View style={[styles.textRow]}>
                                <Text style={styles.listText}>可赢金额</Text>
                                <Text style={styles.listText}>{data.toWin || 0}</Text>
                            </View>
                            <View style={[styles.textRow, { backgroundColor: '#F7F7F7' }]}>
                                <Text style={styles.listText}>结果</Text>
                                <Text style={styles.listText}>{(data.bonus || 0)}</Text>
                            </View>
                            <View style={[styles.textRow]}>
                                <Text style={styles.listText}>实际盈亏</Text>
                                <Text style={styles.listText}>{(data.bonusNoPrincipal || 0)}</Text>
                            </View>
                            </View>
                            <View style={{ paddingTop: 15, borderBottomColor: '#D6D6D6' }}>
                            <View style={[styles.textRow, { backgroundColor: '#F7F7F7' }]}>
                                <Text style={styles.listText}>下注金额</Text>
                                <Text style={styles.listText}>{(data.betAmount || 0)}</Text>
                            </View>
                            <View style={[styles.textRow]}>
                                <Text style={styles.listText}>返水金额</Text>
                                <Text style={styles.listText}>{(data.rebateAmount || 0)}</Text>
                            </View>
                            <View style={[styles.textRow, { backgroundColor: '#F7F7F7' }]}>
                                <Text style={styles.listText}>返水比例</Text>
                                <Text style={styles.listText}>{data.rebateRatio ? `${data.rebateRatio}%` : '/'}</Text>
                            </View>
                            {playType !== 'outright' ?
                                <View>
                                <View style={[styles.textRow]}>
                                    <Text style={styles.listText}>半场赛果</Text>
                                    <Text style={styles.listText}>{data['1hResult'] || '/'}</Text>
                                </View>
                                <View style={[styles.textRow, { backgroundColor: '#F7F7F7' }]}>
                                    <Text style={styles.listText}>全场赛果</Text>
                                    <Text style={styles.listText}>{data.result || '/'}</Text>
                                </View>
                                </View>
                                :
                                data.result && data.result.length > 1 ?
                                <View>
                                <View style={[styles.textRow]}>
                                    <Text style={styles.listText}>赛果</Text>
                                </View>
                                <View style={[{ backgroundColor: '#F7F7F7', flexWrap: 'wrap', flexDirection: 'row' }]}>
                                    {data.result.map((item) =><View style={{ width: width / 2.2, height: 30, justifyContent: 'center', alignItems: 'center' }}><Text style={{ alignItems: 'center' }}>{item || '/'}</Text></View>)}
                                </View>
                                </View>
                                :
                                <View style={[styles.textRow]}>
                                <Text style={styles.listText}>赛果</Text>
                                <Text style={styles.listText}>{data.result || '/'}</Text>
                                </View>
                            }
                            <View style={[styles.textRow]}>
                                <Text style={styles.listText}>投注时间</Text>
                                <Text style={styles.listText}>{data.betTime || '/'}</Text>
                            </View>
                            </View>
                        </View>
                        }
                    </ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', top: - (height - 130) }}>
                        <View style={{ backgroundColor: '#17A84B', paddingHorizontal: 30, paddingVertical: 7, borderRadius: 10 }}>
                            <Text style={{ color: '#fff', flexDirection: 'row' }}>
                                <Text style={{ fontWeight: 'bold' }}>注单号 </Text>
                                <Text selectable>{this.state.data.orderNo || '/'}</Text>
                            </Text>
                            <TouchableOpacity
                                onPress={this.setClipboard}
                                style={{
                                    position: 'absolute',
                                    right: 6, top: 4,
                                    padding: 4
                                }}
                            >
                                <Icons name="icon-rule-list" size={14} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
                <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    const params = {id: data.sportId, engName: data.sportEngName, name: data.sportName };
                    const routeNames = ['Main', { routeName: 'Match', params }];
                    navigation.dispatch(Action.changeEventTypeIndex(0));
                    navigation.dispatch(Action.selectedBallInfo(params));
                    navigation.dispatch(Action.checkAllianceId(0));
                    navigation.dispatch(Action.resetRoutesByNames(routeNames));
                    navigation.dispatch(Action.toggleEventType({typeEngName: data.eventType, typeName: data.eventTypeName}));
                }}
                style={styles.footerBtn}>
                    <Text style={{ color: '#734217', fontSize: 16, fontWeight: 'bold' }}>去投注</Text>
                </TouchableOpacity>
                <View style={{ height: 45 }}></View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    title: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    cycle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0,
        marginHorizontal: 5
    },
    textRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 30,
        alignItems: 'center'
    },
    footerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        backgroundColor: '#FFE400',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
    listText: {
      fontSize: 14,
      color: '#333'
    }
});