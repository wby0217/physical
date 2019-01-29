//  代理中心首页

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
import { service, ErrorHandle, Action, constants, Header, stylesGlobal, Icons } from '../../mesosphere';
import { saveUserInfo } from '../../../service/authService';

const { width, height } = Dimensions.get('window');
export default class Agency extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return ({
            header: null,
        })
    }
    constructor(props) {
        super(props)
        this.state = {
            data: [
                {
                    id: 'subordinateCount',
                    text: '团队人数',
                    number: 0,
                    iconColor: '#F6AF3B'
                },
                {
                    id: 'subordinateBalance',
                    text: '团队总金额',
                    number: 0,
                    iconColor: '#D05702'
                },
                {
                    id: 'yesterdayTotalRecharge',
                    text: '昨日充值',
                    number: 0,
                    iconColor: '#0F519D'
                },
                {
                    id: 'yesterdayTotalBet',
                    text: '昨日有效投注',
                    number: 0,
                    iconColor: '#65A0E5'
                }
            ],
            btnList: [
                {
                    iconName: 'icon-agent-team',
                    iconColor: '#F6AF3B',
                    text: '代理方案',
                    iconSize: 40,
                    routeName: 'SchemeProtocols'
                },
                {
                    iconName: 'icon-column-chart',
                    iconColor: '#5F96D4',
                    text: '详细报表',
                    iconSize: 45,
                    routeName: 'ReportDetails'
                },
                {
                    iconName: 'icon-open-door',
                    iconColor: '#93C858',
                    text: '下级开户',
                    iconSize: 40,
                    routeName: 'LowerLevelCreateAccount'
                }
            ]
        }
    }
    componentDidMount() {
        const { data } = this.state;
        service.getAgentInfoService()
        .then(res => {
            data.map((item, index) => {
                item.number = res.data[item.id]
            })
            this.setState({ data: data })
        })
        .catch(err => {
            ErrorHandle(err)
        })
    }
    render() {
        const { navigation } = this.props;
        const { data, btnList } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Header
                    headerTitle="代理中心"
                    navigation={navigation}
                />
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ borderBottomColor: '#ddd', borderBottomWidth: StyleSheet.hairlineWidth }}>
                        {
                            data.map((item, index) =>
                                <View style={[styles.rowView]} key={index}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: 7, height: 7, backgroundColor: item.iconColor }} />
                                        <Text style={{ marginLeft: 5, color: '#333' }}>{item.text}</Text>
                                    </View>
                                    <View>
                                        <Text style={{ color: '#333' }}>{item.number}{index === 0 ? '人' : null}</Text>
                                    </View>
                                </View>
                            )
                        }
                    </View>
                    <View style={styles.colView}>
                    {
                        btnList.map((item, index) =>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate(item.routeName)
                            }}
                            activeOpacity={1}
                            style={[ styles.colItem, index % 2 === 0 ? styles.rightBorder : null, styles.bottomBorder, index === btnList.length -1 ? { borderBottomWidth: 0 } : null  ]} key={index}>
                            <Icons name={item.iconName} color={item.iconColor} size={item.iconSize} />
                            <Text style={{ color: '#333333', marginTop: 5 }}>{item.text}</Text>
                        </TouchableOpacity>
                        )
                    }
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    rowView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        height: 40,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    colView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        backgroundColor: '#fff'
    },
    colItem: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        width: width / 2
    },
    bottomBorder: {
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    rightBorder: {
        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: '#E5E5E5'
    }
})