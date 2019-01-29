// error事件集中处理
import { showToast, logoutHandler } from '../utils';
export default function errorHandle (err) {
    console.log(err);
    return new Promise(resolve => {
        if(!err.errorcode) {
            if (err.status === 500 || (err.message && err.message === 'Network request failed')){
                showToast('网络不给力,请检查网络!')
                return resolve(err);
            } else if( [ 403, 404].includes(err.status) ) {
                showToast('网络接口出现异常!')
                return resolve(err);
            }
            if (err.name && err.name === 'NotFoundError') {
                return resolve(err);
            } else if (err.name && err.name === 'SyntaxError') {
               return showToast('服务端异常，请稍后再试！');
            }
            showToast(err.message);
            return resolve(err);
        }else if(err.errorcode === 101021) {
            // 没有登录
            if(err.navigation) {
               logoutHandler(err.navigation)
               return  err.navigation.navigate('Login', { routeNames: err.routeNames })
            }
        } else if( [10010, 10011, 101028, 101004, 101005, 101006, 101007, 101008, 101009, 101010, 101011, 101012, 101013, 10012].includes( err.errorcode )) {
            // 登录状态过期
            if(err.navigation) {
                logoutHandler(err.navigation)
                return showToast(err.message, {
                    onHidden: () => {
                        err.navigation.navigate('Login')
                    }
                })
            }
        }
        showToast(err.message)
        return resolve(err);
    });
}
export const noOpenHandler = () => {
    showToast('暂未开放,敬请期待!',{position: 120})
}