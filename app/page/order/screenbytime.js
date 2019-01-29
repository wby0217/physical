// 自定义时间筛选

import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import { Header, Icons, stylesGlobal } from '../mesosphere';

class ScreenByTime extends Component {
    constructor(props) {
        super(props)
        this.state = {
            endValid: true,
            startTime: props.period && props.period.startTime|| '',
            endTime:  props.period && props.period.endTime || '',
            btnText: '全部'
        }
    }
    formatStartDate = (startTime) => {
        this.setState({ startTime }, this.validTime);
    }
    formatEndDate = (endTime) => {
        this.setState({ endTime }, this.validTime);
    }
    validTime = () => {
        const { startTime, endTime } = this.state;
        if( startTime && startTime && new Date(endTime).getTime() <= new Date(startTime).getTime() ) {
            this.setState({ endValid: false });
        } else {
            this.setState({ endValid: true });
        }
        if(!startTime && !endTime) {
            this.setState({ btnText: '全部' });
        } else {
            this.setState({ btnText: '确定' });
        }
    }
    headerRight = () => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({ startTime: '', endTime: '', btnText: '全部' })
                }}
            >
                <Text style={{ color: '#fff' }}>清除</Text>
            </TouchableOpacity>
        )
    }
    render() {
        const { navigation } = this.props;
        const { endValid, startTime, endTime, btnText } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Header
                    navigation={navigation}
                    headerTitle= "自定义筛选"
                    headerRight= {this.headerRight}
               />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 40, alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 8, borderBottomColor: '#E5E5E5', borderBottomWidth: StyleSheet.hairlineWidth }}>
                    <View>
                        <Text style={{ color: '#333' }}>开始时间</Text>
                    </View>
                    <TouchableOpacity style={styles.rowColBase}>
                        <DatePicker
                            mode="date"
                            format="YYYY-MM-DD"
                            customStyles={{dateIcon: { display: 'none' }, dateInput: { borderWidth: 0 }}}
                            onDateChange={this.formatStartDate}
                            placeholder="请选择开始日期"
                            date= {startTime}
                            style={{ width: 110 }}
                        />
                        <Icons  name="icon-right-arrow-normal" color="#999" size={14} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 40, alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 8 }}>
                    <View>
                        <Text style={{ color: '#333' }}>结束时间</Text>
                    </View>
                    <TouchableOpacity style={styles.rowColBase}>
                        <DatePicker
                            mode="date"
                            format="YYYY-MM-DD"
                            customStyles={{dateIcon: { display: 'none' }, dateInput: { borderWidth: 0 }}}
                            onDateChange={this.formatEndDate}
                            placeholder="请选择结束日期"
                            date= {endTime}
                            style={{ width: 110 }}
                        />
                        <Icons  name="icon-right-arrow-normal" color="#999" size={14} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        navigation.goBack();
                        navigation.state.params && navigation.state.params.backHandle && navigation.state.params.backHandle({ startTime, endTime });
                    }}
                    disabled={!endValid}
                    style={[styles.buttonBase,!endValid ?{ backgroundColor: stylesGlobal.disableBtn.bg }: { backgroundColor: stylesGlobal.activeBtn.bg}]}
                >
                    <Text style={[{ fontSize: 16, fontWeight: 'bold' }, !endValid ? {color: stylesGlobal.disableBtn.txtColor}:{color: stylesGlobal.activeBtn.txtColor}]}>{btnText}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonBase: {
        height: 30,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 50
    },
    rowColBase: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const mapStateToProps = (state) => {
    return {
        period: state.match.orderScreenByPeriod
    }
}

export default connect(mapStateToProps)(ScreenByTime);