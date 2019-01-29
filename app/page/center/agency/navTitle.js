// 代理方案、协议 头部

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { service, ErrorHandle } from '../../mesosphere';

export default class NavTitle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeIndex: 0,
            data: []
        }
    }
    componentDidMount() {
        // 获取代理方案、代理协议数据
        service.getIntroService()
        .then(res => {
            console.log(res)
            this.setState({
                data: res.data
            });
            this.props.renderData && this.props.renderData(res.data[0]);
        })
        .catch(err => {
            ErrorHandle(err);
        })
    }
    render() {
        const { activeIndex, data } = this.state;
        return (
            <View style={styles.titleView}>
                {
                    data && data.length ? data.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    this.props.renderData && this.props.renderData(data[index]);
                                    this.setState({ activeIndex: index })
                                }}
                                style={[styles.titleCol, activeIndex === index ? styles.activeView : null]}
                                activeOpacity={0.7}
                            >
                                <Text style={[ { color: '#fff' }, activeIndex === index ? styles.activeText : null ]}>{item.title}</Text>
                            </TouchableOpacity>
                        )
                    }) : null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    titleView: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#fff',
        flexDirection: 'row',
        width: 160
    },
    titleCol: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 5
    },
    activeView: {
        backgroundColor: '#fff'
    },
    activeText: {
        color: '#17A84B'
    },
})
