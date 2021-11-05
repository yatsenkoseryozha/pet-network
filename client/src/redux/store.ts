import { applyMiddleware, combineReducers, createStore } from 'redux'
import { reducer as formReducer } from 'redux-form'
import thunkMiddleware from 'redux-thunk'
import authReducer from './reducers/AuthReducer'
import mainReducer from './reducers/MainReducer'
import sidebarReducer from './reducers/SidebarReducer'

let rootReducer = combineReducers({
    auth: authReducer,
    main: mainReducer,
    sidebar: sidebarReducer,
    form: formReducer
})

type RootReducerType = typeof rootReducer
export type AppStateType = ReturnType<RootReducerType>

let store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

export default store

// @ts-ignore
window.__store__ = store