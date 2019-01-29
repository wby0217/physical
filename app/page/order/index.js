// 我的注单

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc';
import Immutable, {  Map, List } from 'immutable';
import { Icons, service, ErrorHandle, Action, constants, Header } from '../mesosphere';
import { OverlaySpinner, Nodata } from '../../component/tips';
import AllOrder from './all';
import Winner from './win';
import WaitPrize from './wait';
import Revoke from './revoke';
import ScrollTabView from './scrollTabView';
import DownPopover from '../../component/down-popover';
import NavTitle from './navtitle';
import TooltipMenuItem from './filterModalItem';

const { width } = Dimensions.get('window');
const containerStyle = { width, top: 6, right: 0, flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, paddingTop: 15, justifyContent: 'space-between' };
class Order extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const { params } = state;
        return ({
            header: null,
            headerTitle: '我的注单',
        })
    }
    constructor(props) {
        super(props)
        this.state = {
            pageIndex: 0,
            visible: false,
            buttonRect: {},
            ballType: [],
            seletedBallEngName: 'all',
            isFocused: false,
            eventypeTipVisible: false,
            seletedItem: { id: 0, name: "全部比赛", engName: "all" },
            orderData: {}
        }
    }
    componentDidMount() {
        storage.load({
            key: 'sportsTypes'
        })
        .then(data => {
            const newArr = List(data).toArray();
            newArr.unshift({
                    id: 0,
                    name: '全部比赛',
                    engName: 'all'
                })
            this.setState({
                ballType: newArr
            })
        })
        .catch(err => {
            ErrorHandle(err)
        })
        this.fetchData({ startTime:'', endTime: '' });
    }
    componentWillReceiveProps( nextProps ) {
        const { isOrderFocus, isFocused } = nextProps;
        if(this.props.isFocused !== isFocused) {
           this.timer = setTimeout(() => {
                isOrderFocus && isOrderFocus(isFocused);
            },0)
        }
    }
    toggleFocused = () => {
        this.setState({
            isFocused: !this.state.isFocused
        })
    }
    screenHandle = (ref) => {
        if(this.button && this.button.measure) {
            this.button.measure((ox, oy, width, height, px, py) => {
                this.setState({
                    visible: !this.state.visible,
                    buttonRect: { x: px, y: py }
                });
            });
        } else {
            this.setState({
                visible: !this.state.visible,
            },() => {
                ref && typeof (ref) === 'function' && ref();
            });
        }
    }
    toggleLoading = (status) => {
        const { isConnecting } = this.state;
        this.setState({ isConnecting: status !== undefined ? status : !isConnecting })
    }
    headerRight = () => {
        const { navigation } = this.props;
        return (
            <TouchableOpacity
                ref={ref => this.button = ref}
                onPress={() => {
                    navigation.navigate('ScreenByTime', { backHandle: this.fetchData });
                }}
                style={{ paddingHorizontal: 5 }}
                >
                <Icons name="icon-calendar" color="#fff" size={22} />
            </TouchableOpacity>
        )
    }
    headerLeft = () => {
        const { navigation } = this.props;
        const { countDown } = navigation.state.params;
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.goBack();
                    countDown && countDown();
                }}
                style={{ backgroundColor: 'transparent' }}
            >
                <Icons name="icon-back-normal" color="#ffffff" size={22} />
            </TouchableOpacity>
        )
    }
    navTitleTouch = () => {
        this.setState({
            eventypeTipVisible: !this.state.eventypeTipVisible
        })
    }
    pressSelect = (item) => {
        const { navigation, period } = this.props;
        this.setState({
            seletedItem: item
        }, () => {
            navigation.dispatch(Action.screenByBallType(item));
            // navigation.dispatch(Action.screenByTime({ startTime: '', endTime : ''}));
            this.fetchData({ startTime: period.startTime, endTime: period.endTime });
            this.navTitleTouch();
        })
    }
    fetchData = ({ startTime, endTime }) => {
        const { navigation } = this.props;
        navigation.dispatch(Action.screenByTime({ startTime, endTime }));
    }
    componentWillUnmount() {
        clearTimeout(this.timer);
    }
    render() {
        const { isLogin, saveUpdateUser, navigation, saveOrderTypeIndex } = this.props;
        const { visible, buttonRect, ballType, seletedBallEngName, eventypeTipVisible, seletedItem, orderData } = this.state;
            return (
                <View style={{ flex: 1 }}>
                    <Header
                        headerLeft= {navigation.state.params && navigation.state.params.headerLeft ? this.headerLeft : null}
                        headerCenter= { () => <NavTitle onTouch = { this.navTitleTouch } {...seletedItem} /> }
                        navigation= { navigation }
                        headerRight= {this.headerRight}
                    />
                    {
                        isLogin?
                        <View style={ styles.scrollViewTab }>
                            <View style={{ paddingHorizontal: 10, flex: 1 }}>
                                <ScrollableTabView
                                    renderTabBar={() => <ScrollTabView />}
                                    tabBarBackgroundColor="#fff"
                                    tabBarActiveTextColor="#FFFFFF"
                                    tabBarUnderlineStyle={{ height: 0 }}
                                    prerenderingSiblingsNumber={0}
                                    onChangeTab={(index) => {
                                        saveOrderTypeIndex(index.i)
                                    }}
                                    ref={(tabView) => { this.tabView = tabView; }}
                                >
                                    <AllOrder tabLabel="全部订单" {...this.props} />
                                    <Winner tabLabel="已中奖" {...this.props} />
                                    <WaitPrize tabLabel="待开奖" {...this.props} />
                                    <Revoke tabLabel="已撤单" {...this.props} />
                                </ScrollableTabView>
                            </View>
                        </View>
                    :
                        <Nodata type='noLogin'>
                            <View
                                style={{ marginTop: 60, flex: 1, alignItems: 'center' }}
                            >
                                <TouchableOpacity
                                    style={styles.loginBtn}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        navigation.navigate('Login', { routeNames: ['OrderTabs'] });
                                    }}
                                >
                                    <Text style={{ color: '#fff' }}>登录/注册</Text>
                                </TouchableOpacity>
                            </View>
                        </Nodata>
                    }
                    <DownPopover
                        visible={visible}
                        showOrHide={this.screenHandle}
                        buttonRect={buttonRect}
                    >
                    {
                        ballType.length ? ballType.map((item, index) =>
                            <TouchableOpacity
                                style={styles.textRowView}
                                onPress={() => {
                                    navigation.dispatch(Action.screenByBallType(item));
                                    this.screenHandle();
                                    this.setState({
                                        seletedBallEngName: item.engName
                                    })
                                }}
                                key={index}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Text style={[styles.sortText, item.engName === seletedBallEngName ? { color: '#17A84B' } : null ]}>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                        :
                        <View/>
                    }
                    </DownPopover>
                    <DownPopover
                        visible={eventypeTipVisible}
                        showOrHide={this.navTitleTouch}
                        arrow={false}
                        containerStyle={containerStyle}
                    >
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            {
                                ballType.length ? ballType.map((item, index) => {
                                    return (
                                        <TooltipMenuItem key={index} {...item} pressSelect= {this.pressSelect.bind(this, item)} seletedItem= {seletedItem} />
                                    )
                                }): <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10, justifyContent: 'center', flex: 1 }}>
                                        <ActivityIndicator size="small" color='#666' />
                                        <Text>加载中...</Text>
                                    </View>
                            }
                        </View>
                    </DownPopover>
                </View>
            )
    }
}

const styles = StyleSheet.create({
    scrollViewTab: {
        flex: 1,
        backgroundColor: '#F5F5F9'
    },
    loginBtn: {
        backgroundColor: '#17A84B',
        paddingHorizontal: 40,
        paddingVertical: 8,
        borderRadius: 15
    },
    textRowView: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#EBEBEB',
        paddingHorizontal: 25
    }
})

const mapStateToProps = (state) => {
    return {
        saveUpdateUser: state.match.saveUpdateUser,
        isLogin: state.match.saveUpdateUser.isLogin,
        period: state.match.orderScreenByPeriod
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        saveOrderTypeIndex: (index) => dispatch(Action.saveOrderTypeIndex(index)),
        isOrderFocus: (status) => dispatch(Action.isOrderFocus(status))
    }
}

export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(Order), 'Order');