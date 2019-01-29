// 足彩玩法 reducer
import { combineReducers } from 'redux';
import constants from '../config/constants';

// 切换玩法
function eventTypeIndexReducer (state = {  EventTypeIndex: 0  }, action) {
    let nextState;
    switch (action.type) {
        case constants.eventTypeIndex:
            nextState = Object.assign({}, state, action.filter);
            break;
        default:
            nextState = state;
    }
    return nextState || state;
}

// 赛事类型
function matchReducer (state = { matchEventType: {typeEngName: 'today', typeName: '今日赛事' }}, action) {
    let nextState;
    switch (action.type) {
        case constants.matchEvetType:
            nextState = Object.assign({}, state, action.filter);
            break;
        default:
            nextState = state;
    }
    return nextState || state;
}

// 无需默认值的 reducer
function sportReducer (state = {}, action) {
    let nextState;
    switch (action.type) {
        case constants.allianceId:
            nextState = Object.assign({}, state, action.filter);
            break;
        case constants.isMounted:
            nextState = Object.assign({}, { isMounted: true }, action.filter);
            break;
        case constants.timestampToMd: // 球类刷新倒计时
            nextState = Object.assign({}, state, action.filter);
            break;
        default:
            nextState = state;
    }
    return nextState || state;
}
// isMounted 状态
function isMounted (state = { isMounted: true }, action) {
    let nextState;
    switch (action.type) {
        case constants.isMounted:
            nextState = Object.assign({}, state, action.filter);
            break;
        default:
            nextState = state;
    }
    return nextState || state;
}
// 赛事排序
function matchSort (state = { orderStatus: 'time_asc' }, action) {
    let nextState;
    switch (action.type) {
        case constants.matchSort:
            nextState = Object.assign({}, state, action.filter);
            break;
        default:
            nextState = state;
    }
    return nextState || state;
}

// 主要盘口、所有盘口
function isMasterSort (state = { isMaster: 'no' }, action) {
    let nextState;
    switch (action.type) {
        case constants.isMaster:
            nextState = Object.assign({}, state, action.filter);
            break;
        default:
            nextState = state;
    }
    return nextState || state;
}

// 赛节、赛盘切换
function isPeriodSort (state = { isPeriod: 'yes' }, action) {
    let nextState;
    switch (action.type) {
        case constants.isPeriod:
            nextState = Object.assign({}, state, action.filter);
            break;
        default:
            nextState = state;
    }
    return nextState || state;
}

// 用户信息
function saveUpdateUser (state = { isLogin: false }, action) {
    let nextState;
    switch (action.type) {
        case constants.userInfo:
            nextState = Object.assign({}, state, action.filter);
            break;
        default:
            nextState = state;
    }
    return nextState || state;
}
// 我的注单 根据球类 筛选
function screenByBallType (state = {}, action) {
    let nextState;
    switch (action.type) {
        case constants.ballType:
            nextState = Object.assign({}, state, action.filter);
            break;
        default:
            nextState = state;
    }
    return nextState || state;
}

// 选中的球类信息
function selectedBallInfo (state = {}, action) {
    let nextState;
    switch(action.type) {
        case constants.seletedBall:
            nextState = Object.assign({},  state, action.filter);
            break;
        default:
            nextState = state;
    }
    return nextState || state;
}

// 登录后存储是否是试玩账号
function saveAcountType ( state = { type: 'normal' }, action ) {
    let nextState;
    switch(action.type) {
        case constants.accountType:
            nextState = Object.assign({}, state, action.filter);
            break;
        default:
            nextState = state;
    }
    return nextState || state;
}
// 我的注单选中类型索引
function saveOrderTypeIndex ( state = { orderTypeIndex: 0 } , action ) {
    let nextState;
    switch(action.type) {
        case constants.orderTypeIndex:
            nextState = Object.assign({}, state, action.filter);
            break;
        default:
            nextState = state;
    }
    return nextState || state;
}
// 下注倒计时timer
function saveBetTimer ( state = { betTimer: undefined }, action ) {
    let nextState;
    switch(action.type) {
        case constants.betTimer:
            nextState = Object.assign({}, state, action.filter);
            break;
        default:
            nextState = state;
    }
    return nextState || state;
}
// 判断是否是代理reducer
function changeUserStatus ( state = { isAgent: false }, action ) {
    switch(action.type) {
        case constants.isAgent:
            nextState = Object.assign({}, state, action.filter)
            break;
        default:
            nextState = state;
    }
    return nextState || state;
}
// 我的注单是否获取到焦点
function judgeIsOrderFocus ( state = { orderFocusStatus: false }, action ) {
    switch(action.type) {
        case constants.orderFocusStatus:
            nextState = Object.assign({}, state, action.filter)
            break;
        default:
            nextState = state;
    }
    return nextState || state;
}
// 我的注单时间段筛选
function orderScreenByPeriod ( state = { startTime: '', endTime: '' }, action ) {
    switch(action.type) {
        case constants.orderPeriod:
            nextState = Object.assign({}, state, action.filter)
            break;
        default:
            nextState = state;
    }
    return nextState || state;
}
// 弹出广告信息存储
function savePopupInfo ( state = {}, action ) {
    switch(action.type) {
         case constants.popupInfo:
            nextState = Object.assign({}, state, action.filter);
            break;
        default:
            nextState = state;
    }
    return nextState || state;
}

export default combineReducers({
    eventTypeIndexReducer,
    matchReducer,
    sportReducer,
    isMounted,
    matchSort,
    saveUpdateUser,
    screenByBallType,
    selectedBallInfo,
    saveAcountType,
    saveOrderTypeIndex,
    saveBetTimer,
    changeUserStatus,
    judgeIsOrderFocus,
    isMasterSort,
    isPeriodSort,
    orderScreenByPeriod,
    savePopupInfo
})