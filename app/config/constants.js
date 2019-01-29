
// 常量

const MATCHEVENTTYPE = 'MATCHEVENTTYPE'; // 赛事类型  今日  早盘

const EVENTTYPEINDEX = 'EVENTTYPEINDEX'; // 玩法类型  

const ALLIANCEID = 'ALLIANCEID'; // 联盟id

const ISMOUNTED = 'ISMOUNTED'; // 是否为mounted状态

const MATCHSORT = 'MATCHSORT'; // 赛事排序

const USERINFO = 'USERINFO'; // 用户信息

const BALLTYPE = 'BALLTYPE'; // 球类  我的注单 根据球类筛选

const SELECTEDBALL = 'SELECTEDBALL'; // 选中的求类型

const SAVE_BANK_LIST = 'SAVE_BANK_LIST'; //获取银行列表

const ACCOUNT_TYPE = 'ACCOUNT_TYPE'; // 账户类型

const ORDERTYPEINDEX = 'ORDERTYPEINDEX'; // 我的注单选中下标

const BETTIMER = 'BETTIMER'; // 下注倒计时timer

const TIMESTOMD = 'TIMESTOMD'; // 球类倒计时刷新

const ISAGENT = 'ISAGENT'; // 特殊代理

const orderFocusStatus = 'ORDERFOCUS'; // 我的注单是否获取到焦点

const isMaster = 'ISMASTER'; // 主盘、所有盘口

const isPeriod = 'isperiod'; // 赛节、赛盘显示隐藏

const orderPeriod = 'ORDERPERIOD'; // 我的注单时间筛选

const popupInfo = 'POPUPINFO'; // 弹窗广告消息
// 充值记录中的 状态
const topUpStatus = {
    wait: '待处理',
    success: '已完成',
    fail: '充值失败'
}
// 玩法tab映射
const tabsMapping = {
    "football": {
        "1x2-handicap-ou-oe": "FootballSingle",
        "ft_correct_score": "FootballCorrectAll",
        "1h_correct_score": "FootballCorrectHalf",
        "ht_ft": "FootballAllorHalf",
        "total_goals": "FootballAllEntry",
        "outright": "FootballChampion"
    },
    "basketball": {
        "1x2-handicap-ou-oe": "BasketballSingle",
        "outright": "BasketballChampion"
    },
    "tennis": {
        "events": "TennisMatch",
        "correct_score": "TennisCorrect",
        "outright": "TennisChampion"
    },
    "snooker": {
        "events": "SnookerMatch",
        "correct_score": "SnookerCorrect",
        "outright": "SnookerChampion"
    }
}
// 下注页设置key 
const settingToggleMapping = {
    "football": [],
    "basketball":["隐藏赛节", "显示赛节"],
    "tennis": ["隐藏赛盘", "显示赛盘"],
    "snooker": []
}
const ballImg = {
    "football": {
        image: require('../assets/images/ball/football.png'),
        icon: require('../assets/images/icon_football.png'),
        bgColor: '#EAF4EE',
        color: '#17A84B'
    },
    "basketball": {
        image: require('../assets/images/ball/basketball.png'),
        icon: require('../assets/images/icon_basketball.png'),
        bgColor: '#F7EEE6',
        color: '#DC7315'
    },
    "tennis": {
        image: require('../assets/images/ball/tennis.png')
    }
}
export default {
    matchEvetType: MATCHEVENTTYPE,
    eventTypeIndex: EVENTTYPEINDEX,
    allianceId: ALLIANCEID,
    isMounted: ISMOUNTED,
    matchSort: MATCHSORT,
    userInfo: USERINFO,
    ballType: BALLTYPE,
    seletedBall: SELECTEDBALL,
    topUpStatus,
    saveBankList: SAVE_BANK_LIST,
    accountType: ACCOUNT_TYPE,
    orderTypeIndex: ORDERTYPEINDEX,
    betTimer: BETTIMER,
    timestampToMd: TIMESTOMD,
    isAgent: ISAGENT,
    tabsMapping,
    orderFocusStatus,
    settingToggleMapping,
    isMaster,
    isPeriod,
    orderPeriod,
    popupInfo,
    ballImg
}