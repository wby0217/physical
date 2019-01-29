// 比赛结果详情页

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
import { Icons, service, ErrorHandle, Action, constants } from '../mesosphere';
import ParallaxView from '../../vendor/react-native-parallax-view';
import FootballTemp from './footballTemplate';
import BasketballTemp from './basketBallTemplate';
import TennisballTemp from './tennisballTemplate';
import ChampionTemplate from './championTemplate';
import SnookerTemplate from './snookerTemplate';

const moment = require('moment');
const { width } = Dimensions.get('window')
export default class ResultDetail extends Component {
    static navigationOptions = ({ navigation }) => {
        return ({
            header: null,
        })
    }
    constructor(props) {
        super(props)
        this.state = {
            resultData: {}
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        service.matchResultDetailsService(params)
        .then(res => {
            this.setState({
                resultData: res.data
            });
        })
        .catch(err => {
            console.log(err);
        })
    }
    renderTempBySport = () => {
        const { navigation } = this.props;
        const { sport, type } = navigation.state.params;
        const { resultData } = this.state;
        if(type == 'outright') {
            return (<ChampionTemplate resultData={resultData} />)
        }else if (sport === 'football') {
            return (<FootballTemp resultData={resultData} {...this.props} />)
        } else if( sport === 'tennis') {
            return (<TennisballTemp resultData={resultData} {...this.props} />)
        } else if (sport === 'basketball'){
            return (<BasketballTemp resultData={resultData} {...this.props} />)
        } else if (sport === 'snooker') {
            return (<SnookerTemplate resultData={resultData} {...this.props} />)
        }
    }
    renderDetailsHeader = () => {
        const { navigation } = this.props;
        const { type } = navigation.state.params;
        const { resultData } = this.state;
       return type == 'outright' ?
            <View style={styles.header}>
                <View style={styles.headerTitleView}>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text style={styles.headerTitleText}>{resultData.homeName ? resultData.homeName : null}</Text>
                    </View>
                    <View style={styles.vsView}>
                        <Text style={{ color: '#17A84B', fontWeight: 'bold' }}>VS</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headerTitleText}>{resultData.guestName ? resultData.guestName : null}</Text>
                    </View>
                </View>
                <View style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 12, padding: 3, backgroundColor: '#145218' }}>{resultData.beginTime ? moment(resultData.beginTime).format('YYYY-MM-DD') : null}</Text>
                </View>
            </View>
        :
            <View style={styles.header}>
                <View style={styles.headerTitleView}>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text style={styles.headerTitleText}>{resultData.homeName ? resultData.homeName : null}</Text>
                    </View>
                    <View style={styles.vsView}>
                        <Text style={{ color: '#17A84B', fontWeight: 'bold' }}>VS</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headerTitleText}>{resultData.guestName ? resultData.guestName : null}</Text>
                    </View>
                </View>
                <View style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 12, padding: 3, backgroundColor: '#145218' }}>{resultData.beginTime ? moment(resultData.beginTime).format('YYYY-MM-DD') : null}</Text>
                </View>
            </View>
    }
    render() {
        const { navigation } = this.props;
        const { type } = navigation.state.params;
        const { resultData } = this.state;
        return (
            <View style={styles.container}>
                <ParallaxView
                        backgroundSource={require('../../assets/images/match_result_bg.png')}
                        windowHeight={115}
                        header={
                            type == 'outright' ?
                            <View style={styles.header}>
                                <View style={styles.headerTitleView}>
                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                        <Text style={styles.headerTitleText}>{resultData.matchName ? resultData.matchName : null}</Text>
                                    </View>
                                </View>
                                <View style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: '#fff', fontSize: 12, padding: 3, backgroundColor: '#145218' }}>{resultData.endTime ? moment(resultData.endTime).format('YYYY-MM-DD HH:mm:ss') : null}</Text>
                                </View>
                            </View>
                        :
                            <View style={styles.header}>
                                <View style={styles.headerTitleView}>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <Text style={styles.headerTitleText}>{resultData.homeName ? resultData.homeName : null}</Text>
                                    </View>
                                    <View style={styles.vsView}>
                                        <Text style={{ color: '#17A84B', fontWeight: 'bold' }}>VS</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.headerTitleText}>{resultData.guestName ? resultData.guestName : null}</Text>
                                    </View>
                                </View>
                                <View style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: '#fff', fontSize: 12, padding: 3, backgroundColor: '#145218' }}>{resultData.beginTime ? moment(resultData.beginTime).format('YYYY-MM-DD HH:mm:ss') : null}</Text>
                                </View>
                            </View>
                        }
                    >
                    {this.renderTempBySport()}
                </ParallaxView>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                    style={{ position: 'absolute', top: 25, backgroundColor: 'transparent', padding: 5 }}
                >
                    <Icons name="icon-back-large" color="#ffffff" size={22} />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1
    },
    headerTitleView: {
        flexDirection: 'row',
        height: 30,
        alignItems: 'center'
    },
    headerTitleText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    vsView: {
        backgroundColor: '#fff',
        height: 30,
        width: 30,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15 
    },
    listRowView: {
        flexDirection: 'row',
        height: 35,
        alignItems: 'center'
    },
    
})