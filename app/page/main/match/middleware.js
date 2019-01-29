// 判断是否在当前玩法
/**
 * 
 * @param {*} ballInfo 球类信息
 * @param {*} eventType 赛事类型
 * @param {*} curPlayType 当前的tab玩法类型
 */
import _ from 'lodash';

export const judgeTabIndex = async (ballInfo, eventType, curPlayType ) => {
    const tabList = await storage.load({ key: 'playType', id: ballInfo.id });
    const typeEngName = eventType.typeEngName === 'in_play_now' ? "inPlayNow" : eventType.typeEngName;
    return _.findIndex(tabList[typeEngName], (obj) => obj.engName == curPlayType);
}