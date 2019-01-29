// 关于我们

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    Image
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import WebPage from '../../component/webPage';
import { Icons, service, ErrorHandle, Action, constants, Header, UPDATELOG } from '../mesosphere';

export default class AboutUs extends Component {
    static navigationOptions = ({ navigation }) => {
        return ({
            header: null,
        })
    }
    constructor(props) {
        super(props)
        this.state = {
            source: require('../../assets/images/ic_launcher.png'),
            aboutUs: {}
        }
    }
    async componentDidMount() {
        const data = await storage.load({ key: 'siteConfig' });
        this.setState({ aboutUs: data });
    }
    render() {
        const { source, aboutUs } = this.state;
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <LinearGradient
                        startPoint={{ x: 0, y: 1.0 }} endPint={{ x: 1.0, y: 0 }}
                        locations={[0, 0.5, 1.0]}
                        colors={['#83D74F', '#43BB4D', '#17A84B']}
                    >
                        <View style={{ height:180, justifyContent:'flex-end', alignItems: 'center', paddingBottom: 15 }}>
                            <Image source={{uri: aboutUs.logo}} style={{ width: 60, height:60, marginBottom: 10 }} resizeMode="contain" />
                            <Text style={{ backgroundColor: 'transparent', color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{aboutUs.appName}</Text>
                            <TouchableOpacity style={{ backgroundColor: 'transparent', position: 'absolute', left: 5, top: 30, padding: 5 }}
                                onPress={() => navigation.goBack()}
                            >
                                <Icons name="icon-back-normal" size={22} color="#fff"/>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                    <View style={{ alignItems: 'center', height: 40, justifyContent: 'center' }}>
                        <Text style={{ color: '#999999' }}>{ UPDATELOG[UPDATELOG.length -1].version }更新时间{ UPDATELOG[0].updateTime }</Text>
                    </View>
                    <View style={{ paddingHorizontal: 10 }}>
                        <Text style={{ color: '#333', letterSpacing: 1.2 }}>
                            <Text style={{ fontWeight: 'bold' }}>{aboutUs.appName}</Text>
                            <Text>提供给您丰富的体育赛事，实时的最新赛果和精彩的体育资讯。众多体育项目有足球五大联赛、世界杯、欧洲冠军杯、NBA、WNBA、NFL、MLB、NCAA以及四大网球公开赛、排球等。来自世界各地的顾客可以进入我们的网站投注各种赛事，并通过我们的优惠活动赢取更多收益！</Text>
                        </Text>
                        <Text style={{ color: '#333', marginTop: 10, letterSpacing: 1.2 }}>
                            如果您有任何关于体育的疑问，可通过在线客服、QQ与我们取得联系。{aboutUs.appName}以服务会员不打烊的精神，24小时全天候提供咨询服务。
                        </Text>
                    </View>
                    <View style={{ paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', marginTop: 15, marginLeft: 10 }}>
                        <Image source={require('../../assets/images/icon_customer.png')} style={{ width: 25, height:25 }} resizeMode="contain" />
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ContactUs')}
                        >
                            <Text style={{ color: '#17A84B', textDecorationLine: 'underline' }}> 打开在线客服</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}