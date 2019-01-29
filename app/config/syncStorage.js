// 数据缓存
import { Platform } from 'react-native';
import service from '../service';

storage.sync = {
    sportsTypes (params) {
        // 首页球类缓存
        const { resolve, reject } = params;
        service.sportsTypesService()
        .then(ret => {
            storage.save({
                key: 'sportsTypes',
                data: ret.data,
                expires: 10 * 1000
            });
            resolve && resolve(ret.data);
        })
        .catch(err => {
            reject && reject(err);
        })
    },
    evenType(params) {
        // 球类筛选， 今日赛事、早盘、 综合
        const { id, resolve, reject } = params;
        service.eventTypeService({ sportId: id })
        .then(ret => {
            storage.save({
                key: 'evenType',
                data: ret.data,
                expires: 600 * 1000
            });
            resolve && resolve(ret.data);
        })
        .catch(err => {
            reject && reject(err);
        })
    },
    playType(params) {
        // 球类玩法
        const { id, resolve, reject } = params;
        service.playTypeService({ sportId: id })
        .then(ret => {
            storage.save({
                key: 'playType',
                data: ret.data,
                expires: 24 * 3600 * 1000
            })
            resolve && resolve(ret.data);
        })
        .catch(err => {
            reject && reject(err);
        })
    },
    topUpType(params) {
        // 充值类型
        const { id, resolve, reject } = params;
        service.topUpTypeService()
        .then(ret => {
            storage.save({
                key: 'topUpType',
                data: ret.data,
                expires: 3600 * 1000
            });
            resolve && resolve(ret.data);
        })
        .catch(err => {
            reject && reject(err);
        })
    },
    siteConfig(params) {
        // 站点配置
        const { resolve, reject } = params;
        service.getSiteConfigService({ terminal: Platform.OS, siteType: 'sports' })
        .then(res => {
            storage.save({
                key: 'siteConfig',
                data: res.data,
                expires: 3600 * 1000 * 24
            });
            resolve && resolve(res.data);
        })
        .catch(err => {
            console.log('err', err);
        })
    },
    accountType(params) {
        // 账户明细类型
        const { id, resolve, reject } = params;
        service.detailTypesService()
        .then(ret => {
            storage.save({
                key: 'accountType',
                data: ret.data,
                expires: 3600 * 1000
            });
            resolve && resolve(ret.data);
        })
        .catch(err => {
            reject && reject(err);
        })
    },
    getCashType(params) {
        // 账户明细类型
        const { id, resolve, reject } = params;
        service.withdrawTypesService()
        .then(ret => {
            storage.save({
                key: 'getCashType',
                data: ret.data,
                expires: 3600 * 1000
            });
            resolve && resolve(ret.data);
        })
        .catch(err => {
            reject && reject(err);
        })
    },
}