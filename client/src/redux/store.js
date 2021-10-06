import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import authReducer from './reducers/AuthReducer'
import mainReducer from './reducers/MainReducer'
import dialogsReducer from './reducers/Sidebar/DialogsReducer'
import settingsReducer from './reducers/Sidebar/SettingsReducer'

let reducers = combineReducers({
    auth: authReducer,
    main: mainReducer,
    dialogs: dialogsReducer,
    settings: settingsReducer
})

let store = createStore(reducers, applyMiddleware(thunkMiddleware))

export default store

window.store = store