import { ThunkAction } from 'redux-thunk'
import { authAPI } from '../../api/authAPI'
import { AppStateType } from '../store'
import { UserType } from './Sidebar/DialogsReducer'

const TOGGLE_IS_FETCHING = 'TOGGLE-IS-FETCHING'
const UPDATE_REGISTRATION_MESSAGE = 'UPDATE-REGISTRATION-MESSAGE'
const SET_CURRENT_USER = 'SET-CURRENT-USER'

let initialState = {
    isFetching: false,
    registrationMessage: '',
    currentUser: null as UserType | null
}

export type InitialStateType = typeof initialState

const authReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch(action.type) {
        case TOGGLE_IS_FETCHING:
            return {
                ...state,
                isFetching: !state.isFetching
            }
        case UPDATE_REGISTRATION_MESSAGE:
            return {
                ...state,
                registrationMessage: action.value
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

type ActionsTypes = ToggleIsFetching | UpdateRegistrationMessageType | SetCurrentUserActionType

type ToggleIsFetching = {
    type: typeof TOGGLE_IS_FETCHING
}
export const toggleIsFetching = (): ToggleIsFetching => ({ type: TOGGLE_IS_FETCHING })

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
            dispatch(toggleIsFetching())
            let data = await authAPI.registration(username, email)
            dispatch(updateRegistrationMessage(data.message))
            dispatch(toggleIsFetching())
        } catch (error) {
            console.log(error)
            dispatch(toggleIsFetching())
        }
    }
}

export const login = (username: string, password: string): ThunkType => {
    return async (dispatch) => {
        try {
            dispatch(toggleIsFetching())
            let data = await authAPI.login(username, password)
            localStorage.setItem('token', data.token)
            dispatch(toggleIsFetching())
        } catch (error) {
            console.log(error)
            dispatch(toggleIsFetching())
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
