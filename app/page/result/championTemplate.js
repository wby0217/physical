// 冠军

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
const moment = require('moment');
const { width } = Dimensions.get('window')


export default class BasketballTemp extends Component {
    render() {
        const { resultData } = this.props;
       return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F9' }}>
            <View style={[styles.listRowView, { backgroundColor: '#D8EBD4' }]}>
                <View style={{ paddingHorizontal: 8 }}>
                    <Text numberOfLines={1} >{resultData.gameType ? resultData.gameType : null}</Text>
                </View>
            </View>
            {
                resultData.resultWhole && resultData.resultWhole.length > 0 ?
                resultData.resultWhole.map((item, index) => 
                    <View style={[styles.listRowView, index%2 == 0 ? { backgroundColor: '#F5F5F9' } : null]} key={index}>
                        <View style={{ flex: 4, paddingHorizontal: 8 }}>
                            <Text numberOfLines={1} >{item.team}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 4, justifyContent: "center" }}>
                            {item.win ? <Icons name="icon-cycle-success" size={16} color="#17A84B" /> : null}
                        </View>
                    </View>
                )
                : null
            }  
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
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between'
    },
    
})