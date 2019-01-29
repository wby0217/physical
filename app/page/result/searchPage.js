// 搜索页面
import React, { Component } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    NativeModules,
    StatusBar,
    Platform,
    ActivityIndicator
} from 'react-native';
import { Icons, service, showToast } from '../mesosphere'
import { Nodata } from '../../component/tips';
import _ from 'lodash';

const moment = require('moment');
const isIPhoneX = NativeModules.DeviceInfo.isIPhoneX_deprecated;
const pdTop = Platform.OS == 'ios' ? isIPhoneX ? 40 : 24 : 10;
export default class SearchPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataList: [],
            result: [],
            keyword: "",
            isEmpty: false,
            isConnecting: false
        }
    }
    componentDidMount() {
        this.togglelLoading();
        this.fetchData();
    }
    fetchData = () => {
        const { selectedball, selectedMatchType, dateStr } = this.props.navigation.state.params;
        service.getMatchResultService({
            sport: selectedball.engName,
            type: selectedMatchType.type,
            date: dateStr,
            page: 'all'
        })
        .then((res) => {
            this.setState({ result: res.data.result, isConnecting: false });
        })
        .catch(err => {
            showToast(err);
            this.togglelLoading();
        })
    }
    searchForm = () => {
        const { result, keyword } = this.state;
        if(!keyword) return;
        // const reg =  new RegExp(keyword.trim());
        const keyWord = keyword.trim();
        let newArr = [];
        if(result && result.length > 0) {
            result.map((obj, index) => {
                if(obj.schedule && obj.schedule.length > 0) {
                    const schedules = (_.filter(obj.schedule, (schedule) =>
                        {
                            return schedule.homeName.indexOf(keyWord) >= 0  || schedule.guestName.indexOf(keyWord) >= 0
                        } 
                    ))
                    newArr = newArr.concat(schedules);
                }
            })
        }
        if(newArr.length) {
            this.setState({ 
                dataList: newArr,
                isEmpty: false
             })
        } else {
            this.setState({ 
                dataList: newArr,
                isEmpty: true
            });
        }
        return newArr;
    }
    togglelLoading = () => {
        const { isConnecting } = this.state;
        this.setState({
            isConnecting: !isConnecting
        })
    }
    render() {
        const { navigation } = this.props;
        const { selectedball, selectedMatchType } = this.props.navigation.state.params;
        const { dataList, isEmpty, isConnecting } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: pdTop }}>
                <StatusBar
                    barStyle="default"
                />
                <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                    <View style={{ height: 35, backgroundColor: '#EDEDED', borderRadius: 5, flex: 8, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5 }}>
                        <Image source={require('../../assets/images/icon_search_gray.png')} style={{ width: 12, height: 12, resizeMode: 'contain' }}/>
                        <TextInput
                            placeholder="输入球队名搜索"
                            style={{ height: 35, paddingLeft: 5, flex: 1, paddingVertical: 0 }}
                            onSubmitEditing= {this.searchForm}
                            onChangeText={(text) => {
                                this.setState({ keyword: text });
                            }}
                            ref = {ref => this.searchInput = ref}
                            underlineColorAndroid="transparent"
                            autoFocus
                            returnKeyType="search"
                        />
                        <TouchableOpacity
                            onPress={() => {
                                this.searchInput.clear();
                            }}
                        >
                            <Icons name="icon-cycle-close" size={16} color="#B1B1B1" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                        style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Text>取消</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 40, backgroundColor: '#F5F5F9', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                    <Text style={{ color: '#999999' }}>仅搜索当天的赛果</Text>
                </View>
                <ScrollView>
                <ActivityIndicator
                    animating={isConnecting}
                    size="small"
                    style={[isConnecting ? { height: 80 }: { height: 0 } ]}
                />
                    {
                        dataList.length ? dataList.map(( schedule, index ) =>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('ResultDetails', { sport: selectedball.engName, type: selectedMatchType.type, gameId: schedule.gameId })
                                }}
                                style={styles.listRow}
                                activeOpacity={0.8}
                                key={index}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ justifyContent: 'space-around', width: 60, alignItems: 'center' }}>
                                        <Text style={{ color: '#999999', fontSize: 12 }}>{moment(schedule.beginTime).format('MM-DD')}</Text>
                                        <Text style={{ color: '#999999', fontSize: 12 }}>{moment(schedule.beginTime).format('HH:mm')}</Text>
                                    </View>
                                    <View style={{ justifyContent: 'space-around' }}>
                                        <Text style={{ color: '#333333' }}>{schedule.homeName}</Text>
                                        <Text style={{ color: '#333333' }}>{schedule.guestName}</Text>
                                    </View>
                                </View>
                                <View>
                                    <Icons name="icon-right-arrow-normal" color="#CFCFCF" size={18} />
                                </View>
                            </TouchableOpacity>
                        ) : null
                    }
                    { isEmpty ? <Nodata noDataText="对不起,没有相关搜索结果"/> : null }
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    listRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        height: 60,
        alignItems: 'center',
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth 
    }
})