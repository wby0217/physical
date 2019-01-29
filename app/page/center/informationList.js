// 消息公告列表

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
} from 'react-native';
import HTML from 'react-native-render-html';
import { Nodata, OverlaySpinner } from '../../component/tips';
import { Icon, service, ErrorHandle, Action, constants, Header } from '../mesosphere';

const { width, height } = Dimensions.get('window');
export default class InfomationList extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return ({
            header: null,
            headerTitle: state.params.title || '',
            headerBackTitle: null
        })
    }
    constructor(props) {
        super(props)
        this.state = {
            dataList: [],
            noDataStatus: false,
            refreshing: false,
            isConnecting: false
        }
        this.pageIndex = 1;
        this.totalPage = 1;
    }
    componentDidMount() {
        this.fetchData();
        this.togglelLoading();
    }
    fetchData = () => {
        const { navigation } = this.props;
        const { dataList } = this.state;
        if(this.pageIndex > this.totalPage) {
            return;
        }
        service.infoListService({ page: this.pageIndex, typeId: navigation.state.params.typeId })
        .then(res => {
            if(res.data && res.data.result.length > 0){
                this.setState({
                    datalist: this.pageIndex === 1 ? res.data.result : datalist.concat(res.data.result),
                    refreshing: false,
                    noDataStatus: false,
                    isConnecting: false
                })
            } else {
                this.setState({
                    refreshing: false,
                    noDataStatus: true,
                    isConnecting: false
                })
            }
        })
        .catch(err => {
            ErrorHandle(err);
            this.setState({
                refreshing: false,
                noDataStatus: false,
                isConnecting: false
            })
        })
    }
    renderItem = ({ item, index }) => {
        return (
            <View key={index} style={{flexDirection: 'row',justifyContent:'space-between',paddingHorizontal: 10}}>
                <View style={styles.left}>
                    <Image style={styles.message} source={require('../../assets/images/message.png')}/>
                </View>
                <View>
                    <View style={styles.rowView}>
                        <View style={styles.rowTitle}>
                            <Text style={{ color: '#333', fontSize: 16, }}>{item.title}</Text>
                        </View>
                        <View style={styles.content}>
                            <HTML
                                html={item.content}
                                imagesMaxWidth={width}
                                ignoredStyles={['font-family', 'font-variant-numeric', 'font-weight']}
                            />
                        </View>
                        <View style={{height:30,justifyContent:'center'}}>
                            <Text style={styles.time}>{item.time}</Text>
                        </View>
                    </View>
                    <Image style={styles.triangle} source={require('../../assets/images/triangle.png')}/>
                </View>
            </View>
        )
    };
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
    togglelLoading = () => {
        const { isConnecting } = this.state;
        this.setState({
            isConnecting: !isConnecting
        })
    }
    render() {
        const { datalist, refreshing, noDataStatus, isConnecting } = this.state;
        const { navigation } = this.props;
        return(
            <View style={{ flex: 1 ,backgroundColor: '#F5F5F9'}}>
                <Header
                    headerTitle={navigation.state.params.title || '公告' }
                    navigation = {navigation}
                />
                {noDataStatus? <Nodata onRefresh={this.fetchData} refreshing={refreshing}/>:
                    <View style={{ paddingHorizontal: 10, flex: 1 }}>
                        {!!datalist?<View style={styles.border}/>:<View/>}
                        <FlatList
                            data={datalist}
                            renderItem= {this.renderItem}
                            refreshing= {refreshing}
                            onEndReached={this.handleLoadMore}
                            onEndReachedThreshold={0}
                            style={{ flex: 1 ,position: 'absolute',width: width,height:height-80}}
                            onRefresh = {this.onRefresh}
                        />
                    </View>
                }
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
    rowView: {
        width: width * 632 / 750,
        backgroundColor: '#fff',
        marginTop: 10,
        borderRadius: 5,
        borderColor: '#E5E5E5',
        borderWidth: StyleSheet.hairlineWidth
    },
    rowTitle: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        justifyContent: 'center'
    },
    p: {
        color: '#333',
        fontSize: 13,
        lineHeight: 21
    },
    left: {
        width: width * 56 / 750,
        height: width * 56 / 750,
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderColor: '#E5E5E5',
        borderWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },
    time: {
        paddingHorizontal: 10,
        color: '#666666',
        fontSize: 12,
        backgroundColor: 'transparent'
    },
    triangle: {
        width: 9,
        height: 11,
        position: 'absolute',
        top: 30,
        left: -8
    },
    message: {
        width: 13,
        height: 12,
    },
    border: {
        width: 1,
        height: height,
        position: 'absolute',
        left: (width * 56 / 750)/2+10,
        top: 0,
        borderRightColor: '#E5E5E5',
        borderRightWidth: StyleSheet.hairlineWidth
    },
    content: {
        paddingHorizontal: 10,
        paddingBottom:10,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth
    }
});