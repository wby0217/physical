
// 数据url统一管理
// export const HOST = 'http://192.168.0.162';
import { NativeModules } from 'react-native';
import { AppConfigurationModule } from 'NativeModules';
import config from './index'
export const HOST = AppConfigurationModule.apiServer;
// export const HOST = 'https://api-wlxe.kosun.net';


const server_url = {
    index: { // 首页
        carousel: '/api/Home/activity', // 首页轮播图
        notice: '/api/Home/notice',   // 首页消息通知
        sportsTypes: '/api/Home/sportsType', // 首页球类型
        activityList: '/api/Home/activityList', // 活动列表
        activityInfo: '/api/Home/activityInfo', // 活动详情
        getSiteConfig: '/api/General/getSiteConfig', // 获取站点配置
        popup: '/api/Advertising/popup', // 获取弹窗消息
        inPlayNowRecommend: '/api/Events/inPlayNowRecommend', // 滚球推荐
        eventsRecommend: '/api/Events/eventsRecommend', // 赛事推荐
        winnerList: '/api/Events/winnerList', // 首页的中奖信息
    },
    footBall: { // 足球玩法接口
        matchTypes: '/api/Events/eventsType', // 足球赛事 顶部的赛事类型
        gameTypes: {
            today: '/api/EventsFootball/today',   // 今日赛事数据接口
            in_play_now: '/api/EventsFootball/inPlayNow', // 滚球数据接口
            early: '/api/EventsFootball/early', // 早盘数据接口
            parlay: '/api/EventsFootball/parlay' // 综合过关数据接口
        },
        orderBet: '/api/Order/bet',  // 下单接口
        league: '/api/Events/leagueMatches', // 联赛列表接口
        parlayOrder: '/api/Events/refreshOddsMulti', // 综合过关下单购物车刷新赔率接口
        refreshOdds: '/api/Events/refreshOdds', // 10秒钟刷新赔率
        eventType: '/api/Events/eventsType', // 赛事类型 早盘、滚球、今日、综合
    },
    ball: {
        sportsEvent: '/api/Events/index', // 获取赛事数据最新接口
    },
    betList: {
        bet: '/api/Order/mineBet', // 注单列表
        betDetails: '/api/Order/info', //注单详情
    },
    match: {
            matchResults: '/api/Results/getList',
            resultDetails: '/api/Results/getInfo',
            playType: '/api/Events/playType', // 球类列表
  	},
    center: { // 会员中心
        login: '/api/User/signIn', // 登录
        notice: '/api/Account/noticeTypes', // 公告分类
        noticeList: '/api/Account/noticeList', // 公告列表
        detailTypes: '/api/Account/detailTypes', // 账户明细类型
        detailRecords: '/api/Account/detailRecords', // 账户明细列表
        rechargeTypes: '/api/Account/rechargeTypes', // 充值记录类型
        rechargeRecords: '/api/Account/rechargeRecords', // 充值明细列表
        withdrawTypes: '/api/Account/withdrawTypes', // 提现记录类型
        withdrawRecords: '/api/Account/withdrawRecords', // 提现明细列表
        changePassword: '/api/Account/changePassword', // 修改密码
        register: '/api/User/signUp',// 注册
        repeatUserName: '/api/User/check', // 注册检测账号是否已使用
        guestSignUp: '/api/User/guestSignUp', // 注册试玩账号
        betLimitSetting: '/api/Account/betLimitSetting', // 详细设定
        editUserFundsPassword: '/api/Account/changeFundsPassword', // 修改资金密码
        getUserInfo: '/api/Account/getUserInfo', // 获取用户信息
        settingFundPwd: '/api/UserConfig/bindRealInfo', // 设置资金密码
        bindCard: '/api/UserConfig/bindCard', // 添加银行卡
        getBankCard: '/api/Bank/getBankList', // 获取银行卡列表
        getUserBanks: '/api/Account/getBanks', // 获取用户绑卡信息
        withDraw: '/api/Withdraw/applyWithdraw', //提现
        feedback: '/api/Help/feedback', // 提交反馈信息
        getHelpList: '/api/Help/getHelpList', // 获取帮助列表
        getIpWhiteList: '/api/General/getIpWhiteList', // 获取ip白名单
        getIsSpecialAgent: '/api/General/checkIpWhiteList', // 判断是不是特殊代理
        agentSignIn: '/api/User/specialAgentSignIn', // 特殊代理登录
        getAgentInfo: '/api/Agent/getAgentInfo', // 获取代理信息
        getIntro: '/api/Agent/getIntro', // 获取代理方案、代理协议
        getAgentStatistics: '/api/Agent/getAgentStatistics', // 获取代理报表
        getTeamList: '/api/Agent/getTeamList', // 获取下级代理报表
        createSubordinate: '/api/Agent/createSubordinate', // 下级注册开户
        getInvitationCodeList: '/api/Agent/getInvitationCodeList', // 获取邀请码列表
        deleteInvitationCode: '/api/Agent/deleteInvitationCode', //  删除代理二维码
        generateInvitationCode: '/api/Agent/generateInvitationCode', // 生成二维码
        verifyBank: '/api/VerifyUser/verifyBank', // 用户验证信息接口
        updPwd: '/api/VerifyUser/updatePassword', // 用户验证信息通过后重置密码
        withdrawCheckList: '/api/Withdraw/getWithdrawCheckList', // 稽核详情列表
        applyAgent: '/api/Agent/applyAgent', // 代理注册
        msgList: '/api/Message/getMessageList', // 站内信列表
        msgInfo: '/api/Message/getMessageInfo', // 站内信详情
        delMsg: '/api/Message/deleteMessageInfo', // 删除站内信
        payType:'/api/Index/getMerchantGroup', //新增充值类型接口 (new)
        getRechargeGroup: '/api/Index/getRechargeGroup', // 充值分组(2018-7-7)
        getMerchantList: '/api/Index/getMerchantList', // 充值商户列表(2018-7-7)
    },
    captchUrl: '/api/General/captcha', // 验证码接口
    reportingOnlineStatus: '/api/General/reportingOnlineStatus', // 统计在线人数
    recharge: {
        getBankList: '/api/Bank/getBankList', //获取银行列表
        getRechargeType: '/api/Recharge/getRechargeTypeList', //获取充值渠道
        onlineRecharge: '/api/Index/onlineRecharge', //在线充值new
        companyBanks: '/api/Account/getCompanyBanks', //公司入款账号
        getCompanyRechargeTypeList: '/api/Bank/getCompanyRechargeTypeList', //获取公司入款类型列表
        rechargeTransfer: '/api/Index/companyRecharge', //公司入款new
        getFriendsPayAccount: '/api/Recharge/getFriendsPayAccount', //好友支付账号
        submitFriendPay: '/api/Index/friendRecharge', //好友支付账号new
        getRechargeInfo: '/api/Recharge/getRechargeDetail', //充值订单详情
        specialAgentPay: '/api/Recharge/specialAgentPay', //特殊代理充值
        specialAgentWithdraw: '/api/Withdraw/specialAgentWithdraw', // 特殊代理提现
    }
};
export default server_url;