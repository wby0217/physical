// 中转站
import { Platform } from 'react-native';
import ErrorHandle, { noOpenHandler } from '../service/errorHandle';
import service from '../service';
import { Icons } from '../component/customIcons';
import Action from '../action';
import constants from '../config/constants';
import Config from '../config';
import { showToast, cleanCache, logoutHandler } from '../utils';
import LoadMoreFooter from '../component/loadMoreFooter';
import Header from '../component/header';
import stylesGlobal from '../assets/styles';
import Verify from '../config/verify';
import * as middwareHandler from './main/match/middleware';
import IndexPopup from '../component/indexPopup';

const versionLog = {
    ios: require('../../updateLog/log.ios.json'),
    android: require('../../updateLog/log.android.json')
}
const UPDATELOG = versionLog[Platform.OS];


export {
    ErrorHandle,
    service,
    Action,
    constants,
    Config,
    showToast,
    cleanCache,
    LoadMoreFooter,
    Header,
    stylesGlobal,
    Verify,
    Icons,
    UPDATELOG,
    logoutHandler,
    middwareHandler,
    noOpenHandler,
    IndexPopup
}
