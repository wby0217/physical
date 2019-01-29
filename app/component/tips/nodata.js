// 无数据页面展示

import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    ScrollView,
    RefreshControl
} from 'react-native';

const {width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
export default class NoData extends Component {
    static defaultProps = {
        onRefresh: () => {},
        refreshing: false
    }
    render() {
        const { onRefresh, refreshing, type, children, period } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', width: deviceWidth, height: deviceHeight }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing= {refreshing}
                            titleColor="#333" tintColor="#666"
                            colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    {
                        (() => {
                            switch (type) {
                                    case 'noLogin':
                                        return (
                                            <View style={styles.container}>
                                                    <Image source={require('../../assets/images/icon_nologin.webp')}
                                                    style={{ height: 200, resizeMode: 'contain' }}
                                                    />
                                                    <Text style={styles.reloadBtn}>{this.props.noDataText || '登陆后才能看到注单哟'}</Text>
                                            </View>)
                                    case 'maintain':
                                        return (
                                            <View style={styles.container}>
                                                <Image source={require('../../assets/images/icon_service.png')}
                                                style={{ width: deviceWidth/2, resizeMode: 'contain' }}
                                                />
                                                <Text style={[ styles.reloadBtn ]}>{this.props.noDataText || '正在维护'}</Text>
                                                { !!period ?
                                                    <View>
                                                        <Text style={{ marginTop: 10, color: '#333', }}>服务预计中断时间:</Text>
                                                        <Text style={{ color: '#666', lineHeight: 30 }}>{period}</Text>
                                                    </View>
                                                    :null
                                                }
                                            </View>)
                                    default:
                                    return (
                                        <View style={styles.container}>
                                            <Image source={require('../../assets/images/icon_nodata.webp')}
                                            style={{ height: 180, resizeMode: 'contain' }}
                                            />
                                            <Text style={styles.reloadBtn}>{this.props.noDataText || '暂无数据'}</Text>
                                        </View>)
                                }
                        })()
                    }
                    { children }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 30,
    },
    reloadBtn: {
        color: '#666',
        marginTop: 30,
        fontSize: 14
    }
});
