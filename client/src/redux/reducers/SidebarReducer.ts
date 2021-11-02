import { ThunkAction } from "redux-thunk"
import { sidebarAPI } from "../../api/sidebarAPI"
import { AppStateType } from "../store"

const GET_DIALOGS = 'GET-DIALOGS'
const SET_CURRENT_DIALOG = 'SET-CURRENT-DIALOG'
const TOGGLE_IS_FETCHING = 'TOGGLE-IS-FETCHING'
const GET_USERS = 'GET-USERS'
const UPDATE_PASSWORD_CHANGE_MESSAGE = 'UPDATE-PASSWORD-CHANGE-MESSAGE'


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
    users: [] as Array<UserType>,
    dialogs: [] as Array<DialogType>,
    currentDialog: null as DialogType | null,
    passwordChangeMessage: ''
}

export type InitialStateType = typeof initialState

const sidebarReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case GET_DIALOGS:
            return {
                ...state,
                dialogs: [...action.dialogs]
            }
        case SET_CURRENT_DIALOG:
            return {
                ...state,
                currentDialog: { ...action.dialog }
            }
        case TOGGLE_IS_FETCHING:
            return {
                ...state,
                isFetching: !state.isFetching
            }
        case GET_USERS:
            let filteredUsers: Array<UserType> = []
            action.users.forEach((user: UserType) => {
                let hasAlready = false
                state.dialogs.forEach((dialog: DialogType) => {
                    if (dialog.members.some((member: UserType) => member.username === user.username))
                        hasAlready = true
                })
                if (!hasAlready) filteredUsers.push(user)
            })
            return {
                ...state,
                users: filteredUsers
            }
        case UPDATE_PASSWORD_CHANGE_MESSAGE: 
            return {
                ...state,
                passwordChangeMessage: action.value
            }
        default: return state
    }
}

export default sidebarReducer

type ActionsTypes = GetUsersActionType | GetDialogsActionType | SetCurrentDialogActionType | ToggleIsFetchingActionType | UpdatePasswordChangeMessage

type GetDialogsActionType = {
    type: typeof GET_DIALOGS
    dialogs: Array<DialogType>
}
export const getDialogsActionCreator = (dialogs: Array<DialogType>): GetDialogsActionType => ({ type: GET_DIALOGS, dialogs })

export type SetCurrentDialogActionType = {
    type: typeof SET_CURRENT_DIALOG
    dialog: DialogType
}
export const setCurrentDialog = (dialog: DialogType): SetCurrentDialogActionType => ({ type: SET_CURRENT_DIALOG, dialog })

type ToggleIsFetchingActionType = {
    type: typeof TOGGLE_IS_FETCHING
}
export const toggleIsFetching = (): ToggleIsFetchingActionType => ({ type: TOGGLE_IS_FETCHING })

type GetUsersActionType = {
    type: typeof GET_USERS
    users: Array<UserType>
}
export const getUsersActionCreator = (users: Array<UserType>): GetUsersActionType => ({ type: GET_USERS, users })

type UpdatePasswordChangeMessage = {
    type: typeof UPDATE_PASSWORD_CHANGE_MESSAGE
    value: string
}
export const updatePasswordChangeMessage = (value: string): UpdatePasswordChangeMessage => ({ type: UPDATE_PASSWORD_CHANGE_MESSAGE, value })

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getDialogs = (): ThunkType => {
    return async (dispatch) => {
        try {
            let data = await sidebarAPI.getDialogs()
            dispatch(getDialogsActionCreator(data.conversations))
        } catch (error) {
            console.log(error)
        }
    }
}

export const getUsers = (username: string): ThunkType => {
    return async (dispatch) => {
        try {
            if (username) {
                dispatch(toggleIsFetching())
                let data = await sidebarAPI.getUsers(username.toLowerCase())
                dispatch(toggleIsFetching())
                dispatch(getUsersActionCreator(data.users))
            } else dispatch(getUsersActionCreator([]))
        } catch (error) {
            console.log(error)
        }
    }
}

export const changePassword = (currentPassword: string, newPassword: string): ThunkType => {
    return async (dispatch) => {
        try {
            dispatch(toggleIsFetching())
            let data = await sidebarAPI.changePassword(currentPassword, newPassword)
            dispatch(toggleIsFetching())
            dispatch(updatePasswordChangeMessage(data.message))
        } catch (error) {
            console.log(error)
        }
    }
}