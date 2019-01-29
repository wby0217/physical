import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';

const middlewares = [thunk];
if(__DEV__ && typeof window !== 'undefined') {
    middlewares.push(createLogger())
}
export default function getStore(navReducer, middle) {
    return createStore(
            rootReducer(navReducer),
            applyMiddleware(middle, ...middlewares))
}