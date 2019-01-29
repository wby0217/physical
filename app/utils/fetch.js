// 请求fetch封装
import api, { HOST } from '../config/api';
import config from '../config';
import _ from 'lodash';
import uuid from 'uuid';
const md5 = require('md5');
const timeout = config.connect.timeOut;
let timer = null;
// get请求 返回json
export const getJson = (uri, data = {}, headers = {}) => {
    const nonce = uuid.v4();
    const params = Object.assign({nonce}, data);
    headers['Sign'] = generateSignString(params);
    if(!_.isEmpty(params)) {
       uri = toNewUrl(uri, params);
    }
    return request(uri, 'GET', headers);
}
// post请求 返回json
export const postJson = (uri, data = {}, headers = {}) => {
    const nonce = uuid.v4();
    const params = Object.assign({nonce}, data);
    headers['Sign'] = generateSignString(params);
    return request(uri, 'POST', headers, params);
}
async function request (uri, type='POST', headers = {}, data = {}) {
    uri = HOST + uri;
    let options = {
        method: type,
        headers,
        credentials: 'include',
        mode: 'cors',
        cache: 'headers'
    }
    if(type === 'POST') {
        options.body = JSON.stringify(data)
    }
    if( !headers['Content-type'] ) {
        headers['Content-type'] = 'application/json; charset=utf-8';
    }
    if (!headers['Accept']) {
        headers['Accept'] = 'application/json';
    }
    try {
        const value = await storage.load({key: 'authToken'});
        if ( value !== null) {
            headers['Auth-Token'] = value.token;
            headers['Auth-Identity'] = value.identity;
        }
    } catch (err) {
        console.log(err);
    }
    console.log(uri);
    return _fetchAbort(fetch(uri,options), timeout)
           .then(filterStatus)
           .then(saveToken)
           .then(filterJSON)
           .then(filterCode)
}
const filterJSON = (res) => {
    try{
        return res.json()
    }catch (e){
        return Promise.reject(e);
    }
};
const toNewUrl = (url, body) => {
    const arr = [];
    _.isObject(body) && _.forEach(body, (n, k) => {
        arr.push(k.concat('=', n));
    });
    const str = arr.join('&');
    return (url.indexOf('?') > 0) ? url.concat('&', str) : url.concat('?', str);
};
const filterCode = (res) => {
    return res.errorcode === 200 ? Promise.resolve(res) : Promise.reject(res);
}
const filterStatus = (res) => {
    timer && clearTimeout(timer);
    if (res.ok) {
        return res;
    } else {
        return Promise.reject(res);
    }
}
const saveToken = (res) => {
    const token = res.headers.get('Auth-Token');
    const identity = res.headers.get('Auth-Identity');
    if(token) {
        storage.save({
            key: 'authToken',
            data: {
                token: token,
                identity: identity
            }
        });
    }
    return res;
}
// timeout fetch
const _fetchAbort = (fetchPromise, timeout = 30000) => {
    let abortFn = null;
      // 这是一个可以被reject的promise
    const abortPromise = new Promise((resolve, reject) => {
        abortFn = () => reject(new Error("请求超时"));
    });
      // 这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
    const abortablePromise = Promise.race([
        fetchPromise,
        abortPromise
    ]);
    timer = setTimeout(() => {
        abortFn();
    }, timeout);
    return abortablePromise;
};
// 根据参数生成签名
const generateSignString = (data) => {
    let content = sortObj(Object.assign({}, data));
    let keys = Object.keys(content).sort()
    let newArr = []
    for (let key of keys) {
        let val = content[key]
        if(val !== undefined && val !== null && val !== ''){
            if (typeof val === 'object') {
                val = JSON.stringify(val)
            }
            newArr.push(`${key}=${val}`)
        }
    }
    let contentStr = newArr.join('&');
    contentStr += config.sign;
    const md = md5(contentStr);
    return md;
};
const sortObj = (obj) => {
    let sortKeys = Object.keys(obj).sort();
    let newObj = {};
    for (let key of sortKeys) {
        let val = obj[key]
        if (typeof val === 'object') {
            if (Array.isArray(val)) {
                newObj[key] = sortArray(val)
            } else if (!Array.isArray(val) && Object.keys(val).length > 0) {
                newObj[key] = sortObj(val)
            } else {
                newObj[key] = val
            }
        } else {
            newObj[key] = val
        }
    }
    return newObj
}
const sortArray = (arr) => {
    let newArr = []
    for (let i = 0; i < arr.length; i++) {
        let val = arr[i]
        if (typeof val === 'object') {
            if (Array.isArray(val)) {
                newArr[i] =  sortArray(val)
            } else if (Object.keys(val).length > 0) {
                newArr[i] = sortObj(val)
            } else {
                newArr[i] = val
            }
        } else {
            newArr[i] = val
        }
    }

    return newArr
}