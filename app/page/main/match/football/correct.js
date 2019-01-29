// 足球波胆（全）
import React, { Component } from 'react';
import {
    View,
    Text,
    ListView,
    StyleSheet,
    RefreshControl,
    InteractionManager,
    FlatList,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Immutable, {  Map, List } from 'immutable';
import { Nodata, Succtips, OverlaySpinner } from '../../../../component/tips';
import { service, ErrorHandle, Action, constants, LoadMoreFooter, Config, middwareHandler } from '../../../mesosphere';
import OrderPop from '../orderPop';
import SectionRow from '../sectionRow';
import MatchGrid from '../grid/correctGrid';

let prevGameId = List([]);
let prevActiveId = List([]);
const moduleKey = "ft_correct_score";
const isIos = Platform.OS === 'ios';
class Correct extends Component {
    constructor(props) {
        super(props)
        this.state = {
           matchEventType: props.matchEventType || {typeEngName: 'today'},
           pageIndex: 1,
           data: [],
           totalPage: 1,
           activeId: [],
           noData: false,   // 数据是否为空
           refreshing: false,
           isOpenSucc: false,
           isLoadAll: false,
           isConnecting: false,
           maintain: false,
           errorMessage: '',
           period: ''
        }
        this.renderItem = this.renderItem.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.pageIndex = 1;
        this.totalPage = 1;
        this.isMouted = false;
        this.timer = null;
    }
    async componentDidMount() {
        this.tabIndex = await middwareHandler.judgeTabIndex(this.props.selectedBallInfo, this.state.matchEventType, moduleKey);
        this.setState({
                data: [],
                activeId: [],
                isLoadAll: false
        }, () => {
            if(this.tabIndex === this.props.EventTypeIndex) {
                this.pageIndex = 1;
                this.totalPage = 1;
                this.fetchData();
            }
        })
    }
    async componentWillReceiveProps(nextProps) {
        const { matchEventType, navigation, orderStatus, EventTypeIndex, AllianceId, isFocused, timestampMd, selectedBallInfo } = this.props;
        const nextEventType = nextProps.matchEventType;
        if(matchEventType.typeEngName !== nextEventType.typeEngName) {
            this.tabIndex = await middwareHandler.judgeTabIndex(selectedBallInfo, nextEventType, moduleKey);
            if(this.tabIndex !== nextProps.EventTypeIndex) return;
            navigation.dispatch(Action.checkAllianceId(0));
            this.pageIndex = 1;
            this.totalPage = 1;
            this.setState({
                matchEventType: nextEventType,
                data: [],
                activeId: [],
                isLoadAll: false,
            },() => {
                this.fetchData({
                    matchTypeId: nextEventType.typeEngName
                });
            })
        } else if( orderStatus !== nextProps.orderStatus && this.tabIndex === nextProps.EventTypeIndex) {
            this.pageIndex = 1;
            this.totalPage = 1;
            this.setState({
                data: [],
                activeId: [],
                isLoadAll: false,
            }, () => {
                this.fetchData({
                    orderType: nextProps.orderStatus
                });
            })
        } else if( AllianceId !== nextProps.AllianceId  && this.tabIndex === nextProps.EventTypeIndex) {
            this.pageIndex = 1;
            this.totalPage = 1;
            this.setState({
                data: [],
                activeId: [],
                isLoadAll: false,
            }, () => {
                this.fetchData();
            })
        } else if(timestampMd !== nextProps.timestampMd && this.tabIndex === nextProps.EventTypeIndex ) {
            this.refreshData();
        } else if(this.tabIndex === nextProps.EventTypeIndex && EventTypeIndex !== nextProps.EventTypeIndex) {
            this.pageIndex = 1;
            this.totalPage = 1;
            this.setState({
                data: [],
                activeId: [],
                isLoadAll: false,
            }, () => {
                this.fetchData()
            });
        }
    }
    refreshData = () => {
        const { AllianceId, matchEventType, orderStatus, navigation } = this.props;
        const args = { sportType: navigation.state.params && navigation.state.params.engName, eventType: matchEventType.typeEngName, playTypeGroup: moduleKey, pageAll: this.pageIndex, matches: AllianceId || 0 }
        service.matchOddsService(args)
        .then(res => {
            if(this.pageIndex === 1) {
                this.setState({ isLoadAll: true })
            }
            if(!_.isEmpty(res.data) && res.data.result.length > 0) {
                this.setState({
                    data: res.data.result,
                    noData: false,
                    isLoadAll: false,
                    isConnecting: false,
                    maintain: false
                })
            } else {
                 this.setState({
                    data: [],
                    noData: true,
                    isLoadAll: true,
                    isConnecting: false,
                    maintain: false
                })
            }
        })
        .catch(err => {
            if(err.errorcode === 100009) {
                this.setState({ maintain: true, isConnecting: false, errorMessage: err.message, period: !_.isEmpty(err.data) ? `${err.data.startTime} - ${err.data.endTime}` : null })
            } else {
                this.setState({ isConnecting: false, maintain: false }, () => ErrorHandle(err))
            }
        })
    }
    fetchData(params = {}) {
        const { pageIndex, totalPage, data } = this.state;
        const { AllianceId, matchEventType, orderStatus, navigation } = this.props;
        const orderType = params.orderType || orderStatus ||'time_asc';
        const args = { sportType: navigation.state.params && navigation.state.params.engName, eventType: matchEventType.typeEngName, playTypeGroup: moduleKey, page: this.pageIndex, order: orderType, pageAll: params.pageAll || 0, matches: AllianceId || 0 };
        if(this.pageIndex > this.totalPage) {
            this.setState({ isLoadAll: true, refreshing: false });
            return;
        }
        service.matchOddsService(args)
        .then(res => {
            if(!_.isEmpty(res.data) && res.data.totalPage === 1) {
                this.setState({ isLoadAll: true })
            }
            let isNoData = true;
            if(!_.isEmpty(res.data) && res.data.result.length > 0){
               isNoData = false;
            }
            this.totalPage = res.data.totalPage;
            this.setState({
                data: this.pageIndex === 1 ? res.data.result : data.concat(res.data.result),
                noData: isNoData,
                refreshing: false,
                isLoadAll: isNoData,
                maintain: false
            });
        })
        .catch(err => {
            if(err.errorcode === 100009) {
                this.setState({
                    data: [],
                    maintain: true,
                    refreshing: false,
                    isConnecting: false,
                    errorMessage: err.message,
                    period: !_.isEmpty(err.data) ? `${err.data.startTime} - ${err.data.endTime}` : null
                })
            } else {
                this.setState({
                    refreshing: false,
                    isLoadAll: <Text>{err.message || '加载失败!'}</Text>,
                    isConnecting: false,
                    maintain: false
                }, () => console.log(err))
            }
        })
    }
    handleLoadMore() {
        const { AllianceId } = this.props;
        const { pageIndex, totalPage } = this.state;
        this.pageIndex ++;
        this.fetchData({ matches: AllianceId || 0 });
    }
    handleSelect(selectIds) {
        if(this.isMouted) return;
        const { activeId, data } = this.state;
        const { matchEventType } = this.props;
        prevActiveId = List(activeId);
        const key = selectIds.length && selectIds.join('-');
        const matchIndex = _.indexOf(activeId, key); // 获取选中赔率的索引值
        let _index = -1;
        let newActiveId = activeId;
        if( matchEventType.typeEngName === 'parlay' ) {
            newActiveId.map((item, index) => {
                if (item.indexOf(`-${selectIds[3]}-`) > -1) {
                    _index = index;
                    return _index;
                }
            });
            if( _index > -1 ) { // 同一个盘口 单选
                newActiveId.splice(_index, 1);
            }
            if(matchIndex > -1) {
                _.remove(newActiveId, (n) => n === matchIndex);
            } else {
                newActiveId.push(key)
            }
            this.setState({
                activeId: newActiveId
            });
            prevGameId = List(newActiveId);
        } else {
            if (matchIndex > -1) {
                this.setState({
                    activeId: []
                });
            } else {
                this.setState({
                    activeId: new Array(key)
                });
                prevGameId = List(new Array(key));
            }
        }
    }
    succCallback = () => {
        this.setState({ isOpenSucc: true });
    }
    modalDidClose = () => {
        this.setState({ isOpenSucc: false, activeId: [] });
    }
    clearActiveId = (callback) => {
        this.setState({
            activeId: []
        },() => {
            callback && callback();
        })
    }
    renderItem({ item }) {
        const { activeId, matchEventType } = this.state;
        return (
            <SectionRow {...item} >
              {item.schedules.length > 0 && item.schedules.map((item, i) =>
                  <View style={styles.boxView} key={i}>
                       <MatchGrid n={item} key={i} prevActiveId={prevGameId} prevGameId= {prevActiveId} activeId={activeId} onSelected={(key) => this.handleSelect(key)} matchTypeId={matchEventType.typeEngName} /> 
                  </View>
              )}
            </SectionRow>
          );
    }
    onRefresh() {
        if(this.isMouted) return;
        this.pageIndex = 1;
        this.setState({
            refreshing: true,
            data: [],
            activeId: [],
            isLoadAll: null
        }, () => {
            this.fetchData();
        })
    }
    renderFooter = () => {
        const { isLoadAll, maintain, errorMessage, period } = this.state;
        if( maintain ) {
            return <Nodata type="maintain" noDataText={errorMessage} period={period} />;
        } else {
            return <LoadMoreFooter isLoadAll={isLoadAll} />
        }
    }
    render() {
        const { data, noData, refreshing, activeId, isOpenSucc, isConnecting } = this.state;
        const { matchEventType } = this.props;
        return (
            <KeyboardAvoidingView behavior={isIos ? "padding" : ''} style={styles.container}>
                {noData ? <Nodata onRefresh={this.onRefresh} />:
                    <FlatList
                        data={data}
                        extraData={this.state}
                        renderItem= {this.renderItem}
                        ListFooterComponent = {this.renderFooter}
                        refreshing= {refreshing}
                        onEndReached={this.handleLoadMore}
                        onEndReachedThreshold={1}
                        style={{ flex: 1 }}
                        onRefresh = {this.onRefresh}
                    />
                }
                {activeId.length ?
                <KeyboardAvoidingView behavior={isIos ? "padding" : ''}>
                    <OrderPop
                    activeId={activeId}
                    genOrderInfo={{ eventType: matchEventType.typeEngName }}
                    {...this.props}
                    succCallback={this.succCallback}
                    clearActiveId={this.clearActiveId}
                    />
                </KeyboardAvoidingView>
                :
                null}
                <Succtips isVisible={isOpenSucc} onBackdropPress={this.modalDidClose} onModalHide={this.modalDidClose} />
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#F5F5F9'
    }
});
const mapStateToProps = (state) => {
    return {
        matchEventType: state.match.matchReducer.matchEventType,
        AllianceId: state.match.sportReducer.AllianceId,
        orderStatus: state.match.matchSort.orderStatus,
        EventTypeIndex: state.match.eventTypeIndexReducer.EventTypeIndex,
        isLogin: state.match.saveUpdateUser.isLogin,
        selectedBallInfo: state.match.selectedBallInfo,
        timestampMd: state.match.sportReducer.timestampMd,
        accountType: state.match.saveAcountType.type
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        updateBetTimer: (timer) => { dispatch(Action.saveBetTimer(timer)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Correct);