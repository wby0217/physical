// 详细报表

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { service, ErrorHandle, Action, constants, Header, stylesGlobal, Icons } from '../../mesosphere';
import { saveUserInfo } from '../../../service/authService';

const { width } = Dimensions.get('window');
export default class ReportDetails extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return ({
            header: null,
        })
    }
    constructor(props) {
        super(props)
        this.state ={
            dataBtnList:[
                {
                    text: '充值',
                    number: 0,
                    id: 'totalRecharge'
                },
                {
                    text: '提现',
                    number: 0,
                    id: 'totalWithdraw'
                },
                {
                    text: '有效投注',
                    number: 0,
                    id: 'totalBet'
                },
                {
                    text: '有效会员',
                    number: 0,
                    id: 'validUserCount'
                },
                {
                    text: '派彩',
                    number: 0,
                    id: 'totalBonus'
                },
                {
                    text: '活动奖金',
                    number: 0,
                    id: 'totalDiscount'
                },
                {
                    text: '总返水',
                    number: 0,
                    id: 'betRebate'
                },
                {
                    text: '首次充值',
                    number: 0,
                    id: 'firstRecharge',
                    firstRechargeUserCount: 0
                },
                {
                    text: '实际盈亏',
                    number: 0,
                    id: 'profit'
                },
            ],
            data: {},
            startDate: moment().format('YYYY-MM-01'),
            endDate: moment().format('YYYY-MM-DD')
        }
    }
    componentDidMount() {
        this.getAgentStatistics();   
    }
    getAgentStatistics = () => {
        const { startDate, endDate } = this.state;
        service.getAgentStatisticsService({startDate, endDate})
        .then(res => {
            this.setState({
                data: res.data
            })
        })
        .catch(ErrorHandle)
    }
    onBackRefreshHandle = (item) => {
        this.setState({
            startDate: item.startDate,
            endDate: item.endDate
        },this.getAgentStatistics)
    }
    render() {
        const { navigation } = this.props;
        const { dataBtnList, data, startDate, endDate } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Header
                    headerTitle="详细报表"
                    navigation={navigation}
                />
                <ScrollView>
                    <View style={{ flexDirection: 'row', height: 50, alignItems: 'center', backgroundColor: '#fff' }}>
                        <View style={{ flex: 1, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <Icons name="icon-simple-calendar" color="#333333" size={20} />
                            <Text style={{ color: '#333333' }}>日期</Text>
                        </View>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', flex: 2, justifyContent: 'center' }}
                            onPress={() => {
                                navigation.navigate('AgencyDatepicker', { onBack: this.onBackRefreshHandle })
                            }}
                            activeOpacity={0.8}
                        >
                            <View style={styles.dateView}>
                                <Text style={{ color: '#333333' }}>{startDate}</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 18, marginHorizontal: 5 }}>-</Text>
                            </View>
                            <View style={styles.dateView}>
                                <Text style={{ color: '#333333' }}>{endDate}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: '#fff', marginTop: 10 }}>
                        {dataBtnList.map((item, index) =>
                            <View style={styles.rowView} key={index}>
                                <Text style={{ color: '#333' }}>{item.text}:</Text>
                                <Text style={{ color: '#333' }}>{data[item.id] ? data[item.id] : item.number} {item.id === 'firstRecharge' ? `(${data['firstRechargeUserCount'] || item['firstRechargeUserCount']}人)` : null}</Text>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[ styles.btn, {backgroundColor: stylesGlobal.activeBtn.bg }]}
                        onPress={() => {
                            navigation.navigate('LowerLevelDetailList', { startDate, endDate })
                        }}
                    >
                        <Text style={[{ color: stylesGlobal.activeBtn.txtColor, fontWeight: 'bold' }]}>下级详情</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    rowView: {
        flexDirection: 'row',
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'space-between'
    },
    dateView: {
        backgroundColor: '#DDDDDD',
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    btn: {
        width: width*0.8,
        height: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20
    }
})

