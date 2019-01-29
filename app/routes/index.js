import Tabs, { VirtualTabs, OrderTabs } from './tabs';
import Match from '../page/main/match';
import Screening from '../page/main/match/screening';  // 根据联赛名称筛选赛事
import Login from '../page/other/login'; // 登录
import Register from '../page/other/register'; // 注册
import FreePlay from '../page/other/freeplay'; // 免费试玩
import Setting from '../page/center/setting'; // 设置
import BetDetails from '../page/order/betDetails'; // 注单详情页
import ResultDetails from '../page/result/resultDetail'; // 比赛结果
import ParlayOrder from '../page/main/match/parlayOrder';// 综合过关购物车
import { Order } from '../page';
import TopUpRecord from '../page/center/topUpRecord';  // 充值记录
import AccountRecord from '../page/center/accountRecord'; // 提现记录
import GetCashRecord from '../page/center/getCashRecord'; // 提现记录
import RulesTerms from '../page/center/rulesTerms'; //规则与条款
import DetailedSetting from '../page/center/detailedSetting'; // 详细设定
import Information from '../page/center/information'; // 信息公告
import InfomationList from '../page/center/informationList'; //信息公告列表
import GamesPlayed from '../page/center/gamesPlayed'; // 玩法规则
import HelpFeedback from '../page/center/helpFeedback'; // 帮助与反馈
import Recharge from '../page/center/recharge';// 充值
import SellerList from '../page/center/recharge/seller';// 充值
import RechargeRef from '../page/center/recharge/rechargeRef';// 充值说明
import RecipientAccount from '../page/center/recharge/transferToCompany';// 公司收款账户平台
import RechargeReceiptsBill from '../page/center/recharge/transferToCompany/rechargeReceiptsBill';// 公司收款单据
import CheckRechargeInfo from '../page/center/recharge/transferToCompany/checkRechargeInfo';// 公司入款核对信息
import UpdatePwd from '../page/center/updatePassword'; // 修改密码
import ContactUs from '../page/center/contactUs'; // 在线客服
import SecurityCenter from '../page/center/securityCenter'; // 安全中心
import UpdFundPwd from '../page/center/updFundPwd'; // 修改资金密码
import AboutUs from '../page/center/aboutUs'; // 关于我们
import SettingFundPwd from '../page/center/settingFundPwd'; // 设置资金密码
import Protocals from '../page/center/protocols'; // 开户协议
import AddBankCard from '../page/center/addBankCard'; // 添加银行卡
import WithDraw from '../page/center/withDraw'; // 添加银行卡
import MyBankCard from '../page/center/myBankCard'; // 我的银行卡
import ActivityList from '../page/main/activetyList'; // 活动列表
import ActivityDetail from '../page/main/activityDetail'; // 活动详情
import LatestNotice from '../page/main/latestNotice'; // 最新公告
import FriendPay from '../page/center/recharge/friendPay'; // 好友支付
import ShowRechargeCode from '../page/center/recharge/showRechargeCode'; // 扫码支付
import RechargeResult from '../page/center/recharge/rechargeResult'; // 充值结果
import WithDrawRef from '../page/center/withDrawRef'; // 限额说明
import Splash from '../page/splash'; // 开场
import Agency from '../page/center/agency'; // 代理首页
import SchemeProtocols from '../page/center/agency/schemeOrProtocols'; // 代理方案、协议
import ReportDetails from '../page/center/agency/reportDetails'; // 详细报表
import LowerLevelCreateAccount from '../page/center/agency/lowerLevelCreateAccount'; // 下级开户
import AgencyDatepicker from '../page/center/agency/datepicker'; // 日期选择
import LowerLevelDetailList from '../page/center/agency/lowerLevelDetailList';  // 下级详细报表
import VerifyUser from '../page/other/verify'; // 用户安全验证
import ResetPwd from '../page/other/verify/resetPassword'; // 验证用户信息通过后重置信息
import WithdrawCheckList from '../page/center/withdrawCheckList'; // 稽核详情列表
import Service from '../page/center/service'; // 在线客服
import ScreenByTime from '../page/order/screenbytime'; // 我的注单 时间筛选
import SearchPage from '../page/result/searchPage'; // 搜索页面
import LetterList from '../page/center/letterList'; // 站内信列表
import Letter from '../page/center/letter';  // 站内信详情

