// 我的注单头部组件

import React, { PureComponent } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { Icons } from '../mesosphere';

export default class NavTitle extends PureComponent {
    constructor(props) {
        super(props)
    }
    render() {
        const { onTouch, name } = this.props;
        return (
            <TouchableOpacity
                style={{ alignSelf: 'center', flexDirection: 'row', borderWidth: 1, borderColor: '#fff', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }}
                activeOpacity={0.8}
                onPress= {onTouch}
            >
                <Text style={{ color: '#fff' }}>{ name }</Text>
                <Icons name="icon-triangle-bottom" color="#fff" size={14} />
            </TouchableOpacity>
        )
    }
}