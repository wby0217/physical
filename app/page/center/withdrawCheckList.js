// 稽核详情

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    FlatList
} from 'react-native';
import { connect } from 'react-redux';
const moment = require('moment');
import { Nodata, OverlaySpinner } from '../../component/tips';
import { Icon, service, ErrorHandle, Action, constants, Header, LoadMoreFooter, Icons } from '../mesosphere';

const { width } = Dimensions.get('window');
export default class withdrawCheckList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datalist: [],
            refreshing: false,
            noDataStatus: false,
            filterModalVisible: false,
            filterType: [],
            selectedTypeId: 0,
            detailsModal: false,
            isConnecting: false,
            detailsData: {},
            isLoadAll: false,
        }
        this.pageIndex = 0;
        this.totalPage = 1;
    }
    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        const { selectedTypeId, datalist } = this.state;
        const { navigation } = this.props;
        service.withdrawCheckListService({ page: this.pageIndex })
        .then(res => {
            if(res.data && res.data.length > 0) {
                this.setState({
                    datalist: this.pageIndex === 1 ? res.data : datalist.concat(res.data),
                    refreshing: false,
                    noDataStatus: false,
                })
            } else if(this.pageIndex <= 1 ) {
                this.setState({
                    refreshing: false,
                    noDataStatus: true,
                })
            } else {
                this.setState({
                    refreshing: false,
                    isLoadAll: true
                })
            }
        })
        .catch(err => {
            err.navigation = navigation;
            ErrorHandle(err);
            this.setState({
                refreshing: false,
                noDataStatus: false,
            })
        })
    }
    renderItem = ({ item, index }) => {
        return(
            <View key={index} style={{ backgroundColor: '#fff', marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 40, alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#EAEAEA', paddingHorizontal: 10, }}>
                        {item.status ?
                            <Icons name={"icon-cycle-success"} color="#17A84B" size={14} />:
                            <Icons name={"icon-cycle-wrong"} color="#666666" size={14} />
                        }
                        <Text style={[{ color: '#17A84B', marginLeft: 5 }, !item.status ? { color: '#999' } : null]}>{item.status ? '可提款' : '不可提款'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row',  paddingHorizontal: 10, }}>
                        <View style={{ flex: 1, height: 60, justifyContent: 'space-around' }}>
                            <Text style={{ color: '#333' }}>存款: {item.rechargeAmount}元</Text>
                            <Text style={{ color: '#333' }}>提款需达投注量:{item.needBetAmount}元</Text>
                        </View>
                        <View style={{ flex: 1, height: 60, justifyContent: 'space-around' }}>
                            <Text style={{ color: '#333' }}>优惠: {item.discountAmount}元</Text>
                            <Text style={{ color: '#333' }}>已达投注量:{item.realBetAmount}元</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', height: 30, alignItems: 'center', paddingHorizontal: 10, }}>
                        <Text style={{ flex: 1, color: '#999', fontSize: 12 }}>起始: {item.startTime}</Text>
                        <Text style={{ flex: 1, color: '#999', fontSize: 12 }}>结束: {item.endTime}</Text>
                    </View>
            </View>
        )
    }
    handleLoadMore = () => {
        this.pageIndex ++;
        this.fetchData();
    }
    onRefresh = () => {
        this.pageIndex = 1;
        this.setState({
            refreshing: true
        }, () => {
            this.fetchData();
        })
    }
    renderFooter = () => {
        const { isLoadAll } = this.state;
        return <LoadMoreFooter isLoadAll={isLoadAll} />
    }
    render() {
        const { refreshing, datalist, filterModalVisible, filterType, selectedTypeId, noDataStatus, detailsModal, isConnecting, detailsData } = this.state;
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <Header
                    headerTitle="稽核详情"
                    navigation = {navigation}
                />
                {noDataStatus? <Nodata onRefresh={this.fetchData} refreshing={refreshing}/>:
                    <FlatList
                        data={datalist}
                        renderItem= {this.renderItem}
                        refreshing= {refreshing}
                        style={{ flex: 1 }}
                        onRefresh = {this.onRefresh}
                        onEndReachedThreshold={0}
                        ListFooterComponent = {this.renderFooter}
                        onEndReached={this.handleLoadMore}
                    />
                }
                <OverlaySpinner
                    visible= {isConnecting}
                    cancelable= {true}
                    onTouchShade={() => {
                        this.setState({
                            isConnecting: !isConnecting
                        })
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})