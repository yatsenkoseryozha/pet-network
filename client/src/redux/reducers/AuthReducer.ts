import { ThunkAction } from 'redux-thunk'
import { authAPI } from '../../api/authAPI'
import { AppStateType } from '../store'
import { UserType } from './SidebarReducer'

const TOGGLE_AUTH_IS_FETCHING = 'TOGGLE-AUTH-IS-FETCHING'
const UPDATE_AUTH_NOTIFICATION = 'UPDATE-AUTH-NOTIFICATION'
const SET_CURRENT_USER = 'SET-CURRENT-USER'

export const SUCCESS = 'success'
export const ERROR = 'error'

export type AuthNotificationType = {
    type: typeof SUCCESS | typeof ERROR
    code: 0 | 1 | 2 | 41 | 99
    message: string
}

let initialState = {
    isFetching: false,
    notification: null as AuthNotificationType | null,
    currentUser: null as UserType | null
}

export type InitialStateType = typeof initialState

const authReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch(action.type) {
        case TOGGLE_AUTH_IS_FETCHING:
            return {
                ...state,
                isFetching: !state.isFetching
            }
        case UPDATE_AUTH_NOTIFICATION:
            return {
                ...state,
                notification: action.notification
            }
        case SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.user
            }
        default: return state
    }
}

export default authReducer

type ActionsTypes = ToggleAuthIsFetchingActionType | UpdateAuthNotificationActionType | SetCurrentUserActionType

type ToggleAuthIsFetchingActionType = {
    type: typeof TOGGLE_AUTH_IS_FETCHING
}
export const toggleIsAuthFetching = (): ToggleAuthIsFetchingActionType => ({ type: TOGGLE_AUTH_IS_FETCHING })

type UpdateAuthNotificationActionType = {
    type: typeof UPDATE_AUTH_NOTIFICATION
    notification: AuthNotificationType | null
}
export const updateAuthNotification = (notification: AuthNotificationType | null): UpdateAuthNotificationActionType => ({ type: UPDATE_AUTH_NOTIFICATION, notification })

type SetCurrentUserActionType = {
    type: typeof SET_CURRENT_USER
    user: UserType | null
}
export const setCurrentUser = (user: UserType | null): SetCurrentUserActionType => ({ type: SET_CURRENT_USER, user })

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const registration = (username: string, email: string): ThunkType => {
    return async (dispatch) => {
        try {
            dispatch(toggleIsAuthFetching())
            let data = await authAPI.registration(username, email)
            dispatch(updateAuthNotification({
                type: data.type,
                code: data.code,
                message: data.message
            }))
            dispatch(toggleIsAuthFetching())
        } catch (error: any) {
            console.log(error)
            dispatch(updateAuthNotification({
                type: error.response.data.type,
                code: error.response.data.code,
                message: error.response.data.message
            }))
            dispatch(toggleIsAuthFetching())
        }
    }
}

export const login = (username: string, password: string): ThunkType => {
    return async (dispatch) => {
        try {
            dispatch(toggleIsAuthFetching())
            let data = await authAPI.login(username, password)
            localStorage.setItem('token', data.token)
            dispatch(updateAuthNotification(null))
            dispatch(toggleIsAuthFetching())
            dispatch(auth())
        } catch (error: any) {
            console.log(error)
            dispatch(updateAuthNotification({
                type: error.response.data.type,
                code: error.response.data.code,
                message: error.response.data.message
            }))
            dispatch(toggleIsAuthFetching())
        }
    }
}

export const logout = (): ThunkType => {
    return async () => {
        localStorage.removeItem('token')
        window.location.reload()
    }
}

export const auth = (): ThunkType => {
    return async (dispatch) => {
        try {
            dispatch(toggleIsAuthFetching())
            let data = await authAPI.auth()
            dispatch(setCurrentUser(data.user))
            dispatch(toggleIsAuthFetching())
        } catch (error: any) {
            console.log(error)
            localStorage.removeItem('token')
            dispatch(updateAuthNotification({
                type: error.response.data.type,
                code: error.response.data.code,
                message: error.response.data.message
            }))
            dispatch(toggleIsAuthFetching())
        }
    }
}
