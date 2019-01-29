// 最新公告

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Platform,
    WebView,
    Image
} from 'react-native';
import HTML from 'react-native-render-html';
import { Nodata, OverlaySpinner } from '../../component/tips';
import { Icon, service, ErrorHandle, Action, constants, Header } from '../mesosphere';

const { height, width } = Dimensions.get('window');
const isIos = Platform.OS === 'ios';
export default class LatestNotice extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return ({
            header: null,
            headerTitle: '最新公告',
            headerBackTitle: null
        })
    }
    constructor(props) {
        super(props)
        this.state = {
            dataList: props.navigation.state.params.notice,
            noDataStatus: false,
            refreshing: false,
            isConnecting: false
        }
        this.pageIndex = 1;
        this.totalPage = 1;
    }
    render() {
        const { dataList } = this.state;
        const { navigation } = this.props;
        return(
            <View style={{ flex: 1 }}>
                <Header
                    headerTitle="最新公告"
                    navigation={navigation}
                />
                <View style={{ flex: 1,backgroundColor:'#F5F5F9' }}>
                    {!!dataList?<View style={styles.border}/>:<View/>}
                    <ScrollView style={{ flex: 1 }}>
                        { !dataList.length > 0 ? <View style={{ flex: 1, height }}><Nodata /></View>:
                            <View style={{ flex: 1 }}>
                                {dataList.map((item, index) => {
                                    return (
                                        <View key={index} style={{flexDirection: 'row',justifyContent:'space-between',paddingHorizontal: 10}}>
                                            <View style={styles.left}>
                                                <Image style={styles.message} source={require('../../assets/images/message.png')}/>
                                            </View>
                                            <View>
                                                <View style={styles.rowView}>
                                                    <View style={styles.rowTitle}>
                                                        <Text style={{ color: '#333', fontSize: 16, }}>{item.noticeTitle}</Text>
                                                    </View>
                                                    <View style={styles.content}>
                                                        <HTML
                                                            html={item.noticeContent}
                                                            imagesMaxWidth={width-40}
                                                            ignoredStyles={['font-family', 'font-variant-numeric', 'font-weight']}
                                                        />
                                                    </View>
                                                    <View style={{height:30,justifyContent:'center'}}>
                                                        <Text style={styles.time}>{item.noticeCreatetime}</Text>
                                                    </View>
                                                </View>
                                                <Image style={styles.triangle} source={require('../../assets/images/triangle.png')}/>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        }
                    </ScrollView>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    rowView: {
        width: width * 632 / 750,
        backgroundColor: '#fff',
        marginTop: 10,
        borderRadius: 5,
        borderColor: '#E5E5E5',
        borderWidth: StyleSheet.hairlineWidth
    },
    rowTitle: {
        paddingHorizontal: 10,
        flex: 1,
        paddingVertical: 8,
        justifyContent: 'center'
    },
    p: {
        color: '#333',
        fontSize: 13,
        lineHeight: 21,
        letterSpacing: 2
    },
    time: {
        paddingHorizontal: 10,
        color: '#666666',
        fontSize: 12,
        backgroundColor: 'transparent'
    },
    content: {
        paddingHorizontal: 10,
        paddingBottom:10,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    triangle: {
        width: 9,
        height: 11,
        position: 'absolute',
        top: 30,
        left: -8
    },
    left: {
        width: width * 56 / 750,
        height: width * 56 / 750,
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderColor: '#E5E5E5',
        borderWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },
    message: {
        width: 13,
        height: 12,
    },
    border: {
        width: 1,
        height: height,
        position: 'absolute',
        left: (width * 56 / 750)/2+10,
        top: 0,
        borderRightColor: '#E5E5E5',
        borderRightWidth: StyleSheet.hairlineWidth
    }
})