//  action
import { NavigationActions } from 'react-navigation';
import constants from '../config/constants';
// 赛事类型
const toggleEventType = (item) => {
    return {
        type: constants.matchEvetType,
        filter: {matchEventType: item}
    }
}
// 玩法切换index
const changeEventTypeIndex = (index) => {
    return {
        type: constants.eventTypeIndex,
        filter: { EventTypeIndex: index }
    }
}
// 联盟筛选id
const checkAllianceId = (ids) => {
    return {
        type: constants.allianceId,
        filter: { AllianceId: ids }
    }
}
// 改变mounted状态
const changeMounted = (boolean) => {
    return {
        type: constants.isMounted,
        filter: {
            isMounted: boolean
        }
    }
}
// 赛事排序 时间、联赛
const matchSort = (status) => {
    return {
        type: constants.matchSort,
        filter: {
            orderStatus: status
        }
    }
}
// 主要盘口、所有盘口的切换
const gameIsMaster = (str) => {
    return {
        type: constants.isMaster,
        filter: {
            isMaster: str
        }
    }
}
// 是否显示隐藏赛节、赛盘
const gameIsPeriod = (str) => {
    return {
        type: constants.isPeriod,
        filter: {
            isPeriod: str
        }
    }
}
// 用户信息 更新
const updateUser = (user) => {
    return {
        type: constants.userInfo,
        filter: user
    }
}

// 返回到会员首页action
const resetCenterHome = () => {
    return  NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                    routeName: 'VirtualMain',
                })
                ]
            })
}
// 回到首页
const resetIndexHome = () => {
    return  NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                    routeName: 'Main',
                })
                ]
            })
}
// 根据传入routenames进行重置路由
const resetRoutesByNames = (routes) => {
    const newArr = [];
    routes.map((route, index) => {
        if(typeof(route) === 'object') {
            newArr.push(NavigationActions.navigate({ routeName: route.routeName, params: route.params }))
        } else {
            newArr.push(NavigationActions.navigate({ routeName: route }))
        }
    })
    return NavigationActions.reset({
        index: routes.length -1,
        actions: newArr
    })
}

// 我的注单 根据球类筛选
const screenByBallType = (ball) => {
    return {
        type: constants.ballType,
        filter: ball
    }
}
// 选中球类型
const selectedBallInfo = (info) => {
    return {
        type: constants.seletedBall,
        filter: info
    }
}
// 用户类型存储
const saveAccountType = (type) => {
    return {
        type: constants.accountType,
        filter: type
    }
}
// 我的注单保存index
const saveOrderTypeIndex = (index) => {
    return {
        type: constants.orderTypeIndex,
        filter: {
            orderTypeIndex: index
        }
    }
}
// 下注 倒计时timer
const saveBetTimer = (timer) => {
    return {
        type: constants.betTimer,
        filter: {
            betTimer: timer
        }
    }
}
// 球类刷新倒计时
const convertTimesToMd = (md) => {
    return {
        type: constants.timestampToMd,
        filter: {
            timestampMd: md
        }
    }
}
// 特殊代理
const changeAgentAction = (type) => {
    return {
        type: constants.isAgent,
        filter: {
            isAgent: type
        }
    }
}
// 我的注单是否获取到焦点
const isOrderFocus = (status) => {
    return {
        type: constants.orderFocusStatus,
        filter: {
            orderFocusStatus: status
        }
    }
}
// 我的注单时间筛选
const screenByTime = ( period ) => {
    return {
        type: constants.orderPeriod,
        filter: {
            ...period
        }
    }
}
// 保存初始化时弹窗广告的信息
const savePopupInfo = (infoArr) => {
    return {
        type: constants.popupInfo,
        filter: {
            popupInfo: infoArr
        }
    }
}

export default {
    toggleEventType,
    changeEventTypeIndex,
    checkAllianceId,
    changeMounted,
    matchSort,
    updateUser,
    resetCenterHome,
    resetIndexHome,
    screenByBallType,
    resetRoutesByNames,
    selectedBallInfo,
    saveAccountType,
    saveOrderTypeIndex,
    saveBetTimer,
    convertTimesToMd,
    changeAgentAction,
    isOrderFocus,
    gameIsMaster,
    gameIsPeriod,
    screenByTime,
    savePopupInfo
}
