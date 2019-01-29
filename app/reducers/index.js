import { combineReducers } from 'redux';
import matchReducer from './match';
import common from './common';

export default function getRootReducer(navReducer) {
    return combineReducers({
        nav: navReducer,
        match: matchReducer,
        common
    })
}