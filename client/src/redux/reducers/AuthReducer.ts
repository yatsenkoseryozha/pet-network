import { ThunkAction } from 'redux-thunk'
import { authAPI } from '../../api/authAPI'
import { AppStateType } from '../store'
import { UserType } from './Sidebar/DialogsReducer'

const UPDATE_USERNAME = 'UPDATE-USERNAME'
const UPDATE_EMAIL = 'UPDATE-EMAIL'
const UPDATE_PASSWORD = 'UPDATE-PASSWORD'
const SET_CURRENT_USER = 'SET-CURRENT-USER'
const UPDATE_REGISTRATION_MESSAGE = 'UPDATE-REGISTRATION-MESSAGE'

let initialState = {
    username: '',
    email: '',
    password: '',
    registrationMessage: '',
    currentUser: null as UserType | null,
}

export type InitialStateType = typeof initialState

const authReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch(action.type) {
        case UPDATE_USERNAME:
            return {
                ...state,
                username: action.value
            }
        case UPDATE_EMAIL:
            return {
                ...state,
                email: action.value
            }
        case UPDATE_PASSWORD:
            return {
                ...state,
                password: action.value
            }
        case UPDATE_REGISTRATION_MESSAGE:
            return {
                ...state,
                registrationMessage: action.value
            }
        case SET_CURRENT_USER: {
            return {
                ...state,
                currentUser: action.user
            }
        }
        default: return state
    }
}

export default authReducer

type ActionsTypes = UpdateUsernameActionType | UpdateEmailActionType | UpdatePasswordActionType | 
                    UpdateRegistrationMessageType | SetCurrentUserActionType

type UpdateUsernameActionType = {
    type: typeof UPDATE_USERNAME,
    value: string
}
export const updateUsername = (value: string): UpdateUsernameActionType => ({ type: UPDATE_USERNAME, value })

type UpdateEmailActionType = {
    type: typeof UPDATE_EMAIL,
    value: string
}
export const updateEmail = (value: string): UpdateEmailActionType => ({ type: UPDATE_EMAIL, value })

type UpdatePasswordActionType = {
    type: typeof UPDATE_PASSWORD,
    value: string
}
export const updatePassword = (value: string): UpdatePasswordActionType => ({ type: UPDATE_PASSWORD, value })

type UpdateRegistrationMessageType = {
    type: typeof UPDATE_REGISTRATION_MESSAGE
    value: string
}
export const updateRegistrationMessage = (value: string): UpdateRegistrationMessageType => ({ 
    type: UPDATE_REGISTRATION_MESSAGE, value })

type SetCurrentUserActionType = {
    type: typeof SET_CURRENT_USER,
    user: UserType
}
export const setCurrentUser = (user: UserType): SetCurrentUserActionType => ({ type: SET_CURRENT_USER, user })

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const registration = (username: string, email: string): ThunkType => {
    return async (dispatch) => {
        try {
            let data = await authAPI.registration(username, email)
            dispatch(updateRegistrationMessage(data.message))
        } catch (error) {
            console.log(error)
        }
    }
}

export const login = (username: string, password: string): ThunkType => {
    return async () => {
        try {
            let data = await authAPI.login(username, password)
            localStorage.setItem('token', data.token)
        } catch (error) {
            console.log(error)
        }
    }
}

export const auth = (): ThunkType => {
    return async (dispatch) => {
        try {
            let data = await authAPI.auth()
            dispatch(setCurrentUser(data.user))
        } catch (error) {
            localStorage.removeItem('token')
        }
    }
}
