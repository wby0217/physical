// 封装touchable   点击一定时间内不能重复点击

import React, { PureComponent } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import Immutable, {  Map, List } from 'immutable';

export default class TouchView extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            disabled: false
        }
        this.timer = null;
    }
    control = () => {
        this.timer = setTimeout(() => {
            this.setState({
                disabled: false
            })
        }, 2000)
    }
    clearTimer = () => {
        clearTimeout(this.timer);
    }
    componentWillMount() {
        clearTimeout(this.timer);
    }
    render() {
        const { children, onPress } = this.props;
        const { disabled } = this.state;
        var newProps = Map(this.props).toObject();
        delete newProps.onPress && delete newProps.children;
        return (
            <TouchableOpacity
                {...newProps}
                onPress={() => {
                    onPress();
                    this.setState({ disabled: true },() => this.control())
                }}
                disabled={disabled}
            >
                {children}
            </TouchableOpacity>
        )
    }
}