export default {
    Main: {
        screen: Tabs
    },
    Splash: {
        screen: Splash
    },
    VirtualMain: {
        screen: VirtualTabs
    },
    OrderTabs: {
        screen: OrderTabs
    },
    Match: {
        screen: Match
    },
    Screening: {
        screen: Screening
    },
    Login: {
        screen: Login
    },
    Register: {
        screen: Register
    },
    FreePlay: {
        screen: FreePlay
    },
    Setting: {
        screen: Setting
    },
    BetDetails: {
        screen: BetDetails
    },
    ResultDetails: {
        screen: ResultDetails
    },
    ParlayOrder: {
        screen: ParlayOrder
    },
    Recharge: {
        screen: Recharge
    },
    RechargeRef: {
        screen: RechargeRef
    },
    CenterOrder: {
        screen: Order
    },
    TopUpRecord: {
        screen: TopUpRecord
    },
    AccountRecord: {
        screen: AccountRecord
    },
    GetCashRecord: {
        screen: GetCashRecord
    },
    RulesTerms: {
        screen: RulesTerms
    },
    DetailedSetting: {
        screen: DetailedSetting
    },
    Information: {
        screen: Information
    },
    InfomationList: {
        screen: InfomationList
    },
    GamesPlayed: {
        screen: GamesPlayed
    },
    HelpFeedback: {
        screen: HelpFeedback
    },
    RecipientAccount: {
        screen: RecipientAccount
	},
    RechargeReceiptsBill: {
        screen: RechargeReceiptsBill
    },
    UpdatePwd: {
        screen: UpdatePwd
    },
    ContactUs: {
        screen: ContactUs
    },
    SecurityCenter: {
        screen: SecurityCenter
    },
    UpdFundPwd: {
        screen: UpdFundPwd
    },
    AboutUs: {
        screen: AboutUs
    },
    SettingFundPwd: {
        screen: SettingFundPwd
    },
    Protocals: {
        screen: Protocals
    },
    AddBankCard: {
        screen: AddBankCard
    },
    MyBankCard: {
        screen: MyBankCard
    },
    ActivityList: {
        screen: ActivityList
    },
    ActivityDetail: {
        screen: ActivityDetail
    },
    LatestNotice: {
        screen: LatestNotice
    },
    CheckRechargeInfo: {
        screen: CheckRechargeInfo
    },
    WithDraw: {
        screen: WithDraw
    },
    FriendPay: {
        screen: FriendPay
    },
    ShowRechargeCode: {
      screen: ShowRechargeCode
    },
    RechargeResult: {
        screen: RechargeResult
    },
    WithDrawRef: {
        screen: WithDrawRef
    },
    Agency: {
        screen: Agency
    },
    SchemeProtocols: {
        screen: SchemeProtocols
    },
    ReportDetails: {
        screen: ReportDetails
    },
    LowerLevelCreateAccount: {
        screen: LowerLevelCreateAccount
    },
    AgencyDatepicker: {
        screen: AgencyDatepicker
    },
    LowerLevelDetailList: {
        screen: LowerLevelDetailList
    },
    VerifyUser: {
        screen: VerifyUser
    },
    ResetPwd: {
        screen: ResetPwd
    },
    WithdrawCheckList: {
        screen: WithdrawCheckList
    },
    OnlineService: {
        screen: Service
    },
    ScreenByTime: {
        screen: ScreenByTime
    },
    SearchPage: {
        screen: SearchPage
    },
    LetterList: {
        screen: LetterList
    },
    Letter: {
        screen: Letter
    },
    SellerList: {
        screen: SellerList
    }
}