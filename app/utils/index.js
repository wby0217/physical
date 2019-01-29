import Toast from 'react-native-root-toast';
import Action from '../action';
export const showToast = (error, options) => {
    const message = typeof(error) === 'object' ? error.message : error;
    return Toast.show(message,
        Object.assign({duration: 800, position: Toast.positions.CENTER, backgroundColor: 'rgba(0,0,0,0.6)'}, options));
};

export const cleanCache = () => {
    return storage.remove({ key: 'sportsTypes' })
    .then(storage.remove({ key: 'evenType' }))
    .then(storage.remove({ key: 'topUpType' }))
    .then(storage.remove({ key: 'accountType' }))
    .then(storage.remove({ key: 'getCashType' }))
    .then(storage.remove({ key: 'playType' }))
    .then(storage.remove({ key: 'siteConfig' }))
}

export const logoutHandler = (navigation) => {
    navigation.dispatch(Action.updateUser({ isLogin: false }));
    storage.remove({ key: 'authToken' })
    storage.remove({ key: 'userInfo' })
    storage.remove({ key: 'accountType' })
}