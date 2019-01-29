
import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar,
  BackHandler,
  Platform,
} from 'react-native';
import { Provider, connect } from "react-redux";
import { StackNavigator, addNavigationHelpers } from "react-navigation";
import {
    createReduxBoundAddListener,
    createReactNavigationReduxMiddleware,
  } from 'react-navigation-redux-helpers';
import LinearGradient from 'react-native-linear-gradient';
import { updateFocus } from 'react-navigation-is-focused-hoc';
import _ from 'lodash';
import Routes from './routes';
import getStore from "./store";
import Action from './action';
import './utils/cacheStorage';
import './config/syncStorage';
import service from './service';
import ErrorHandle from './service/errorHandle';
import { showToast } from './utils';
// if(__DEV__ && typeof window !== 'undefined') {
//     XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
//     GLOBAL.originalXMLHttpRequest :
//     GLOBAL.XMLHttpRequest;
// }
const middleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
  );
const addListener = createReduxBoundAddListener("root");
const AppNavigator = StackNavigator(Routes, {
    navigationOptions: {
        header: null,
        headerTintColor: '#FFF',
        headerTitleStyle: {
            alignSelf: 'center'
        },
        headerStyle: {
            backgroundColor: '#17A84B'
        }
    },
    initialRouteName: 'Splash',
    gesturesEnabled: false
});
const navReducer = (state, action) => {
    if(action.type.startsWith('Navigation/NAVIGATE')) {
        if(state.routes.length > 1) {
            const { type, routeName } = action;
            const lastRoute = state.routes[state.index];
            // type == lastRoute.type && 
            if(routeName == lastRoute.routeName) return state;
        }
    }
    if(!action.type.startsWith('Navigation/BACK')) {
        StatusBar.setBarStyle('light-content');
    }
    const newState = AppNavigator.router.getStateForAction(action, state);
    
    updateFocus(newState);
    return newState || state;
};

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            backState: 0
        }
    }
    componentWillMount() {
        if (Platform.OS !== 'android') return;
        BackHandler.addEventListener('hardwareBackPress', function() {
            const { dispatch, navigation, nav } = this.props;
            return true;
        }.bind(this));
    }
    componentDidMount() {
        storage.load({
            key: 'userInfo'
        })
        .then(res => {
            this.props.dispatch(Action.updateUser({ isLogin: true, ...res }));
        })
        .catch(err => {
            console.log(err)
        })
        storage.load({
            key: 'authToken'
        })
        .then(res => {
            this.props.dispatch(Action.saveAccountType({ type: res.identity }));
        })
        .catch(err => {
            console.log(err)
        });
        this.initializeFetch();
    }
    initializeFetch = () => {
        service.popupService({
            terminal: Platform.OS
        })
        .then(res => {
            // console.log(this.props)
            if(res.data && res.data.result) {
                const signInPop = _.filter(res.data.result, (o) => o.position === 'signin');
                const indexPop = _.filter(res.data.result, (o) => o.position === 'index');
                this.props.dispatch(Action.savePopupInfo({ signIn: signInPop[0], index: indexPop[0] }));
            }
        })
        .catch(ErrorHandle)
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress');
    }
    // initBindBackhander = () => {
    //     BackHandler.addEventListener('hardwareBackPress', () => {
    //         const { nav, dispatch } = this.props;
    //         console.log('hardwareBackPress====================');
    //         console.log(this.props)
    //         if( this.shouldCloseApp(nav)) {
    //             this.setState({
    //                 backState: this.state.backState + 1
    //             }, () => {
    //                 if(this.state.backState == 1) {
    //                     showToast("再按一次退出程序") 
    //                     return true;
    //                 } else {
    //                     return false;
    //                 }
    //             })
    //         }
    //         dispatch({
    //             type: 'Navigation/BACK'
    //         })
    //         return true;
    //     })
    // }
    // shouldCloseApp = (nav) => {
    //     return nav.index == 0;
    // }
    render() {
        return (
            <AppNavigator
                navigation={addNavigationHelpers({
                        dispatch: this.props.dispatch,
                        state: this.props.nav,
                        addListener,
                    })}
            />
        )
    }
    componentWillUnMount() {
        console.log('will unmount');
    }
}
const mapStateToProps = (state) => ({
    nav: state.nav
});
const AppWithNavigationState = connect(mapStateToProps)(App);
const store = getStore(navReducer, middleware);

export default function GenApp() {
    return (
        <Provider store={store}>
            <AppWithNavigationState />
        </Provider>
    )
}