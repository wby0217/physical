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
    FlatList
} from 'react-native';
import { connect } from 'react-redux';
import { service, ErrorHandle, Action, constants, Header, stylesGlobal, Icons } from '../../mesosphere';

export default class LowerLevelDetailList extends Component {
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
            ]
        }
        this.pageIndex = 1;
    }
    componentDidMount() {
        this.fetchPage();
    }
    fetchPage = async () => {
        const { startDate, endDate } = this.props.navigation.state.params;
        const params = { startDate, endDate, page: this.pageIndex };
        try {
            const results = await service.getTeamListService(params);
            if(results.data.length > 0) {
                this.setState(
                    {
                        data: this.pageIndex === 1 ? results.data : this.state.data.concat(results.data),
                    })
            } else {
                return false;
            }
        } catch(err) {
            ErrorHandle(err)
        }
    }
    onRefresh = () => {
        this.pageIndex = 1;
        this.setState({
            data: [],
        },this.fetchPage)
    }
    handleLoadMore = () => {
        this.pageIndex ++;
        this.fetchPage();
    }
    renderItem = ({ item, index }) => {
        return (
            <View style={[ styles.rowView, index % 2 === 0 ? { backgroundColor: '#fff' } : null ]}>
                <View style={styles.colView}>
                    <Text style={styles.colText}>{item.userName}</Text>
                </View>
                <View style={styles.colView}>
                    <Text style={styles.colText}>{item.totalRecharge}</Text>
                </View>
                <View style={styles.colView}>
                    <Text>{item.totalWithdraw}</Text>
                </View>
                <View style={styles.colView}>
                    <Text style={styles.colText}>{item.totalBet}</Text>
                </View>
                <View style={styles.colView}>
                    <Text style={styles.colText}>{item.totalBonus}</Text>
                </View>
                <View style={styles.colView}>
                    <Text style={styles.colText}>{item.profit}</Text>
                </View>
            </View>
        )
    }
    renderListHeader = () => {
        return (
            <View style={styles.titleRow}>
                <View style={styles.colView}>
                    <Text style={styles.colText}>账户</Text>
                </View>
                <View style={styles.colView}>
                    <Text style={styles.colText}>充值</Text>
                </View>
                <View style={styles.colView}>
                    <Text>提现</Text>
                </View>
                <View style={styles.colView}>
                    <Text style={styles.colText}>有效投注</Text>
                </View>
                <View style={styles.colView}>
                    <Text style={styles.colText}>派彩</Text>
                </View>
                <View style={styles.colView}>
                    <Text style={styles.colText}>实际盈亏</Text>
                </View>
            </View>
        )
    }
    render() {
        const { navigation } = this.props;
        const { data } = this.state;
        const { startDate, endDate } = navigation.state.params;
        return (
            <View style={{ flex: 1, backgroundColor: '#F5F5F9' }}>
                <Header
                    headerTitle="详细报表"
                    navigation={navigation}
                />
                <View style={{ flexDirection: 'row', height: 45, alignItems: 'center' }}>
                    <View style={{ paddingHorizontal: 10 }}>
                        <Icons name="icon-simple-calendar" size={20} color={'#333'} />
                    </View>
                    <View style={{ paddingHorizontal: 5 }}>
                        <Text style={{ color: '#333' }}>{ startDate }</Text>
                    </View>
                    <Text style={{ color: '#333'}}>-</Text>
                    <View style={{ paddingHorizontal: 5 }}>
                        <Text style={{ color: '#333' }}>{ endDate }</Text>
                    </View>
                </View>
                <ScrollView
                    horizontal={true}
                    alwaysBounceHorizontal={false}
                    bounces={false}
                >
                    <View style={{ flex: 1, backgroundColor: '#F5F5F9' }}>
                        <FlatList
                            data={data}
                            extraData={this.state}
                            renderItem= {this.renderItem}
                            onEndReached={this.handleLoadMore}
                            onEndReachedThreshold={1}
                            ListHeaderComponent={this.renderListHeader}
                            onRefresh = {this.onRefresh}
                            refreshing= {false}
                            style={{ flex: 1 }}
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    titleRow: {
        flexDirection: 'row',
        height: 40,
        backgroundColor: '#FFF8BC',
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#E5E5E5'
    },
    rowView: {
        flexDirection: 'row',
        height: 35,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    colView: {
        width: 90,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightColor: '#E5E5E5',
        borderRightWidth: StyleSheet.hairlineWidth
    },
    colText: {
        color: '#333333'
    }
})