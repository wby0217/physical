// 活动列表页

import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { Icon, service, ErrorHandle, Action, constants, Header } from '../mesosphere';
import { OverlaySpinner, Nodata } from '../../component/tips';

const { width } = Dimensions.get('window');
const moment = require('moment');
require('moment/locale/zh-cn');
moment.locale('zh-cn');
export default class ActivityList extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null,
        title: '优惠活动',
        headerBackTitle: null,
        headerTintColor: '#fff',
        headerTitleStyle: {
            alignSelf: 'center'
        }
    });
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            noDataStatus: false,
            isConnecting: false
        }
    }
    componentDidMount() {
        // banner图请求
        this.setState({ isConnecting: true })
        service.getActivityList()
        .then((res) => {
            if(res && res.data.length > 0) {
                this.setState({
                    data: res.data,
                    isConnecting: false
                })
            } else {
                this.setState({
                    noDataStatus: true,
                    isConnecting: false
                })
            }
        })
        .catch(err => {
            this.setState({ isConnecting: false });
            ErrorHandle(err)
        })
    }
    render () {
        const { data, noDataStatus, isConnecting } = this.state;
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1 }} >
                <Header
                    headerTitle="优惠活动"
                    navigation= {navigation}
                />
                <ScrollView style={styles.container}>
                    {data.length > 0 ? data.map((item, index) => {
                        if(item.end === 'yes') {
                            return (
                                <View style={styles.itemView} key={index}>
                                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 999, justifyContent: 'center', borderRadius: 5 }}>
                                        <Image
                                            source={require('../../assets/images/icon_end.png')}
                                            style={{ width: 110,resizeMode: 'contain', alignSelf: 'center', }}
                                        />
                                    </View>
                                    <Text>{item.activityName}</Text>
                                    <Image
                                        source={{ uri: item.activityImage }}
                                        style={styles.banner}
                                    />
                                    <View style={styles.bottomView}>
                                        <Text style={{ color: '#666666', fontSize: 13 }}>活动时间: {moment(item.startTime).format('YYYY-MM-DD')}至{moment(item.finishTime).format('YYYY-MM-DD')}</Text>
                                        <View
                                            style={styles.detailBtn}
                                        >
                                            <Text style={{ color: '#999999', fontSize: 12 }}>查看详情</Text>
                                            <Image
                                                source={require('../../assets/images/icon_next.png')}
                                                style={{ width: 12, height: 14, resizeMode: 'contain' }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )
                        } else {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('ActivityDetail', {...item});
                                    }}
                                    key={index}
                                >
                                    <View style={styles.itemView}>
                                        <Text>{item.activityName}</Text>
                                        <Image
                                            source={{ uri: item.activityImage }}
                                            style={styles.banner}
                                        />
                                        <View style={styles.bottomView}>
                                            <Text style={{ color: '#666666', fontSize: 13 }}>活动时间: {moment(item.startTime).format('YYYY-MM-DD')}至{moment(item.finishTime).format('YYYY-MM-DD')}</Text>
                                            <View
                                                style={styles.detailBtn}
                                            >
                                                <Text style={{ color: '#999999', fontSize: 12 }}>查看详情</Text>
                                                <Image
                                                    source={require('../../assets/images/icon_next.png')}
                                                    style={{ width: 12, height: 14, resizeMode: 'contain' }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    }): null}
                    {noDataStatus ? <Nodata/> : null}
                    <OverlaySpinner
                        visible= {isConnecting}
                        cancelable= {true}
                        onTouchShade={() => {
                            this.setState({
                                isConnecting: !isConnecting
                            })
                        }}
                    />
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        padding: 10
    },
    itemView: {
        padding: 10,
        borderColor: '#E5E5E5',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: 10
    },
    banner: {
        width: width - 40,
        height: width * 300 / 750,
        resizeMode: 'contain'
    },
    bottomView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    detailBtn: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    }
});
