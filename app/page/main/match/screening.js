// 按联盟筛选

import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    InteractionManager
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import _ from 'lodash';
import { OverlaySpinner, Nodata } from '../../../component/tips';
import { Icons, service, ErrorHandle, Action, Header, constants } from '../../mesosphere';
import Accordion from '../../../component/Accordion';

const { width } = Dimensions.get('window');
class Screening extends Component {
     static navigationOptions = ({ navigation }) => ({
            header: null,
            headerTitle: '选择联赛'
     })
    constructor(props) {
        super(props)
        this.state = {
            hotMatch: [],
            otherMatch: [],
            activeId: [],
            selectCheckbox: '',   // all 、hot 、other
            isConnecting: false,
            noDataStatus: false
        }
        this.activeIds =[];
        this.navigation = props.navigation;
    }
    componentDidMount() {
        const { EventTypeIndex, matchEventType, navigation } = this.props;
        const eventType = matchEventType ? matchEventType.typeEngName : 'today';
        const eventTypeIndex = EventTypeIndex ? EventTypeIndex : 0;
        const engName = navigation.state.params.engName || '';
        const tabs = constants['tabsMapping'][engName];
        const tabsArr = [];
        for (let key in tabs) {
            tabsArr.push(key)
        }
        this.toggleOverlay();
        service.getAllianceService({ eventType, playTypeGroup: tabsArr[eventTypeIndex], sportType: engName })
        .then(res => {
            this.setState({
                isConnecting: false
            })
            if(_.isArray(res.data) && !res.data.length) {
                this.setState({
                    noDataStatus: true
                })
                // 没数据
                return ;
            }
            this.setState({
                hotMatch: res.data.hot,
                otherMatch: res.data.others
            })
        })
        .catch(err => {
            this.setState({
                isConnecting: false
            },() => ErrorHandle(err))
        })
    }
    selectCheckbox (key) {
        const { selectCheckbox, hotMatch, otherMatch } = this.state;
        if( key === selectCheckbox) {
            this.activeIds = [];
            this.setState({ selectCheckbox: '', activeId: [] });
            return;
        } else {
            this.setState({ selectCheckbox: key });
        }
        let hotMatchId = [],otherMatchId = [];
        hotMatch.length > 0 && hotMatch.map((n,i)=>{
           hotMatchId.push( _.result(n,'id'))
        });
        otherMatch.length > 0 && otherMatch.map((n,i)=>{
           otherMatchId.push( _.result(n,'id'))
        });
        switch (key) {
            case 'all' :
                this.activeIds = hotMatchId.concat(otherMatchId);
                this.setState({ activeId: hotMatchId.concat(otherMatchId) })
                break;
            case 'hot' :
                this.activeIds = hotMatchId;
                this.setState({ activeId: hotMatchId})
                break;
            case 'other':
                this.activeIds = otherMatchId;
                this.setState({ activeId:otherMatchId })
                break;
            default:
                this.activeIds = [];
                this.setState({ activeId:[] })
        }
    }
    toggleSelcet(id) {
        // 选择联赛
        const inArr = _.indexOf(this.activeIds,id);
       if( inArr > -1){
            this.activeIds.splice(inArr,1);
            this.setState({
                activeId: this.activeIds
            })
       }else{
           this.activeIds.push(id)
           this.setState({
              activeId : this.activeIds
           })
       }
    }
    toggleOverlay = () => {
        // loading层开关
        this.setState({
            isConnecting: !this.state.isConnecting
        })
    }
    headerLeft = () => {
        const { navigation } = this.props;
        const params = navigation.state.params;
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.goBack();
                    params && params.countDown && params.countDown();
                }}
                style={{ backgroundColor: 'transparent' }}
            >
                <Icons name="icon-back-normal" color="#ffffff" size={22} />
            </TouchableOpacity>
        )
    }
    render() {
        const { otherMatch, hotMatch, activeId, selectCheckbox, isConnecting, noDataStatus } = this.state;
        const { navigation } = this.props;
        return(
            <View style={styles.container}>
                <Header
                    headerTitle="选择联赛"
                    navigation = {navigation}
                    headerLeft= {this.headerLeft}
                    />
                {noDataStatus ? <Nodata/>:
                <View style={{paddingHorizontal:10}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:30,backgroundColor:'#fff',borderRadius: 15, marginTop:10}}>
                        <TouchableOpacity
                            onPress={this.selectCheckbox.bind(this,'all')}
                            activeOpacity={0.8} style={[ styles.leagueTitleView, selectCheckbox === 'all' ? {backgroundColor: '#17A84B'}: null]}>
                            <Text style={selectCheckbox === 'all' ? {color: '#fff'}: null}> 全部</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.selectCheckbox.bind(this,'hot')}
                            activeOpacity={0.8}  style={[ styles.leagueTitleView, selectCheckbox === 'hot' ? {backgroundColor: '#17A84B'}: null]}>
                            <Text style={selectCheckbox === 'hot' ? {color: '#fff'}: null}> 仅热门联赛</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={this.selectCheckbox.bind(this,'other')}
                            activeOpacity={0.8} style={[ styles.leagueTitleView, selectCheckbox === 'other' ? {backgroundColor: '#17A84B'}: null]}>
                            <Text style={selectCheckbox === 'other' ? {color: '#fff'}: null}> 仅其它</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={{paddingBottom:160}}>
                    {hotMatch.length > 0 ?
                    <View style={{marginTop:10}}>
                        <Accordion
                            collapsed={false}
                            title="热门赛事"
                            icon = {
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icons name="icon-hot" size={16} color="#FF5050"/>
                                </View>
                            }
                            titleStyle={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E3E3E3' }}
                        >
                        {hotMatch.map((n,i)=>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={this.toggleSelcet.bind(this,n.id)}
                                style={styles.listRow} key={i}>
                                <View style={{ flexDirection: 'row' }}>
                                    {(_.indexOf(activeId,n.id) > -1) ? <Icons name="icon-simple-checked" size={16} color="#17A84B" style={{ marginRight: 8 }} /> : <Icons name="icon-simple-uncheck" size={16} color="#BEBEBE" style={{ marginRight: 8 }} />}
                                    <Text style={(_.indexOf(activeId,n.id) > -1)?styles.activeTextClass:null}>{n.name}</Text>
                                </View>
                                <Text style={{color:'#999'}}>{n.eventNum}</Text>
                            </TouchableOpacity>
                        )}
                        </Accordion>
                    </View> : null}
                    {otherMatch.length > 0 ?
                    <View style={{marginTop:10}}>
                        <Accordion
                            collapsed={false}
                            title="其它"
                            icon ={
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icons name="icon-other" size={16} color="#609CE3"/>
                                </View>
                            }
                            titleStyle={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E3E3E3' }}
                        >
                        {otherMatch.map((n,i)=>
                            <TouchableOpacity 
                                onPress={this.toggleSelcet.bind(this,n.id)}
                                activeOpacity={0.8}
                                style={styles.listRow} key={i}>
                                <View style={{ flexDirection: 'row' }}>
                                    {(_.indexOf(activeId,n.id) > -1) ?<Icons name="icon-simple-checked" size={16} color="#17A84B" style={{ marginRight: 8 }} /> : <Icons name="icon-simple-uncheck" size={16} color="#BEBEBE" style={{ marginRight: 8 }} />}
                                    <Text style={(_.indexOf(activeId,n.id) > -1)?styles.activeTextClass:null}>{n.name}</Text>
                                </View>
                                <Text style={{color:'#999'}}>{n.eventNum}</Text>
                            </TouchableOpacity>
                        )}
                        </Accordion>
                    </View>: null}
                    </ScrollView>
                </View>}
                <View style={styles.footView}>
                    <TouchableOpacity
                        activeOpacity={1} 
                        onPress={() => {
                            this.navigation.goBack()
                        }}
                        style={[styles.footBtn,{backgroundColor:'#fff'}]}>
                        <Text style={{color:'#666'}}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            const params = navigation.state.params;
                            this.props.betTimer && clearTimeout(this.props.betTimer);
                            this.navigation.dispatch(Action.checkAllianceId(activeId.join(',')));
                            this.navigation.goBack();
                            params && params.countDown && params.countDown();
                        }}
                        style={[styles.footBtn,{backgroundColor:'#17A84B'}]}>
                        <Text style={{color:'#fff'}}>送出</Text>
                    </TouchableOpacity>
                </View>
                <OverlaySpinner
                    visible= {isConnecting}
                    onTouchShade={this.toggleOverlay}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1
    },
    listRow:{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            paddingHorizontal:10,
            borderBottomWidth:StyleSheet.hairlineWidth,
            borderBottomColor:'#E3E3E3',
            backgroundColor:'#fff',
            height:40,
            flex: 1
        },
        defaultTitle:{
            flex: 1,
            height:40,
            backgroundColor:'#fff',
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            paddingHorizontal:10,
            borderBottomWidth:StyleSheet.hairlineWidth,
            borderBottomColor:'#E3E3E3',
            marginBottom: 5,
        },
        footView:{
            position:'absolute',
            width: width,
            height: 40,
            bottom: 0,
            left: 0,
            flexDirection:'row',
            borderTopColor: '#f5f5f5',
            borderTopWidth: StyleSheet.hairlineWidth,

        },
        footBtn:{
            width:width/2,
            justifyContent:'center',
            alignItems:'center'
        },
        activeTextClass:{
            color:'#17A84B'
        },
        leagueTitleView: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: 30,
            borderRadius: 15
        }
})
const mapStateToProps = (state) => {
    return {
        matchEventType: state.match.matchReducer.matchEventType,
        EventTypeIndex: state.match.eventTypeIndexReducer.EventTypeIndex,
        betTimer: state.match.saveBetTimer.betTimer
    }
}

export default connect(mapStateToProps)(Screening);