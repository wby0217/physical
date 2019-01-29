// 用户登录 、注册 等接口
import Api from '../config/api';
import ErrorHandle from './errorHandle';
import { commonFetch } from './index';

const center = Api.center;

// 登录
export const signIn = (params, status) => {
    return new Promise((resolve, reject) => {
        commonFetch(status ? center.agentSignIn : center.login, params, 'POST')
        .then(res => {
            saveUserInfo(res);
            resolve(res);
        })
        .catch((err) => {
            reject(err)
        })
    });
}
// 注册
export const register = (params) => {
    return new Promise((resolve, reject) => {
        commonFetch(center.register,params, 'POST')
        .then(res => {
            saveUserInfo(res);
            resolve(res);
        })
        .catch((err) => {
            reject(err)
        })
    });
}
// 试玩账号注册
export const guestSignUp = (params) => {
    return new Promise((resolve, reject) => {
        commonFetch(center.guestSignUp,params, 'POST')
        .then(res => {
            saveUserInfo(res);
            resolve(res);
        })
        .catch((err) => {
            reject(err)
        })
    });
}
export const logout = () => {
    cleanUserInfo();
    return new Promise((resolve, reject) => {
        resolve()
    })
}
export const cleanUserInfo = () => {
    storage.remove({key: 'userInfo'});
    storage.remove({key: 'authToken'});
}
export const saveUserInfo = (res) => {
    storage.save({
        key: 'userInfo',  // 注意:请不要在key中使用_下划线符号!
        data: {
            ...res.data
        },
        expires: null
    })
}