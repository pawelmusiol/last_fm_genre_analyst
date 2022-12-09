import CombinedReducers from './reducers'
import { createStore, compose } from 'redux'

const getDevtools = () => {
    if(typeof window !== 'undefined') {
        return window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    }
    return compose
}

// eslint-disable no-underscore-dangle 
export default createStore(
    CombinedReducers,
    getDevtools()
    )
// eslint-enable