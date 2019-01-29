// 倒计时组件

import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Animated,
    Easing
} from 'react-native';
import { connect } from 'react-redux';
import { service, ErrorHandle, Action, Header, Icons, constants, showToast } from '../../mesosphere';


export default class CountDown extends Component {
    static defaultProps = {
        times: 10,
        countOverHandler: () => {},
        startRefresh: () => {},
        pauseRefresh: () => {}
    }
    constructor(props) {
        super(props)
        this.state = {
            times: props.times,
            refreshing: false
        }
        this.spinValue = new Animated.Value(0);
        this.pinValue = this.spinValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['360deg', '0deg']
                        });
    }
    componentDidMount() {
        const { times } = this.state;
        this.countDown();
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.times !== this.props.times) {
            this.setState({ times: nextProps.times });
        }
      }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    countDown = () => {
        const { times } = this.state;
        if(times < 1) {
            clearTimeout(this.timer);
            this.setState({ times: this.props.times })
            return this.manualRefresh();
        } else {
            this.setState({
                times: this.state.times -1
            })
        }
        this.timer = setTimeout(() => {
            this.countDown();
        }, 1000);
    }
    manualRefresh = async () => {
        const { countOverHandler } = this.props;
        await this.setState({ refreshing: true });
        this.spinValue.setValue(0);
        Animated.timing(this.spinValue,{
            toValue: 1.5,
            duration: 1000,
            easing: Easing.linear
        }).start(async () => {
            await this.setState({ refreshing: false });
            countOverHandler();
            this.startRefresh();
        });
    }
    pauseRefresh = () => {
        this.timer && clearTimeout(this.timer);
    }
    startRefresh = () => {
        clearTimeout(this.timer);
        this.setState({ times: this.props.times }, () => { this.countDown() });
    }
    render() {
        const { refreshing } = this.state;
        return (
            <TouchableOpacity
                style={[{ justifyContent: 'center', width: 30, height: 30, alignItems: 'center' }]}
                onPress={this.manualRefresh}
            >
                {
                    refreshing ?
                    <Animated.View style={[{ transform: [{rotate: this.pinValue }] }, { position: 'absolute' } ]}>
                         <Icons name="icon-simple-refresh" color="#fff" size={26} />
                    </Animated.View> :
                    <Text style={{ color: '#fff' }}>{this.state.times}</Text>
                }
            </TouchableOpacity>
        )
    }
}