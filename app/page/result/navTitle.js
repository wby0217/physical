// 比赛结果头部导航切换
import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import matchTypeConfig from './matchTypeConf';

export default class NavTitleForResult extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isActiveIndex: 0
        }
    }
    render() {
        const { isActiveIndex } = this.state;
        const { onTouch } = this.props;
        return (
            <View style={styles.container}>
                {matchTypeConfig.length ? matchTypeConfig.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.ballShadeBox, isActiveIndex === index ? styles.activeView : null]}
                            onPress={() => {
                                this.setState({ isActiveIndex: index });
                                onTouch && onTouch(item);
                            }}
                        >   
                            <Text style={[{ color: '#fff' }, isActiveIndex === index ? styles.activeText : null]}>{item.name}</Text>
                        </TouchableOpacity>
                    )
                }):<View/>}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5
    },
    ballShadeBox: {
        paddingHorizontal: 15,
        paddingVertical: 5
    },
    activeView: {
        backgroundColor: '#fff'
    },
    activeText: {
        color: '#17A84B'
    }
})
