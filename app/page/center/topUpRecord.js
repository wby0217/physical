// 充值记录

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
import CustomActionSheet from '../../vendor/react-native-custom-modal';
import { Icon, service, ErrorHandle, Action, constants, Header, LoadMoreFooter } from '../mesosphere';
import TopUpRecordDetail from './topUpRecordDetail';

const { width } = Dimensions.get('window');
export default class TopUpRecord extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const { params } = state;
        return ({
            header: null,
            headerTitle: '充值记录',
        })
    }
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
            detailsData: {},
            isLoadAll: false,
        }
        this.pageIndex = 1;
        this.totalPage = 1;
    }
    componentDidMount() {
        this.loadPayTypes();
        this.fetchData();
    }
    loadPayTypes = () => {
        storage.load({
            key: 'topUpType'
        })
        .then(res => {
            this.setState({
                filterType: [{ typeId: 0, typeName: '全部' }].concat(res)
            })
        })
        .catch(err => {
            ErrorHandle(err)
        })
    }

    fetchData = () => {
        const { selectedTypeId, datalist } = this.state;
        const { navigation } = this.props;
        service.getTopUpRecordService({ typeId: selectedTypeId, page: this.pageIndex })
        .then(res => {
            if(res.data && res.data.result.length > 0) {
                if(this.pageIndex == 1) {
                    this.setState({ isLoadAll: true })
                }
                this.setState({
                    datalist: datalist.concat(res.data.result),
                    refreshing: false,
                    noDataStatus: false,
                })
            } else if(this.pageIndex <= 1) {
                this.setState({
                    refreshing: false,
                    noDataStatus: true,
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
    screenHandle = () => {
        this.toggleFilterModal();
    }
    toggleFilterModal = () =>{
        const { filterModalVisible } = this.state;
        this.setState({
            filterModalVisible: !filterModalVisible
        })
    }
    toggleDetailModal = (item) => {
        const { detailsModal } = this.state;
        this.setState({
            detailsModal: !detailsModal,
            detailsData: item
        })
    }
    renderFooter = () => {
        const { isLoadAll } = this.state;
        return <LoadMoreFooter isLoadAll={isLoadAll} />
    }
    renderItem = ({ item, index }) => {
        return(
            <View>
                <View style={{ height: 30, justifyContent: 'center', paddingHorizontal: 15, backgroundColor: '#F5F5F9' }}>
                    <Text>{item.date ? moment(item.date).format('YYYY年MM月') : ''}</Text>
                </View>
                <View
                    style={{ backgroundColor: '#fff', paddingHorizontal: 15, borderTopColor: '#E5E5E5', borderTopWidth: 1, borderBottomColor: '#E5E5E5', borderBottomWidth: 1 }}
                >
                    {item.records && item.records.length > 0 ? item.records.map((obj,n) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    this.toggleDetailModal(obj);
                                }}
                                 key={n}
                            >
                                <View style={[{ borderBottomColor: '#E5E5E5', borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 65 }, n === (item.records.length-1) ? {borderBottomWidth: 0}: null]}>
                                    <View>
                                        <Text style={{ fontSize: 16, marginBottom: 8 }}>{obj.typeName}</Text>
                                        <Text style={{ fontSize: 13, color: '#999999' }}>{obj.time ? moment(obj.time).format('M月DD日 HH:mm') : ''}</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 16 }}>{obj.amount}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }): null}
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
            refreshing: true,
            datalist: []
        }, () => {
            this.fetchData();
        })
    }
    headerRight = () => {
        return (
            <TouchableOpacity
                onPress={this.toggleFilterModal}
            >
                <Text style={{ color: '#fff' }}>筛选</Text>
            </TouchableOpacity>
        )
    }
    render() {
        const { refreshing, datalist, filterModalVisible, filterType, selectedTypeId, noDataStatus, detailsModal, detailsData } = this.state;
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <Header
                    headerTitle="充值记录"
                    headerRight={this.headerRight}
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
                <CustomActionSheet
                    modalVisible={filterModalVisible}
                    //TODO 名称
                    onCancel={() => {
                        this.toggleFilterModal();
                    }}
                    buttonText='取消'
                    btnStyle={styles.btnStyle}
                >
                    <View style={[styles.filterModalContainer]}>
                        <View style={styles.modalBoxTitle}>
                            <Text>选择交易类型</Text>
                        </View>
                        <View style={styles.modalKinds}>
                            {
                                filterType.length > 0 ? filterType.map((items, i) =>
                                    <TouchableOpacity
                                        key={i}
                                        style={[styles.filterBtn, selectedTypeId === items.typeId ? styles.filterBtnActive : {}]}
                                        onPress={() => {
                                           this.toggleFilterModal();
                                           this.setState({
                                               selectedTypeId: items.typeId
                                           }, () => {
                                               this.onRefresh();
                                           })
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.filterText,
                                                selectedTypeId === items.typeId ? styles.filterTextActive : {}
                                            ]}>
                                            {items.typeName}
                                        </Text>
                                    </TouchableOpacity>
                                ) : null
                            }
                        </View>
                    </View>
                </CustomActionSheet>
                <TopUpRecordDetail isOpen={detailsModal} onClosed={this.toggleDetailModal} data={detailsData} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerRightBtn: {
        padding: 10
    },
    btnStyle: {
        width,
        height: 50,
        alignSelf: 'center',
        alignItems: 'center',
    },
    filterModalContainer: {
        width,
        backgroundColor: '#F8F8F8',
        marginBottom: 10,
    },
    modalBoxTitle: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5E5E5'
    },
    modalKinds: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    filterBtn: {
        width: width / 3.5,
        marginLeft: (width - 3 * width / 3.5) / 4,
        height: 50,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginTop: 10,
    },
    filterBtnActive: {
        backgroundColor: '#25C65E'
    },
    filterTextActive: {
        color: '#fff'
    },
})