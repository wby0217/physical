
import { NativeModules } from 'react-native';
import { AppConfigurationModule } from 'NativeModules';
import config from './index';

const signKey = '75DCC830-6D4D2EFE-D3D98A52-3AF60F1C';
export default {
    appInfo: {
        name: '666体彩',
        description: '',
        version: '',
        copyright: ''
    },
    connect: {
        timeOut: 30000
    },
    sign: signKey,
    icon: {
        center: '#17A84B'
    },
    disableBtn: {
        bg: '#EAEAEA',
        txtColor: '#999999'
    },
    activeBtn: {
        bg: '#FFE400',
        txtColor: '#734217'
    },
    ballCountDown: {
        inPlayNow: 10 * 1000,
        other: 180 * 1000
    }
}