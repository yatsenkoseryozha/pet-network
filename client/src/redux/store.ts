import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { reducer as formReducer } from 'redux-form'
import authReducer from './reducers/AuthReducer'
import mainReducer from './reducers/MainReducer'
import dialogsReducer from './reducers/Sidebar/DialogsReducer'
import settingsReducer from './reducers/Sidebar/SettingsReducer'

let rootReducer = combineReducers({
    auth: authReducer,
    main: mainReducer,
    dialogs: dialogsReducer,
    settings: settingsReducer,
    form: formReducer
})

type RootReducerType = typeof rootReducer
export type AppStateType = ReturnType<RootReducerType>

let store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

export default store

// @ts-ignore
window.__store__ = store