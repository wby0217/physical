import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Animated,
    Easing,
    Image
} from 'react-native';
import _ from 'lodash';
const md5 = require('md5');
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import DownPopover from '../../../component/down-popover';
import ScrollableTabCustomer from './scrollableTabView';
import NavTitle from './navtitle';
import NavRight from './navRight';
import TooltipMenuItem from './filterModalItem';
import { service, ErrorHandle, Action, Header, Icons, constants, showToast } from '../../mesosphere';
import Balls from './ballsComponent';
import CountDown from './countDown';
import SideBar from '../sideBar';

const { width, height } = Dimensions.get('window');
const containerStyle = { width, top: 6, right: 0, flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, paddingTop: 15, justifyContent: 'space-between' };
const masterText = ['主要盘口', '所有盘口'];
const masterVal = ['no', 'yes'];
const periodVal = ['yes', 'no'];
class MatchDetails extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const { params } = state;
        return ({
            header: null,
        })
    }
    constructor(props) {
        super(props)
        const { params } = props.navigation.state;
        this.state = {
            eventypeTipVisible: false,
            orderTipVisible: false,
            selectEventType: props.matchEventType || {typeEngName: 'today', typeName: '今日赛事'},
            eventTypeArr: [],
            EventTypeIndex: props.EventTypeIndex || 0,
            buttonRect: {},
            isTimeout: false, //倒计时或者手动是否刷新
            tabs:[],
            periodIndex: 0,
            masterIndex: 0
        }
        this.navTitleTouch = this.navTitleTouch.bind(this);
        this.orderPressHandle = this.orderPressHandle.bind(this);
        this.screenPressHandle = this.screenPressHandle.bind(this);
    }
    componentDidMount() {
        this.loadNavTitle();
        const { navigation } = this.props;
        storage.load({
            key: 'playType',
            id: navigation.state.params.id
        })
        .then(data => {
            this.setState({ tabs: data })
        })
        .catch(ErrorHandle)
    }
    loadNavTitle = () => {
        const { navigation } = this.props;
        storage.load({
            key: 'evenType',
            id: navigation.state.params && navigation.state.params.id
        }).then(ret => {
            this.setState({
                eventTypeArr: ret
            })
        }).catch(err => {
            ErrorHandle(err);
        });
    }
    navTitleTouch (ref) {
        const { eventTypeArr } = this.state;
        this.setState({
            eventypeTipVisible: !this.state.eventypeTipVisible
        })
        if(!eventTypeArr.length) {
            this.loadNavTitle();
        }
    }
    pressSelect (item) {
        const { navigation } = this.props;
        this.setState({
            selectEventType: item
        },() => {
            this.restartRefresh();
            this.navTitleTouch();
            navigation.dispatch(Action.changeEventTypeIndex(0));
            navigation.setParams({ selectEventType: item });
            navigation.dispatch(Action.toggleEventType(item));
        })
    }
    orderPressHandle(ref) {
        // 排序按钮事件
        // if(this.button && this.button.measure) {
        //     this.button.measure((ox, oy, width, height, px, py) => {
        //         this.setState({
        //             orderTipVisible: !this.state.orderTipVisible,
        //             buttonRect: { x: px, y: py }
        //         });
        //     });
        // }
        ref && typeof (ref) === 'function' && ref();
        this.sideBar && this.sideBar.modalSwitchHanlder();
    }
    screenPressHandle() {
        // 根据联盟帅选排序
        this.orderPressHandle();
        const { navigation, updateBetTimer } = this.props;
        this.clearRefreshTimer();
        navigation.navigate('Screening', { ...navigation.state.params, countDown: this.restartRefresh });
    }
    headerCenter = () => {
        const { selectEventType } = this.state;
        return (
            <NavTitle press={this.navTitleTouch} title={selectEventType} />
        )
    }
    headerRight = () => {
        const { navigation } = this.props;
        const { selectEventType } = this.state;
        const times = (selectEventType.typeEngName == 'in_play_now' ? 30 : 180);
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center'}}> 
                <CountDown countOverHandler={this.spin} times={times} ref={ ref => this.countDownRef = ref } />
                <TouchableOpacity
                    ref={ref => this.button = ref}
                    style={[{ marginLeft: 10, padding: 5 }]}
                    onPress={this.orderPressHandle}
                >
                    <Icons name="icon-more-list" color="#fff" size={24} />
                </TouchableOpacity>
            </View>
        )
    }
    convertDisplayTime = (timer) => {
        if(timer) {
            timer = Number(timer);
            if( timer / 60 < 1 ) {
                return timer;
            } else {
               return `${Math.floor(timer / 60)}’`
            }
        }
        return timer;
    }
    spin = async () => {
        const { refreshAction } = this.props;
        refreshAction && refreshAction();
    }
    restartRefresh = () => {
        this.countDownRef && this.countDownRef.startRefresh && this.countDownRef.startRefresh();
    }
    clearRefreshTimer = () => {
        this.countDownRef && this.countDownRef.pauseRefresh && this.countDownRef.pauseRefresh();
    }
    headerLeft = () => {
        const { navigation } = this.props;
        return (
            <TouchableOpacity
                onPress={() => {
                    this.clearRefreshTimer();
                    navigation.goBack();
                }}
                style={{ backgroundColor: 'transparent' }}
            >
                <Icons name="icon-back-normal" color="#ffffff" size={22} />
            </TouchableOpacity>
        )
    }
    onChangeTab = (index) => {
        const { navigation, betTimer } = this.props;
        clearTimeout(betTimer);
        this.restartRefresh();
        navigation.dispatch(Action.checkAllianceId(0));
        navigation.dispatch(Action.changeEventTypeIndex(index.i));
    }
    render() {
        const { navigation, timeAsc, matchAsc, orderStatus, betTimer, EventTypeIndex, masterSort, periodSort } = this.props;
        const { eventypeTipVisible, eventTypeArr, selectEventType, orderTipVisible, buttonRect, tabs } = this.state;
        const { engName } = navigation.state.params;
        const typeEngName = selectEventType.typeEngName == 'in_play_now' ? 'inPlayNow' : selectEventType.typeEngName;
        const { params } = navigation.state;
        return (
            <View style={{ flex: 1 }}>
                <Header
                    headerCenter={this.headerCenter}
                    headerLeft= {this.headerLeft}
                    navigation={navigation}
                    headerRight= {this.headerRight}
                />
                {
                    tabs[typeEngName] && tabs[typeEngName].length ?
                    <ScrollableTabView
                        renderTabBar={() => <ScrollableTabCustomer />}
                        tabBarBackgroundColor="#fff"
                        tabBarActiveTextColor="#555"
                        tabBarUnderlineStyle={{ height: 0 }}
                        prerenderingSiblingsNumber={0}
                        scrollWithoutAnimation={true}
                        initialPage={EventTypeIndex}
                        page={EventTypeIndex}
                        onChangeTab={this.onChangeTab}
                        ref={(tabView) => { this.tabView = tabView; }}
                    >
                        {tabs[typeEngName].map(( item, index ) => {
                            const ComponentName = Balls[constants['tabsMapping'][engName][item.engName]];
                            return <ComponentName key={`${item.name}${index}`}  tabLabel={`${item.name}`} {...this.props} clearTimerHandle={this.clearRefreshTimer} countDown={this.restartRefresh} />
                        })}
                    </ScrollableTabView> : null
                }
                <DownPopover
                    visible={eventypeTipVisible}
                    showOrHide={this.navTitleTouch}
                    arrow={false}
                    containerStyle={containerStyle}
                >
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        {
                            eventTypeArr.length ? eventTypeArr.map((item, index) => {
                                return (
                                    <TooltipMenuItem key={index} {...item} pressSelect= {this.pressSelect.bind(this, item)} seletedItem= {selectEventType} />
                                )
                            }): <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10, justifyContent: 'center', flex: 1 }}>
                                    <ActivityIndicator size="small" color='#666' />
                                    <Text>加载中...</Text>
                                </View>
                        }
                    </View>
                </DownPopover>
                <SideBar
                    ref={(ref) => { this.sideBar = ref }}
                >
                    <TouchableOpacity
                            style={styles.textRowView}
                            onPress={() => {
                                this.orderPressHandle(matchAsc);
                            }}
                        >
                            <Icons name="icon-aliance" size={14} color={orderStatus === 'match_asc' ?'#17A84B': '#333'} />
                            <Text style={[styles.sortText, orderStatus === 'match_asc' ? { color: '#17A84B' } : null, { marginLeft: 10 }]}>按联盟排序</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.textRowView, {  paddingLeft: 16 }]}
                            onPress={() => {
                                this.orderPressHandle(timeAsc)
                            }}
                        >
                            <Icons name="icon-times" size={17} color={orderStatus === 'time_asc' ?'#17A84B': '#333'} />
                            <Text style={[styles.sortText, orderStatus === 'time_asc' ? { color: '#17A84B' } : null, { marginLeft: 10 }]}>按时间排序</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.textRowView}
                            onPress={() => {
                                this.screenPressHandle();
                            }}
                        >
                            <Icons name="icon-simple-screen" size={14} color={'#333'} />
                            <Text style={[styles.sortText, { marginLeft: 10 }]}>筛选联赛</Text>
                        </TouchableOpacity>
                        {
                            params && !EventTypeIndex && !(params.engName === 'football' && selectEventType.typeEngName === 'parlay') ?
                            <TouchableOpacity
                                style={styles.textRowView}
                                onPress={async () => {
                                    this.orderPressHandle();
                                    await this.setState({ masterIndex: this.state.masterIndex ? 0 : 1 });
                                    masterSort(masterVal[this.state.masterIndex]);
                                }}
                            >
                                <Image source={require('../../../assets/images/icon_switch.png')} style={{ width: 14, resizeMode: 'contain' }} />
                                <Text style={[styles.sortText, { marginLeft: 10 }]}>{masterText[this.state.masterIndex]}</Text>
                            </TouchableOpacity>
                            : null
                        }
                        {
                            params && !EventTypeIndex && !(params.engName === 'football' && selectEventType.typeEngName === 'parlay') ? constants['settingToggleMapping'][params.engName].length?
                            <TouchableOpacity
                                style={styles.textRowView}
                                onPress={ async () => {
                                    this.orderPressHandle();
                                    await this.setState({ periodIndex: this.state.periodIndex ? 0 : 1 });
                                    periodSort(periodVal[this.state.periodIndex]);
                                }}
                            >
                                <Icons name="icon-toggle-horizontal" size={15} color={'#333'} />
                                <Text style={[styles.sortText, { marginLeft: 10 }]}>{constants['settingToggleMapping'][params.engName][this.state.periodIndex]}</Text>
                            </TouchableOpacity>
                            : null
                            : null
                        }
                        <TouchableOpacity
                            style={styles.textRowView}
                            onPress={async () => {
                                this.orderPressHandle();
                                this.clearRefreshTimer();
                                navigation.navigate('GamesPlayed', { ballType: navigation.state.params, countDown: this.restartRefresh });
                            }}
                        >
                            <Icons name="icon-rule-list" size={14} color={'#333'} />
                            <Text style={[styles.sortText, { marginLeft: 10 }]}>体育规则</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.textRowView}
                            onPress={async () => {
                                this.orderPressHandle();
                                this.clearRefreshTimer();
                                navigation.navigate('CenterOrder', { ...navigation.state.params, countDown: this.restartRefresh, headerLeft: true });
                            }}
                        >
                            <Icons name="icon-chip" size={14} color={'#333'} />
                            <Text style={[styles.sortText, { marginLeft: 10 }]}>我的注单</Text>
                        </TouchableOpacity>
                </SideBar>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    textRowView: {
        flexDirection: 'row',
        alignItems: 'center',
        height:40,
        justifyContent: 'flex-start',
        paddingHorizontal: 18,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#EBEBEB'
    },
    sortText: {
        marginLeft: 3
    }
})
const mapStateToProps = (state) => {
    return {
        matchEventType: state.match.matchReducer.matchEventType,
        EventTypeIndex: state.match.eventTypeIndexReducer.EventTypeIndex,
        AllianceId: state.match.sportReducer.AllianceId,
        orderStatus: state.match.matchSort.orderStatus,
        betTimer: state.match.saveBetTimer.betTimer,
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        timeAsc: () => dispatch(Action.matchSort('time_asc')),
        matchAsc: () => dispatch(Action.matchSort('match_asc')),
        masterSort: (status) => dispatch(Action.gameIsMaster(status)),
        periodSort: (status) => dispatch(Action.gameIsPeriod(status)),
        refreshAction: () => dispatch(Action.convertTimesToMd(md5(new Date().getTime()))),
        updateBetTimer: (timer) => { dispatch(Action.saveBetTimer(timer)) }
    }
}

export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(MatchDetails), 'MatchDetails');