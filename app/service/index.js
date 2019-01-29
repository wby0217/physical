import { getJson, postJson } from '../utils/fetch';
import Api from '../config/api';
import ErrorHandle from './errorHandle';

const home = Api.index;
const footBall = Api.footBall;
const betList = Api.betList;
const matchResult = Api.match;
const center = Api.center;
const recharge = Api.recharge;

// 首页轮播图接口
const carouselService = (params) => commonFetch(home.carousel, params, 'POST');

// 首页通知消息接口
const noticeService = (params) => commonFetch(home.notice, params, 'POST');

// 首页球类数据接口
const sportsTypesService = (params) => commonFetch(home.sportsTypes, params, 'POST');

// 赛事类型筛选  今日、早盘、综合...
const eventTypeService = (params) => commonFetch(footBall.eventType, params, 'POST');

// 今日赛事、滚球、早盘、综合过关
const matchOddsService = (params) => commonFetch(Api.ball.sportsEvent, params, 'POST');

// 获取最新赔率
const refreshOddsService = (params) => commonFetch(footBall.refreshOdds, params, 'POST');

// 筛选联盟 获取联盟数据
const getAllianceService = (params) => commonFetch(footBall.league, params, 'POST');

// 我的注单
const getBetListService = (params) => commonFetch(betList.bet, params, 'POST');

// 注单详情
const getBetDetailsService = (params) => commonFetch(betList.betDetails, params, 'POST');

// 注册时检测账号是否被使用
const checkRepeatUserNameService = (params) => commonFetch(center.repeatUserName, params, 'POST');

// 下注接口
const genOrderBetService = (params) => commonFetch(footBall.orderBet, params, 'POST');

// 比赛结果
const getMatchResultService = (params) => commonFetch(Api.match.matchResults, params, 'POST');

// 综合过关购物车根据选中赔率Id获取相关信息
const getParlayInfoByActiveIdService = (params) => commonFetch(footBall.parlayOrder, params, 'POST');

// 充值记录
const getTopUpRecordService = (params) => commonFetch(center.rechargeRecords, params, 'POST' );

// 充值类型
const topUpTypeService = (params) => commonFetch(center.rechargeTypes, params, 'POST' );

// 账户明细
const detailRecordsService = (params) => commonFetch(center.detailRecords, params, 'POST');

// 账户明细类型
const detailTypesService = (params) => commonFetch(center.detailTypes, params, 'POST');

// 提现记录
const withdrawRecordsService = (params) => commonFetch(center.withdrawRecords, params, 'POST');

// 提现类型
const withdrawTypesService = (params) => commonFetch(center.withdrawTypes, params, 'POST');

// 公告消息类型
const infoTypesService = (params) => commonFetch(center.notice, params, 'POST');

// 公告消息列表
const infoListService = (params) => commonFetch(center.noticeList, params, 'POST');

// 详细设定
const betLimitSettingService = (params) => commonFetch(center.betLimitSetting, params, 'POST');

//获取充值渠道
const getRechargeType = (params) => commonFetch(recharge.getRechargeType, params, 'POST');

// 获取银行列表
const getBankList = (params) => commonFetch(recharge.getBankList, params, 'POST');

//在线充值
const onlineRecharge = (params) => commonFetch(recharge.onlineRecharge, params, 'POST');

//公司转账入款
const rechargeTransfer = (params) => commonFetch(recharge.rechargeTransfer, params, 'POST');

//获取公司收款账户
const getRecipientAccountList = (params) => commonFetch(recharge.companyBanks, params, 'POST');

// 修改密码
const updatePwdService = (params) => commonFetch(center.changePassword, params, 'POST');

// 修改资金密码
const updateFundPwdService = (params) => commonFetch(center.editUserFundsPassword, params, 'POST');

// 获取用户信息
const getUserInfoService = (params) => commonFetch(center.getUserInfo, params, 'POST');

// 设置资金密码
const settingFundPwdService = (params) => commonFetch(center.settingFundPwd, params, 'POST');

// 添加银行卡
const addCardService = (params) => commonFetch(center.bindCard, params, 'POST');

// 获取银行卡列表 
const getBankListService = (params) => commonFetch(center.getBankCard, params, 'POST');

// 获取用户绑卡信息
const getUserBanksService = (params) => commonFetch(center.getUserBanks, params, 'POST');

//获取公司入款类型列表
const getCompanyRechargeTypeList = (params) => commonFetch(recharge.getCompanyRechargeTypeList, params, 'POST');

// 活动列表接口
const getActivityList = (params) => commonFetch(home.activityList, params, 'POST');

// 活动详情
const getActivityInfo = (params) => commonFetch(home.activityInfo, params, 'POST');

//提现说明
const withDraw = (params) => commonFetch(center.withDraw, params, 'POST');

//获取好友支付账号
const getFriendsPayAccount = (params) => commonFetch(recharge.getFriendsPayAccount, params, 'POST');

//好友支付填单
const submitFriendPay = (params) => commonFetch(recharge.submitFriendPay, params, 'POST');

//获取充值详情
const getRechargeInfo = (params) => commonFetch(recharge.getRechargeInfo, params, 'POST');

// 获取帮助列表
const getHelpListService = (params) => commonFetch(center.getHelpList, params, 'POST');

// 提交反馈信息
const feedbackService = (params) => commonFetch(center.feedback, params, 'POST');

// 赛果详情接口
const matchResultDetailsService = ( params ) => commonFetch(Api.match.resultDetails, params, 'POST');

// 获取ip白名单
const getIpWhiteListService = ( params ) => commonFetch(center.getIsSpecialAgent, params, 'POST');

