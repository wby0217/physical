// 网球比赛结果详情模板

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
const moment = require('moment');
const { width } = Dimensions.get('window')


export default class TennisballTemp extends Component {
    render() {
        const { resultData } = this.props;
       return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F9' }}>
            <View style={[styles.listRowView, { backgroundColor: '#D8EBD4' }]}>
                <View style={{ flex: 2, paddingHorizontal: 8 }}>
                    <Text numberOfLines={1} ></Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'center', paddingHorizontal: 4 }}>
                    <Text numberOfLines={1}>{resultData.homeName ? resultData.homeName : null}</Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'center', paddingHorizontal: 4 }}>
                    <Text numberOfLines={1}>{resultData.guestName ? resultData.guestName : null}</Text>
                </View>
            </View>
            <View style={[styles.listRowView, { backgroundColor: '#F5F5F9' }]}>
                <View style={{ flex: 2, paddingHorizontal: 8 }}>
                    <Text numberOfLines={1} >第一盘</Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'center', paddingHorizontal: 4 }}>
                    <Text numberOfLines={1}>{resultData.result ? resultData.result.homeScore1st : null}</Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'center', paddingHorizontal: 4 }}>
                    <Text numberOfLines={1}>{resultData.result ? resultData.result.guestScore1st : null}</Text>
                </View>
            </View>
            <View style={[styles.listRowView, { backgroundColor: '#fff' }]}>
                <View style={{ flex: 2, paddingHorizontal: 8 }}>
                    <Text numberOfLines={1} >第二盘</Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'center', paddingHorizontal: 4 }}>
                    <Text numberOfLines={1}>{resultData.result ? resultData.result.homeScore2nd : null}</Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'center', paddingHorizontal: 4 }}>
                    <Text numberOfLines={1}>{resultData.result ? resultData.result.guestScore2nd : null}</Text>
                </View>
            </View>
            <View style={[styles.listRowView, { backgroundColor: '#F5F5F9' }]}>
                <View style={{ flex: 2, paddingHorizontal: 8 }}>
                    <Text numberOfLines={1} >第三盘</Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'center', paddingHorizontal: 4 }}>
                    <Text numberOfLines={1}>{resultData.result ? resultData.result.homeScore3rd : null}</Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'center', paddingHorizontal: 4 }}>
                    <Text numberOfLines={1}>{resultData.result ? resultData.result.guestScore3rd : null}</Text>
                </View>
            </View>
            <View style={[styles.listRowView, { backgroundColor: '#fff' }]}>
                <View style={{ flex: 2, paddingHorizontal: 8 }}>
                    <Text numberOfLines={1} >第四盘</Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'center', paddingHorizontal: 4 }}>
                    <Text numberOfLines={1}>{resultData.result ? resultData.result.homeScore4th : null}</Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'center', paddingHorizontal: 4 }}>
                    <Text numberOfLines={1}>{resultData.result ? resultData.result.guestScore4th : null}</Text>
                </View>
            </View>
            <View style={[styles.listRowView, { backgroundColor: '#F5F5F9' }]}>
                <View style={{ flex: 2, paddingHorizontal: 8 }}>
                    <Text numberOfLines={1} >第五盘</Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'center', paddingHorizontal: 4 }}>
                    <Text numberOfLines={1}>{resultData.result ? resultData.result.homeScore5th : null}</Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'center', paddingHorizontal: 4 }}>
                    <Text numberOfLines={1}>{resultData.result ? resultData.result.guestScore5th : null}</Text>
                </View>
            </View>
            <View style={[styles.listRowView, { backgroundColor: '#fff' }]}>
                <View style={{ flex: 2, paddingHorizontal: 8 }}>
                    <Text numberOfLines={1} >让局</Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'center', paddingHorizontal: 4 }}>
                    <Text numberOfLines={1}>{resultData.result ? resultData.result.homeScoreHandicap : null}</Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'center', paddingHorizontal: 4 }}>
                    <Text numberOfLines={1}>{resultData.result ? resultData.result.guestScoreHandicap : null}</Text>
                </View>
            </View>
            <View style={[styles.listRowView, { backgroundColor: '#fff' }]}>
                <View style={{ flex: 2, paddingHorizontal: 8 }}>
                    <Text numberOfLines={1} >完赛</Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'center', paddingHorizontal: 4 }}>
                    <Text numberOfLines={1}>{resultData.result ? resultData.result.homeScore : null}</Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'center', paddingHorizontal: 4 }}>
                    <Text numberOfLines={1}>{resultData.result ? resultData.result.guestScore : null}</Text>
                </View>
            </View>
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