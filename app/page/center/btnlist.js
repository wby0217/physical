import uuid from 'uuid';

export default [
    {
        title: "我的订单",
        list: [
            {
                id: uuid.v4(),
                title: '注单记录',
                iconName: 'icon-chip',
                routeName: 'CenterOrder',
                size: 16,
                token: true
            },
            {
                id: uuid.v4(),
                title: '账户明细',
                iconName: 'icon-account-details',
                routeName: 'AccountRecord',
                size: 16,
                token: true
            },
            {
                id: uuid.v4(),
                title: '充值记录',
                iconName: 'icon-topup',
                routeName: 'TopUpRecord',
                size: 16,
                token: true
            },
            {
                id: uuid.v4(),
                title: '提现记录',
                iconName: 'icon-withdraw',
                routeName: 'GetCashRecord',
                size: 18,
                token: true
            },
        ]
    },
    {
        title: "帮助中心",
        list: [
            {
                id: uuid.v4(),
                title: '玩法规则',
                iconName: 'icon-rule-record',
                routeName: 'GamesPlayed',
                size: 16,
                token: false
            },
            {
                id: uuid.v4(),
                title: '详细设定',
                iconName: 'icon-doc-search',
                routeName: 'DetailedSetting',
                size: 16,
                token: true
            },
            {
                id: uuid.v4(),
                title: '规则与条款',
                iconName: 'icon-records',
                routeName: 'RulesTerms',
                size: 16,
                token: false
            },
            {
                id: uuid.v4(),
                title: '在线客服',
                iconName: 'icon-chat',
                routeName: 'ContactUs',
                size: 16,
                token: false
            },
        ]
    },
    {
        title: "必备工具",
        list: [
            {
                id: uuid.v4(),
                title: '代理中心',
                iconName: 'icon-agent',
                routeName: 'Agency',
                size: 13,
                token: true
            },
            {
                id: uuid.v4(),
                title: '加入代理',
                iconName: 'icon-agent',
                routeName: 'Register',
                size: 13,
                token: false
            },
            {
                id: uuid.v4(),
                title: '站内信',
                iconName: 'img',
                routeName: 'LetterList',
                size: 16,
                token: true,
                sourceUri: require('../../assets/images/msg_icon.png')
            },
            {
                id: uuid.v4(),
                title: '安全中心',
                iconName: 'icon-security',
                routeName: 'SecurityCenter',
                size: 13,
                token: true
            },
            {
                id: uuid.v4(),
                title: '信息公告',
                iconName: 'icon-notice',
                routeName: 'Information',
                size: 16,
                token: false
            },
            {
                id: uuid.v4(),
                title: '优惠活动',
                iconName: 'icon-present',
                routeName: 'ActivityList',
                size: 16,
                token: false
            }
        ]
    }
]