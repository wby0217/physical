import _ from 'lodash';

const toLogin = (navigation, routeNames, params) => {
    try {
        navigation.navigate('Login', { routeNames, params })
    } catch (err) {
        throw new Error(err)
    }
}

export default {
    toLogin
}