// 特殊代理登录
const agentSignInService = ( params ) => commonFetch(center.agentSignIn, params, 'POST');

// 特殊代理充值
const specialAgentPayService = ( params ) => commonFetch(recharge.specialAgentPay, params, 'POST');

// 代理中心
const getAgentInfoService = ( params ) => commonFetch(center.getAgentInfo, params, 'POST');

// 代理方案。代理协议
const getIntroService = ( params ) => commonFetch(center.getIntro, params, 'POST');

// 代理报表
const getAgentStatisticsService = ( params ) => commonFetch(center.getAgentStatistics, params, 'POST');

// 获取下级代理报表
const getTeamListService = ( params ) => commonFetch(center.getTeamList, params, 'POST');

// 下级注册接口
const createSubordinateService = ( params ) => commonFetch(center.createSubordinate, params, 'POST');

// 代理获取邀请码列表
const getInvitationCodeListService = ( params ) => commonFetch(center.getInvitationCodeList, params, 'POST');

// 删除代理列表中的二维码
const deleteInvitationCodeService = ( params ) => commonFetch(center.deleteInvitationCode, params, 'POST');

// 代理中心生成二维码
const generateInvitationCodeService = ( params ) => commonFetch(center.generateInvitationCode, params, 'POST');

// 获取球类列表
const playTypeService = (params) => commonFetch(matchResult.playType, params, 'POST');

// 获取站点配置
const getSiteConfigService = (params) => commonFetch(home.getSiteConfig, params, 'POST');

// 用户信息验证
const verifyBankService = (params) => commonFetch(center.verifyBank, params, 'POST');

// 用户信息验证通过后修改密码接口
const updPwdServie = (params) => commonFetch(center.updPwd, params, 'POST');

// 验证码接口
const captchUrlService = (params) => commonFetch(Api.captchUrl, params, 'POST');

// 稽核详情列表
const withdrawCheckListService = (params) => commonFetch(center.withdrawCheckList, params, 'POST');

// 代理注册
const applyAgentService = (params) => commonFetch(center.applyAgent, params, 'POST');

// 站内信列表
const getMsgListService = (params) => commonFetch(center.msgList, params, 'POST');

// 站内信详情
const getMsgInfoService = (params) => commonFetch(center.msgInfo, params, 'POST');

// 删除站内信
const delMsgService = (params) => commonFetch(center.delMsg, params, 'POST');

// 获取广告消息
const popupService = (params) => commonFetch(home.popup, params, 'POST');

// 新增支付类型接口
const payTypeService = (params) => commonFetch(center.payType, params, 'POST');

// 统计在线人数
const reportingOnlineStatusService = (params) => commonFetch(Api.reportingOnlineStatus, params, 'POST');

// 首页滚球推荐
const hotBallService = (params) => commonFetch(home.inPlayNowRecommend, params, 'POST');

// 赛事推荐
const eventsRecommendService = (params) => commonFetch(home.eventsRecommend, params, 'POST');

// 首页推荐热门
const winnerListService = (params) => commonFetch(home.winnerList, params, 'POST');

// 充值分组
const getRechargeGroupService = (params) => commonFetch(center.getRechargeGroup, params, 'POST');

// 充值商户列表
const getMerchantListService = (params) => commonFetch(center.getMerchantList, params, 'POST');

export const commonFetch = (url, params, type='GET') => {
    let fetchResult = null;
    return new Promise((resolve, reject) => {
        if (type === 'GET') {
            fetchResult = getJson(url, params);
        } else if(type === 'POST') {
            fetchResult = postJson(url, params);
        }
        fetchResult.then(ret => {
            resolve && resolve(ret)
        })
        .catch(err => {
            reject && reject(err)
        })
    })
}
export default {
    carouselService,
    noticeService,
    sportsTypesService,
    eventTypeService,
    matchOddsService,
    refreshOddsService,
    getAllianceService,
    getBetListService,
    getBetDetailsService,
    checkRepeatUserNameService,
    genOrderBetService,
    ErrorHandle,
    getMatchResultService,
    getParlayInfoByActiveIdService,
    getTopUpRecordService,
    topUpTypeService,
    detailRecordsService,
    detailTypesService,
    withdrawRecordsService,
    withdrawTypesService,
    infoTypesService,
    infoListService,
    betLimitSettingService,
    getRechargeType,
    getBankList,
    onlineRecharge,
    getRecipientAccountList,
    updatePwdService,
    updateFundPwdService,
    getUserInfoService,
    settingFundPwdService,
    addCardService,
    getBankListService,
    getCompanyRechargeTypeList,
    rechargeTransfer,
    getUserBanksService,
    getActivityList,
    getActivityInfo,
    withDraw,
    getFriendsPayAccount,
    submitFriendPay,
    getRechargeInfo,
    getHelpListService,
    feedbackService,
    matchResultDetailsService,
    getIpWhiteListService,
    agentSignInService,
    specialAgentPayService,
    getAgentInfoService,
    getIntroService,
    getAgentStatisticsService,
    getTeamListService,
    createSubordinateService,
    getInvitationCodeListService,
    deleteInvitationCodeService,
    generateInvitationCodeService,
    playTypeService,
    getSiteConfigService,
    verifyBankService,
    updPwdServie,
    captchUrlService,
    withdrawCheckListService,
    applyAgentService,
    getMsgListService,
    getMsgInfoService,
    delMsgService,
    popupService,
    payTypeService,
    reportingOnlineStatusService,
    hotBallService,
    eventsRecommendService,
    winnerListService,
    getRechargeGroupService,
    getMerchantListService,
}