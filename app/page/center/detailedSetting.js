//  详细设定

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
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

const { width } = Dimensions.get('window');
export default class DetailedSetting extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const { params } = state;
        return ({
            header: null,
            headerTitle: '详细设定',
            headerRight:<TouchableOpacity
                            style={styles.headerRightBtn}
                            onPress={() => { params && params.screenHandle()  }}
                        >
                            <Text style={{ color: '#fff' }}>筛选</Text>
                        </TouchableOpacity>,
            headerBackTitle: null
        })
    }
    constructor(props) {
        super(props)
        this.state = {
            dataList: [],
            noDataStatus: false,
            isConnecting: false,
            sportTypes: [],
            activeSport: {},
            filterModalVisible: false,
        }
    }
    componentWillMount() {
        const { navigation } = this.props;
        navigation.setParams({ screenHandle: this.screenHandle });
    }
    componentDidMount() {
        storage.load({
            key: 'sportsTypes'
        })
        .then(res => {
            this.setState({
                sportTypes: res,
                activeSport: res[0]
            }, () => {
                this.fetchData();
                this.togglelLoading();
            })
        })
        .catch(err => {
            ErrorHandle(err)
        })
    }
    screenHandle = () => {
        this.toggleFilterModal();
    }
    fetchData = () => {
        const { activeSport } = this.state;
        service.betLimitSettingService({ sportId: activeSport['id'] })
        .then(res => {
            if(res.data && res.data.length > 0) {
                this.setState({
                    dataList: res.data,
                    noDataStatus: false,
                    isConnecting: false
                })
            } else {
                this.setState({
                    noDataStatus: true,
                    isConnecting: false
                })
            }
        })
        .catch(async err => {
            await this.setState({ isConnecting: false })
            ErrorHandle(err);
            
        })
    }
    renderItem = () => {
        const { dataList } = this.state;
        return (
            dataList.length > 0 ? dataList.map((item, index) =>
            <View key={index} style={[styles.rowView, { backgroundColor: '#fff' }]}>
                <View style={styles.colView1}>
                    <Text>{item.name}</Text>
                </View>
                <View style={styles.colView2}>
                    <Text>{item.singleMatchLimitMax}</Text>
                </View>
                <View style={styles.colView2}>
                    <Text>{item.singleBetLimitMax}</Text>
                </View>
            </View>) : null
            
        )
    }
    toggleFilterModal = () =>{
        const { filterModalVisible } = this.state;
        this.setState({
            filterModalVisible: !filterModalVisible
        })
    }
    togglelLoading = () => {
        const { isConnecting } = this.state;
        this.setState({
            isConnecting: !isConnecting
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
    renderFooter = () => {
        const { isLoadAll } = this.state;
        return <LoadMoreFooter isLoadAll={isLoadAll} />
    }
    render() {
        const { noDataStatus, isConnecting, filterModalVisible, sportTypes, activeSport } = this.state;
        const { navigation } = this.props;
        return(
            <View style={{ flex: 1 }}>
                <Header
                    headerTitle="详细设定"
                    navigation = {navigation}
                    headerRight = {this.headerRight}
                />
                    {noDataStatus ?  <Nodata onRefresh={this.fetchData} /> :
                        <ScrollView>
                            <View style={[styles.rowView, { backgroundColor: '#EAFCE8' }]}>
                                <View style={styles.colView1}>
                                    <Text>投注类型</Text>
                                </View>
                                <View style={styles.colView2}>
                                    <Text>单场最高</Text>
                                </View>
                                <View style={styles.colView2}>
                                    <Text>单注最高</Text>
                                </View>
                            </View>
                            {this.renderItem()}
                        </ScrollView>
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
                                <Text>选择类型</Text>
                            </View>
                            <View style={styles.modalKinds}>
                                {
                                    sportTypes.length > 0 ? sportTypes.map((items, i) =>
                                        <TouchableOpacity
                                            key={i}
                                            style={[styles.filterBtn, activeSport.id === items.id ? styles.filterBtnActive : {}]}
                                            onPress={() => {
                                            this.toggleFilterModal();
                                            this.setState({
                                                activeSport: items
                                            }, () => {
                                                this.fetchData();
                                                })
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.filterText,
                                                    activeSport.id === items.id ? styles.filterTextActive : {}
                                                ]}>
                                                {items.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : null
                                }
                            </View>
                        </View>
                </CustomActionSheet>
                <OverlaySpinner
                    visible= {isConnecting}
                    cancelable= {true}
                    onTouchShade={this.togglelLoading}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerRightBtn: {
        padding: 10
    },
    rowView: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        borderBottomColor: '#E4E4E4',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    colView1: {
        flex: 2,
        paddingLeft: 10 
    },
    colView2: {
        flex: 1, paddingLeft: 5
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
});