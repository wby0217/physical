// 公共头部组件
import React, { PureComponent } from 'react';
import {
    NativeModules
} from 'react-native';
import HeaderEle from 'react-native-header';
import LinearGradient from 'react-native-linear-gradient';

const isIPhoneX = NativeModules.DeviceInfo.isIPhoneX_deprecated;
export default class Header extends PureComponent {
    static defaultProps = {
        backgroundColor: 'transparent'
    }
    render () {
        return (
            <LinearGradient
                start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 0.6 }}
                locations={[0, 0.5, 1.0]}
                colors={['#83D74F', '#43BB4D', '#17A84B']}>
                <HeaderEle
                    isIPhoneX={isIPhoneX}
                    {...this.props}
                />
            </LinearGradient>
        )
    }
}