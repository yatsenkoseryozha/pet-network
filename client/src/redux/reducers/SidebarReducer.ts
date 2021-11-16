import { ThunkAction } from "redux-thunk"
import { sidebarAPI } from "../../api/sidebarAPI"
import { AppStateType } from "../store"
import { ERROR, SUCCESS } from "./AuthReducer"

const TOGGLE_SIDEBAR_IS_FETCHING = 'TOGGLE-SIDEBAR-IS-FETCHING'
const UPDATE_SIDEBAR_NOTIFICATION = 'UPDATE-SIDEBAR-NOTIFICATION'
const GET_USERS = 'GET-USERS'
const GET_DIALOGS = 'GET-DIALOGS'

export type SidebarNotificationType = {
    type: typeof SUCCESS | typeof ERROR
    code: 0 | 1 | 41 | 99
    message: string
}

export type UserType = {
    _id: string,
    username: string
}

export type DialogType = {
    _id: string | null
    members: Array<UserType>
    lastMessage: {
        sender: UserType
        text: string
    } | null
}

const initialState = {
    isFetching: false,
    notification: null as SidebarNotificationType | null,
    users: [] as Array<UserType>,
    dialogs: [] as Array<DialogType>,
}

export type InitialStateType = typeof initialState

const sidebarReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case TOGGLE_SIDEBAR_IS_FETCHING:
            return {
                ...state,
                isFetching: !state.isFetching
            }
        case UPDATE_SIDEBAR_NOTIFICATION:
            return {
                ...state,
                notification: action.notification
            }
        case GET_USERS:
            return {
                ...state,
                users: action.users
            }
        case GET_DIALOGS:
            return {
                ...state,
                dialogs: [...action.dialogs]
            }
        default: return state
    }
}

export default sidebarReducer

type ActionsTypes = GetUsersActionType | GetDialogsActionType | ToggleSidebarIsFetchingActionType | UpdateSidebarNotificationActionType

type ToggleSidebarIsFetchingActionType = {
    type: typeof TOGGLE_SIDEBAR_IS_FETCHING
}
export const toggleSidebarIsFetching = (): ToggleSidebarIsFetchingActionType => ({ type: TOGGLE_SIDEBAR_IS_FETCHING })

type UpdateSidebarNotificationActionType = {
    type: typeof UPDATE_SIDEBAR_NOTIFICATION
    notification: SidebarNotificationType | null
}
export const updateSidebarNotification = (notification: SidebarNotificationType | null): UpdateSidebarNotificationActionType => ({
    type: UPDATE_SIDEBAR_NOTIFICATION, notification
})

type GetUsersActionType = {
    type: typeof GET_USERS
    users: Array<UserType>
}
export const getUsersActionCreator = (users: Array<UserType>): GetUsersActionType => ({ type: GET_USERS, users })

type GetDialogsActionType = {
    type: typeof GET_DIALOGS
    dialogs: Array<DialogType>
}
export const getDialogsActionCreator = (dialogs: Array<DialogType>): GetDialogsActionType => ({ type: GET_DIALOGS, dialogs })

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getUsers = (username: string): ThunkType => {
    return async (dispatch) => {
        try {
            if (username) {
                dispatch(toggleSidebarIsFetching())
                let data = await sidebarAPI.getUsers(username.toLowerCase())
                dispatch(getUsersActionCreator(data.users))
                dispatch(updateSidebarNotification(null))
                dispatch(toggleSidebarIsFetching())
            } else dispatch(getUsersActionCreator([]))
        } catch (error: any) {
            console.log(error)
            dispatch(updateSidebarNotification({
                type: error.response.data.type,
                code: error.response.data.code,
                message: error.response.data.message
            }))
            dispatch(toggleSidebarIsFetching())
        }
    }
}

export const getDialogs = (): ThunkType => {
    return async (dispatch) => {
        try {
            dispatch(toggleSidebarIsFetching())
            let data = await sidebarAPI.getDialogs()
            dispatch(getDialogsActionCreator(data.conversations))
            dispatch(updateSidebarNotification(null))
            dispatch(toggleSidebarIsFetching())
        } catch (error: any) {
            console.log(error)
            dispatch(updateSidebarNotification({
                type: error.response.data.type,
                code: error.response.data.code,
                message: error.response.data.message
            }))
            dispatch(toggleSidebarIsFetching())
        }
    }
}

export const changePassword = (currentPassword: string, newPassword: string, callback: any): ThunkType => {
    return async (dispatch) => {
        try {
            dispatch(toggleSidebarIsFetching())
            let data = await sidebarAPI.changePassword(currentPassword, newPassword)
            dispatch(updateSidebarNotification({
                type: data.type,
                code: data.code,
                message: data.message
            }))
            dispatch(toggleSidebarIsFetching())
            callback()
        } catch (error: any) {
            console.log(error)
            dispatch(updateSidebarNotification({
                type: error.response.data.type,
                code: error.response.data.code,
                message: error.response.data.message
            }))
            dispatch(toggleSidebarIsFetching())
        }
    }
}