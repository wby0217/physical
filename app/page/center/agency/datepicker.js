 // 日期选择

 import React, { Component } from 'react';
 import {
     View,
     StyleSheet,
     Text,
     Image,
     TouchableOpacity,
     ScrollView,
     Dimensions,
     InteractionManager
 } from 'react-native';
 import { Calendar, CalendarList, Agenda } from 'react-native-calendar';
 import Moment from 'moment';
 import { service, ErrorHandle, Action, constants, Header, stylesGlobal } from '../../mesosphere';
 
 const baseDateArgs = {  color: '#17A84B', textColor: '#fff' };
 const dateArgs = { color: '#FFF8BD', textColor: '#000000' }
 export default class LowerLevelCreateAccount extends Component {
     static navigationOptions = ({ navigation }) => {
         const { state } = navigation;
         return ({
             header: null,
         })
     }
     // moment(date).diff(moment(), 'days')
     constructor(props) {
         super(props)
         this.state = {
             selectDay: {},
             startDate: Moment().format('YYYY-MM-01'),
             endDate: Moment().format('YYYY-MM-DD')
         }
         this.startAndEndDate = [];
     }
     componentDidMount() {
         const { startDate, endDate } = this.state;
         InteractionManager.runAfterInteractions(() => {
            this.getCalendarsByStartDayToEndDay( startDate, endDate );
         })
     }
     onDayPress = (day) => {
        const { startAndEndDate } = this.state;
        const dayStr = day.dateString;
        if(this.startAndEndDate.length < 2) {
            if(this.startAndEndDate.length > 0) {
                const diffDays = Moment(dayStr).diff(Moment(Object.keys(this.startAndEndDate[0])[0]), 'days');
                if(this.startAndEndDate.length === 1) {
                    for(var i=1; i< diffDays; i++) {
                        const daysKey = Moment(Object.keys(this.startAndEndDate[0])[0]).add(i, 'days').format('YYYY-MM-DD');
                        this.startAndEndDate.push({
                            [daysKey]: dateArgs
                        })
                    }
                }
                if(diffDays < 0) {
                    this.state.selectDay = {};
                    this.startAndEndDate = [{ [dayStr]: Object.assign({}, baseDateArgs, { text: '开始' }) }];
                } else {
                    this.startAndEndDate.map((item, index) => {
                        if(Object.keys(item)[0] == dayStr) {
                            this.startAndEndDate.splice(index, 1)
                        } else {
                            this.startAndEndDate.push({ [dayStr]: Object.assign({}, baseDateArgs, { text: '结束' }) })
                        }
                    })
                }
            } else {
                this.startAndEndDate.push({ [dayStr]: Object.assign({}, baseDateArgs, { text: '开始' }) })
            }
        } else {
            this.startAndEndDate = [{ [dayStr]: Object.assign({}, baseDateArgs, { text: '开始' }) }]
            this.state.selectDay = {}
        }
        
        if(this.startAndEndDate.length > 0) {
            this.startAndEndDate.map((item, index) => {
                this.state.selectDay[Object.keys(item)[0]] = Object.values(item)[0];
            })
        } else {
            this.state.selectDay = {};
        }
        this.setState({
            selectDay: JSON.parse(JSON.stringify(this.state.selectDay)),
            startDate: this.startAndEndDate[(0)] ?Object.keys(this.startAndEndDate[0])[0] : Moment().format('YYYY-MM-DD'),
            endDate: this.startAndEndDate[(this.startAndEndDate.length -1)] ? Object.keys(this.startAndEndDate[(this.startAndEndDate.length -1)])[0] : Moment().format('YYYY-MM-DD')
        })
        
     }
     getCalendarsByStartDayToEndDay = (startDay, endDay) => {
        const diffDays = Moment(endDay).diff(Moment(startDay), 'days');
        for(var i=0; i<= diffDays; i++) {
            const daysKey = Moment(startDay).add(i, 'days').format('YYYY-MM-DD');
            if( i === 0 || i === diffDays) {
                this.startAndEndDate.push({
                    [daysKey]: baseDateArgs
                })
            } else {
                this.startAndEndDate.push({
                    [daysKey]: dateArgs
                })
            }
        }
        if(this.startAndEndDate.length > 0) {
            this.startAndEndDate.map((item, index) => {
                this.state.selectDay[Object.keys(item)[0]] = Object.values(item)[0];
            })
        } else {
            this.state.selectDay = {};
        }
        this.setState({
            selectDay: JSON.parse(JSON.stringify(this.state.selectDay))
        })
     }
     render() {
         const { navigation } = this.props;
         const { selectDay, startDate, endDate } = this.state;
         return (
             <View style={{ flex: 1 }}>
                 <Header
                     headerTitle="按照日期查找"
                     navigation={navigation}
                 />
                    <View style={ styles.weekRowView }>
                        <View style={styles.weekGridCol}>
                            <Text style={{ color: '#B4B4B4' }}>日</Text>
                        </View>
                        <View style={styles.weekGridCol}>
                            <Text style={{ color: '#B4B4B4' }}>一</Text>
                        </View>
                        <View style={styles.weekGridCol}>
                            <Text style={{ color: '#B4B4B4' }}>二</Text>
                        </View>
                        <View style={styles.weekGridCol}>
                            <Text style={{ color: '#B4B4B4' }}>三</Text>
                        </View>
                        <View style={styles.weekGridCol}>
                            <Text style={{ color: '#B4B4B4' }}>四</Text>
                        </View>
                        <View style={styles.weekGridCol}>
                            <Text style={{ color: '#B4B4B4' }}>五</Text>
                        </View>
                        <View style={styles.weekGridCol}>
                            <Text style={{ color: '#B4B4B4' }}>六</Text>
                        </View>
                    </View>
                    <CalendarList
                        // // Callback which gets executed when visible months change in scroll view. Default = undefined
                        // onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
                        // Max amount of months allowed to scroll to the past. Default = 50
                        pastScrollRange={10}
                        // Max amount of months allowed to scroll to the future. Default = 50
                        futureScrollRange={1}
                        hideDayNames={true}
                        // Enable or disable scrolling of calendar list
                        scrollEnabled={true}
                        maxDate={Moment().format('YYYY-MM-DD')}
                        onDayPress={this.onDayPress}
                        firstDay={1}
                        theme={{
                            calendarBackground: '#fff',
                            textSectionTitleColor: '#B9B9B9',
                            dayTextColor: '#333',
                            // todayTextColor: 'red',
                            selectedDayTextColor: '#333',
                            monthTextColor: '#B2B2B2',
                            selectedDayBackgroundColor: '#17A84B',
                            arrowColor: 'red',
                            // textDisabledColor: 'red',
                            'stylesheet.calendar.header': {
                                header: {
                                    alignItems: 'flex-start'
                                }
                            }
                        }}
                        // markedDates={{
                            // '2017-11-18': {  color: '#17A84B', selected: true, dots: { key:'vacation', color: 'red', selectedColor: 'blue' } },
                            // '2017-11-19': {  color: '#FFF8BD', textColor: '#333' },
                            // '2017-11-20': {  color: '#FFF8BD', textColor: '#333' },
                            // '2017-11-21': { selected: true, color: '#17A84B' },
                        // }}
                        markedDates={selectDay}
                        markingType={'period'}
                    />
                    <View style={{ height: 50, flexDirection: 'row', borderTopColor: '#DCDCDC', borderTopWidth: StyleSheet.hairlineWidth }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, backgroundColor: '#FAFCFF' }}>
                            <Text style={{ color: '#999999' }}>起止日期</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#333333' }}>{Moment(startDate).format('YYYY.MM.DD')}</Text>
                                <Text> - </Text>
                                <Text style={{ color: '#333333' }}>{Moment(endDate).format('YYYY.MM.DD')}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.goBack();
                                navigation.state.params.onBack({ startDate, endDate})
                            }}
                            style={{ backgroundColor: '#17A84B', width: 80, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>确定</Text>
                        </TouchableOpacity>
                    </View>
             </View>
         )
     }
 }
 const styles = StyleSheet.create({
     weekGridCol: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
     },
     weekRowView: {
        flexDirection: 'row',
        height: 35,
        backgroundColor: '#F3F3F3',
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 15
     }
 })