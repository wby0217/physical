// 比赛结果

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Platform,
    NativeModules
} from 'react-native';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
const moment = require('moment');
import { withNavigationFocus } from 'react-navigation-is-focused-hoc';
import { Icons, service, ErrorHandle, Action, constants, LoadMoreFooter, Header, showToast } from '../mesosphere';
import { Nodata, OverlaySpinner } from '../../component/tips';
import DownPopover from '../../component/down-popover';
import Accordion from '../../component/Accordion';
import matchTypeConfig from './matchTypeConf';
import NavTitleForResult from './navTitle';
import BallTab from './ballTab';
import weeks from './weekday';

const isIPhoneX = NativeModules.DeviceInfo.isIPhoneX_deprecated;
const rowHeight = 26;
const { width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';
const layerHeight = isIOS? isIPhoneX ? 114 : 104 : 94;
class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateStr: moment().format('YYYY-MM-DD'),
            selectedball: {
                engName: 'football',
                name: '足球'
            },
            selectedMatchType: {
                name: '联赛',
                type: 'match'
            },
            data: [],
            refreshing: false,
            noData: false,
            isLoadAll: false,
            weekDays: [-6, -5, -4, -3, -2, -1, 0],
            activeDayIndex: 0 // 默认选中今天
        }
        this.pageIndex = 0;
        this.totalPage = 1;
    }
    // componentWillReceiveProps(nextProps) {
    //     const { isFocused } = this.props;
    //     if(nextProps.isFocused !== isFocused && nextProps.isFocused) {
    //         console.log('=========比赛结果')
    //         this.pageIndex = 0;
    //         this.setState({ isLoadAll: false, data: [] }, () => this.fetchData() )
    //     }
    // }
    componentDidMount() {
        this.setState({ isLoadAll: false }, () => this.fetchData());
    }
    fetchData = () => {
        const { selectedball, selectedMatchType, dateStr, data } = this.state;
        if(this.pageIndex > this.totalPage) {
            this.setState({ isLoadAll: true });
            return;
        }
        service.getMatchResultService({
            sport: selectedball.engName,
            type: selectedMatchType.type,
            date: dateStr,
            page: this.pageIndex
        })
        .then(res => {
            if(res.data && res.data.result.length) {
                this.setState({
                    data: this.pageIndex === 1 ? res.data.result : data.concat(res.data.result),
                    noData: false,
                    refreshing: false
                })
                this.totalPage = res.data.totalPage;
                if(this.totalPage === 1) { this.setState({ isLoadAll: null }) }
            } else {
                this.setState({
                    noData: true,
                    data: [],
                    refreshing: false
                })
            }
        })
        .catch(err => {
            this.setState({
                isLoadAll: <Text>加载失败</Text>,
                refreshing: false
            }, () => console.log(err))
        })
    }
    getDate = (date) => {
        this.setState({
            dateStr: date,
            isLoadAll: false,
            activeDayIndex: moment(date).diff(moment(), 'days'),
            data: [],
            noData: false,
            refreshing: true
        },() => {
            this.pageIndex = 1;
            this.fetchData();
        })
    }
    prevDay = () => {
        // 上一天的方法
        const { dateStr } = this.state;
        const prevDay = moment(dateStr).subtract(1, 'days').format('YYYY-MM-DD');
        this.setState({
            dateStr: prevDay,
            isLoadAll: false,
            data: []
        }, () => {
            this.pageIndex = 1;
            this.fetchData();
        })
    }
    nextDay = () => {
        // 下一天的方法
        const { dateStr } = this.state;
        const nextDay = moment(dateStr).add(1, 'days').format('YYYY-MM-DD');
        this.setState({
            dateStr: nextDay,
            isLoadAll: false,
            data: []
        }, () => {
            this.pageIndex = 1;
            this.fetchData();
        })
    }
    setSelectedBallType = (item) => {
        this.setState({
            selectedball: item,
            isLoadAll: false,
            refreshing: true,
            noData: false,
            data: []
        },() => {
            this.pageIndex = 1;
            this.fetchData();
        })
    }
    setSelectedMatchType = (item) => {
        this.setState({
            selectedMatchType: item,
            isLoadAll: false,
            refreshing: true,
            noData: false,
            data: []
        },() => {
            this.pageIndex = 1;
            this.fetchData();
        })
    }
    dateScreenHandler = (id) => {
        const selDate = moment().add(id, 'days').format('YYYY-MM-DD');
        this.setState({
            dateStr: selDate,
            activeDayIndex: id,
            data: [],
            refreshing: true,
            noData: false,
        }, () => {
            this.pageIndex = 1;
            this.fetchData();
        })
    }
    renderItem = ({ item }) => {
        const { navigation } = this.props;
        const { selectedMatchType, selectedball } = this.state;
        if(selectedMatchType.type === 'match') {
            return (
                <Accordion
                    title={item.matchName}
                    rightText = {
                        selectedball.engName === 'tennis' ?
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text style={{ color: '#999' }}>完赛</Text>
                            <Text style={{ color: '#999' }}>让局</Text>
                        </View>:
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text style={{ color: '#999' }}>全场</Text>
                            <Text style={{ color: '#999' }}>{selectedball.engName === 'basketball' ? '加时' : '上半场' }</Text>
                        </View>
                    }
                    icon = {
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={require('../../assets/images/icon_cup.webp')} style={{ height: 19, resizeMode: 'contain', marginTop: -5 }} />
                        </View>
                    }
                    containerStyle={{ marginTop: 10, marginBottom: -5 }}
                >
                    {
                    item.schedule && item.schedule.length > 0 ? item.schedule.map(( obj, i ) =>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                key={i}
                                onPress={
                                    () => {
                                        navigation.navigate('ResultDetails', { sport: selectedball.engName, type: selectedMatchType.type, gameId: obj.gameId })
                                    }
                                }
                            >
                                <View style={[{ flexDirection: 'row', backgroundColor: '#fff', borderBottomColor: '#EAEAEA', borderBottomWidth: 1 }, i === 0 ? { marginTop: 6 } : null]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 3 }}>
                                            <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center',  borderRightColor: '#EAEAEA' }}>
                                                <Text style={{ fontSize: 12, color: '#999999' }}>{moment(obj.beginTime).format('MM-DD')}{'\n'}{moment(obj.beginTime).format('HH:mm')}</Text>
                                            </View>
                                            <View  style={{ flex: 7, justifyContent: 'center', borderLeftColor: '#EAEAEA', borderLeftWidth: 1, paddingLeft: 10, paddingVertical: 10 }}>
                                                {
                                                    obj.gameType ?
                                                     <View style={{ height: 18, justifyContent: 'center' }} >
                                                        <Text style={{ color: '#004BA3', fontSize: 10 }}>{obj.gameType}</Text>
                                                    </View> : null
                                                }
                                                <View style={{ justifyContent: 'center', paddingVertical: 5 }}>
                                                    <Text>{obj.homeName}</Text>
                                                </View>
                                                <View style={{ justifyContent: 'center', paddingVertical: 5 }}>
                                                    <Text>{obj.guestName}</Text>
                                                </View>
                                            </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 2, justifyContent: 'space-between' }}>
                                        <View style={{ flex: 8 }}>
                                            {(()=> {
                                                const resultTitle = (isNaN(obj.homeScore) && isNaN(obj.homeScore1h) ? obj.homeScore : isNaN(obj.homeScore) ? `全场:${obj.homeScore}`: obj.homeScore1h && isNaN(obj.homeScore1h) ? `上半场: ${obj.homeScore1h}`:null);
                                                return resultTitle ? 
                                                <View style={{ height: 18, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{ color: '#004BA3', fontSize: 12 }}>{resultTitle}</Text>
                                                </View>
                                                : null
                                            })()}
                                            <View style={{ flexDirection: 'row',  alignItems: 'center', paddingVertical: 5 }}>
                                                <View style={{ flex: 1, alignItems: 'center' }}>
                                                    <Text style={{ color: '#333', fontWeight: 'bold' }}>{isNaN((obj.homeScore)) || !obj.homeScore ? '/': obj.homeScore }</Text>
                                                </View>
                                                <View style={{ flex: 1, alignItems: 'center' }}>
                                                    {
                                                        selectedball.engName === 'tennis' ?
                                                        <Text style={{ color: '#333' }}>{isNaN((obj.homeScoreHandicap)) || !obj.homeScoreHandicap ? isNaN(obj.homeScoreOt) || !(obj.homeScoreOt) ? '/': obj.homeScoreOt  : obj.homeScoreHandicap }</Text>:
                                                        <Text style={{ color: '#333' }}>{isNaN((obj.homeScore1h)) || !obj.homeScore1h ? isNaN(obj.homeScoreOt) || !(obj.homeScoreOt) ? '/': obj.homeScoreOt  : obj.homeScore1h }</Text>
                                                    }
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                                                <View style={{ flex: 1, alignItems: 'center' }}>
                                                    <Text style={{ color: '#333', fontWeight: 'bold' }}>{isNaN((obj.guestScore)) || !obj.guestScore ? '/' : obj.guestScore }</Text>
                                                </View>
                                                <View style={{ flex: 1, alignItems: 'center' }}>
                                                {
                                                    selectedball.engName === 'tennis' ?
                                                    <Text style={{ color: '#333' }}>{isNaN((obj.guestScoreHandicap)) || !obj.guestScoreHandicap ? isNaN(obj.guestScoreOt) || !(obj.guestScoreOt) ? '/': obj.guestScoreOt : obj.guestScoreHandicap }</Text>
                                                    :
                                                    <Text style={{ color: '#333' }}>{isNaN((obj.guestScore1h)) || !obj.guestScore1h ? isNaN(obj.guestScoreOt) || !(obj.guestScoreOt) ? '/': obj.guestScoreOt : obj.guestScore1h }</Text>
                                                }
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flex: 2.4, alignItems: 'center' }}>
                                            <View style={{ flexDirection: 'column', borderWidth: 1, borderColor: '#DDDDDD', paddingVertical: 5, paddingHorizontal: 2, borderRadius: 8 }}>
                                                <Text style={{ fontSize: 12, color: '#999' }}>全{'\n'}部</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                    ) : null
                    }
                    </Accordion>
            )
        } else {
            return (
                <Accordion
                    title={item.matchName}
                    icon = {
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={require('../../assets/images/icon_cup.webp')} style={{ height: 19, resizeMode: 'contain', marginTop: -5 }} />
                        </View>
                    }
                    containerStyle={{ marginTop: 10 }}
                >
                    {
                    item.games && item.games.length > 0 ? item.games.map(( obj, i ) =>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                key={i}
                                onPress={
                                    () => {
                                        navigation.navigate('ResultDetails', { sport: selectedball.engName, type: selectedMatchType.type, gameId: obj.gameId })
                                    }
                                }
                            >
                                <View style={[{ flexDirection: 'row', backgroundColor: '#fff', borderBottomColor: '#EAEAEA', borderBottomWidth: 1 }, i === 0 ? { marginTop: 6 } : null]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 3 }}>
                                            <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center',  borderRightColor: '#EAEAEA' }}>
                                                <Text style={{ fontSize: 10, color: '#999999' }}>{moment(obj.endTime).format('MM-DD')}{'\n'}{moment(obj.endTime).format('HH:mm')}</Text>
                                            </View>
                                            <View  style={{ flex: 7, justifyContent: 'center', borderLeftColor: '#EAEAEA', borderLeftWidth: 1, paddingLeft: 10 }}>
                                                <View style={{ justifyContent: 'center', paddingVertical: 15 }}>
                                                    <Text>{obj.gameType}</Text>
                                                </View>
                                            </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 2, justifyContent: 'space-between' }}>
                                        <View style={{ flex: 8 }}>
                                            {
                                                obj.result && obj.result.length > 0 ? obj.result.map((n, num) =>
                                                    <View key={ num } style={{ flex: 1, justifyContent: 'center',  }}>
                                                        <Text style={{ color: '#333' }}>{ n }</Text>
                                                    </View>
                                                )
                                                : null
                                            }
                                        </View>
                                        <View style={{ flex: 2, alignItems: 'center' }}>
                                            <View style={{ flexDirection: 'column', borderWidth: 1, borderColor: '#DDDDDD', paddingVertical: 5, paddingHorizontal: 2, borderRadius: 8 }}>
                                                <Text style={{ fontSize: 10, color: '#999' }}>全{'\n'}部</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                    ) : null
                    }
                    </Accordion>
            )
        }
    }
    handleLoadMore = () => {
        this.pageIndex ++;
        this.fetchData();
    }
    onRefresh = () => {
        this.pageIndex = 1;
        this.setState({
            data: [],
            isLoadAll: null
        }, () => {
            this.fetchData();
        })
    }
    renderFooter = () => {
        const { isLoadAll } = this.state;
        return <LoadMoreFooter isLoadAll={isLoadAll} />
    }
    render() {
        const { dateStr, selectedball, selectedMatchType, data, refreshing, noData, weekDays, activeDayIndex } = this.state;
        const { navigation } = this.props;
        return (
           <View style={styles.container}>
               <Header
                    navigation={navigation}
                    headerLeft={null}
                    headerCenter={() => <NavTitleForResult onTouch={this.setSelectedMatchType}/>}
                    headerRight={() =>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('SearchPage', { selectedball, selectedMatchType, dateStr });
                                }}
                            >
                                <Image source={require('../../assets/images/search_icon.png')} style={{ width: 20, height: 20, resizeMode: 'contain' }}/>
                            </TouchableOpacity>}
               />
                <BallTab onTouch={this.setSelectedBallType}/>
                <View style={{ flexDirection: 'row', justifyContent: 'center', height: 40, alignItems: 'center', backgroundColor: '#fff' }}>
                    <TouchableOpacity
                        onPress={this.prevDay}
                        style={{ paddingHorizontal: 10 }}
                    >
                        <Icon name="angle-left" size={24} color="#999999" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}
                        onPress={() => {
                            this.datePicker && this.datePicker.onPressDate();
                        }}
                    >
                        <Icons name="icon-calendar"  size={16} color="#666666" />
                        <DatePicker
                            mode="date"
                            format="YYYY-MM-DD"
                            customStyles={{dateIcon: { display: 'none' }, dateInput: { borderWidth: 0}}}
                            onDateChange={this.getDate}
                            placeholder="请选择存款日期"
                            date= {dateStr}
                            style={{ width: 90, alignItems: 'center' }}
                            maxDate={moment().format('YYYY-MM-DD')}
                            ref={(ref) => this.datePicker = ref}
                        />
                        <Text style={{ color: '#333333' }}>{weeks[moment(dateStr).day()]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.nextDay}
                        style={{ paddingHorizontal: 10 }}
                    >
                        <Icon name="angle-right" size={24} color="#999999" />
                    </TouchableOpacity>
                </View>
                {
                    noData ?
                    <Nodata onRefresh={this.onRefresh} />:
                    <FlatList
                        data={data}
                        extraData={this.state}
                        renderItem= {this.renderItem}
                        ListFooterComponent = {this.renderFooter}
                        refreshing= {false}
                        onEndReached={this.handleLoadMore}
                        onEndReachedThreshold={0}
                        style={{ flex: 1 }}
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
    container: {
        flex: 1,
        backgroundColor: '#F5F5F9'
    },
    chooseTitle: {
        flexDirection: 'row',
        height: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderBottomColor: '#E7E7E7',
        borderBottomWidth: 1,
    },
    chooseTitleView: {
        flex: 3,
        borderRightWidth: 1,
        borderRightColor: '#E7E7E7',
        flexDirection: 'row',
        height: 30,
        alignItems: 'center'
    },
    timeChooseView: {
        flex: 2,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    accordionTitle: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    ballShadeBox: {
        flex: 1,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})
const mapStateToProps = (state) => {
    return {
        saveUpdateUser: state.match.saveUpdateUser,
        isLogin: state.match.saveUpdateUser.isLogin
    }
}
export default withNavigationFocus(connect(mapStateToProps)(Result), 'Result');