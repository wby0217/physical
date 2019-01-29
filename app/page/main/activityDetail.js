// 活动详情页

import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    WebView,
    Platform
} from 'react-native';
import { Icon, service, ErrorHandle, Action, constants, Header } from '../mesosphere';
import { OverlaySpinner, Nodata } from '../../component/tips';
import HTML from 'react-native-render-html';
import _ from 'lodash';

const moment = require('moment');
require('moment/locale/zh-cn');
moment.locale('zh-cn');
const { width, height } = Dimensions.get('window');
const isIos = Platform.OS === 'ios';
export default class ActivityDetail extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null,
        title: '活动详情',
        headerTintColor: '#fff',
        headerTitleStyle: {
            alignSelf: 'center'
        }
    });
    constructor(props) {
        super(props);
        this.state = {
            activeDetail: {}
        }
    }
    componentDidMount() {
        const { state } = this.props.navigation;
        const { activityId } = state.params;
        service.getActivityInfo({ activityId })
        .then(res => {
            this.setState({
                activeDetail: res.data
            });
        })
        .catch(err => {
            ErrorHandle(err)
        })
    }
    render () {
        const { activeDetail } = this.state;
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <Header
                    headerTitle="活动详情"
                    navigation={navigation}
                />
                <View style={{ flex: 1 }}>
                    <View style={{ borderBottomColor: '#E5E5E5', borderBottomWidth: StyleSheet.hairlineWidth, padding: 10 }}>
                        <Text style={{ fontSize: 18, color: '#25BEFA' }}>{activeDetail.activityName}</Text>
                        <Text style={{ color: '#666666', fontSize: 12, marginTop: 10 }}>活动时间: {moment(activeDetail.startTime).format('YYYY-MM-DD')} 至 {moment(activeDetail.finishTime).format('YYYY-MM-DD')}</Text>
                    </View>
                    {/* {activeDetail.activityIntroduction ?
                        <HTML
                            html={activeDetail.activityIntroduction}
                            imagesMaxWidth={width-20}
                            ignoredStyles={['font-family', 'font-variant-numeric', 'font-weight']}
                        />
                        :null
                    } */}
                    {activeDetail.activityDescription ?
                        // <HTML
                        //     html={activeDetail.activityDescription}
                        //     imagesMaxWidth={width-20}
                        //     ignoredStyles={['font-family', 'font-variant-numeric', 'font-weight']}
                        // />
                        <WebView
                            source={{ html: activeDetail.activityDescription, baseUrl: '' }}
                            style={{ width, height: isIos ? height-100: height, fontSize: 14,  }}
                            scalesPageToFit
                            automaticallyAdjustContentInsets
                            domStorageEnabled={true}
                            javaScriptEnabled={true}
                        />
                        :null
                    }
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    banner: {
        width: width - 20,
        height: width * 260 / 750,
        resizeMode: 'contain'
    }
});