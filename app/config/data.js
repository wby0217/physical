import basketballData from './rule/basketball';
import footballData from './rule/football';
import baseballData from './rule/baseball';
import volleyballData from './rule/volleyball';
import badmintonData from './rule/badminton';
import pongData from './rule/pong';
import tennisData from './rule/tennis';
import snookerData from './rule/snooker';
export default {
        "memRulesTerms": [
            {
                "title": "使用条款",
                "content": [
                    "享用本公司提供的服务是客户本人的意愿，其风险应由客户本人承担参与我们服务的同时就说明客户认同本公司所提供的服务是正常、合理、公正、公平的。",
                    "某些法律规则在贵国居住的司法管辖区, 并未明文规定在线和非在线博彩是否允许，客户有责任确保任何时候您的博彩行为在您所属地是属合法行为。"
                ]
            },
            {
                "title": "投注接受条件",
                "content": [
                    "如果阁下的投注信息正确，阁下是唯一对此投注承担责任的人。一旦本司确认您的注单，该注单不得取消，撤回或更改，并且该注单会视为您投注的有效证据。",
                    "所有在本公司客户账户交易记录显示确认信息的注单，本司都视为有效注单。每笔交易完成后，请查看您的注单记录，若有任何问题，请联系您的上线进行核查，否则表示您默认此注单有效。",
                    "如果客户有欺诈，合谋，非法或其它不当行为我们有权(唯一决定人)取消投注单或任何彩金。",
                    "我们保留权利以任何理由拒绝任何交易或注单。"
                ]
            },
            {
                "title": "免责条款",
                "content": [
                    "对于任何情况下由于卫星收讯不良或延误，网路中断，或个人使用网站服务时的失误，疏忽，或对网站内容的误解所产生的任何损失，本公司概不负责。",
                    "公司不赋予任何责任对于公司的网站，服务器或网络中断，公司的服务器丢失信息或信息遭受破坏，不法分子攻击网站，服务器或网络供应商进入网站时候由于网络供应商原因造成的网络缓慢。"
                ]
            }
        ],
        "gamesPlayed": {
            "football": footballData,
            "basketball": basketballData,
            "baseball": baseballData,
            "volleyball": volleyballData,
            "badminton": badmintonData,
            "pong": pongData,
            "tennis": tennisData,
            "snooker": snookerData,
            "others": []
        },
        "memHelpFeedback": {
            "prolemList": [
                {
                    "title": "如何注册？",
                    "content": "666体育欢迎世界各地的玩家，但是对有法规限制游"
                },
                {
                    "title": "居住地限制？",
                    "content": "666体育欢迎世界各地的玩家，但是对有法规限制游"
                },
                {
                    "title": "如何修改密码？",
                    "content": "666体育欢迎世界各地的玩家，但是对有法规限制游"
                },
                {
                    "title": "忘记密码怎么办？",
                    "content": "666体育欢迎世界各地的玩家，但是对有法规限制游"
                },
            ],
            "feedBackData": [
                {
                    "name": "feedBackMind",
                    "title": "主人，何事让您如此心烦？",
                    "placeHolder": "请简单描述情况，微臣好尽快为您分忧～",
                    "multiline": true,
                },
                {
                    "name": "feddBackContact",
                    "title": "主人，您的联系方式是？",
                    "placeHolder": "邮箱／手机号／QQ",
                    "multiline": false,
                }
            ]
        },
}