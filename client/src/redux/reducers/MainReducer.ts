import { change } from 'redux-form'
import { ThunkAction } from 'redux-thunk'
import { mainAPI } from '../../api/mainAPI'
import { sidebarAPI } from '../../api/sidebarAPI'
import { AppStateType } from '../store'
import { ERROR, SUCCESS } from './AuthReducer'
import { DialogType, UserType } from './SidebarReducer'

const TOGGLE_MAIN_IS_FETCHING = 'TOGGLE-MAIN-IS-FETCHING'
const UPDATE_MAIN_NOTIFICATION = 'UPDATE-MAIN-NOTIFICATION'
const SET_CURRENT_DIALOG = 'SET-CURRENT-DIALOG'
const GET_MESSAGES = 'GET-MESSAGES'

export type MainNotificationType = {
    type: typeof SUCCESS | typeof ERROR
    code: 0 | 41 | 43 | 99
    message: string
}

export type MessageType = {
    _id: string
    sender: UserType,
    text: string
}

let initialState = {
    isFetching: false,
    notification: null as MainNotificationType | null,
    currentDialog: null as DialogType | null,
    messages: [] as Array<MessageType>
}
export type InitialStateType = typeof initialState

const mainReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch(action.type) {
        case TOGGLE_MAIN_IS_FETCHING:
            return {
                ...state,
                isFetching: !state.isFetching
            }
        case UPDATE_MAIN_NOTIFICATION:
            return {
                ...state,
                notification: action.notification
            }
        case SET_CURRENT_DIALOG:
            return {
                ...state,
                currentDialog: action.dialog
            }
        case GET_MESSAGES:
            return {
                ...state,
                messages: [...action.messages]
            }
        default: return state
    }
}

export default mainReducer

type ActionsTypes = ToggleMainIsFetchingActionType | UpdateMainNotificationActionType | SetCurrentDialogActionType | GetMessagesActionType

type ToggleMainIsFetchingActionType = {
    type: typeof TOGGLE_MAIN_IS_FETCHING
}
export const toggleMainIsFetching = (): ToggleMainIsFetchingActionType => ({ type: TOGGLE_MAIN_IS_FETCHING })

type UpdateMainNotificationActionType = {
    type: typeof UPDATE_MAIN_NOTIFICATION
    notification: MainNotificationType | null
}
export const updateMainNotification = (notification: MainNotificationType | null): UpdateMainNotificationActionType => ({
    type: UPDATE_MAIN_NOTIFICATION, notification
})

export type SetCurrentDialogActionType = {
    type: typeof SET_CURRENT_DIALOG
    dialog: DialogType | null
}
export const setCurrentDialogActionCreator = (dialog: DialogType | null): SetCurrentDialogActionType => ({ type: SET_CURRENT_DIALOG, dialog })

export type GetMessagesActionType = {
    type: typeof GET_MESSAGES,
    messages: Array<MessageType>
}
export const getMessagesActionCreator = (messages: Array<MessageType>): GetMessagesActionType => ({ type: GET_MESSAGES, messages })

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const setCurrentDialog = (dialog: DialogType | null): ThunkType => {
    return async (dispatch) => {
        try {
            dispatch(setCurrentDialogActionCreator(dialog))
            if (dialog?._id) {
                dispatch(toggleMainIsFetching())
                await dispatch(getMessages(dialog))
                dispatch(toggleMainIsFetching())
            } else dispatch(getMessages(null))
        } catch (error: any) {
            console.log(error)
            dispatch(updateMainNotification({
                type: error.response.data.type,
                code: error.response.data.code,
                message: error.response.data.message
            }))
            dispatch(toggleMainIsFetching())
        }
    }
}

export const getMessages = (dialog: DialogType | null): ThunkType => {
    return async (dispatch) => {
        try {
            if (dialog) {
                let data = await mainAPI.getMessages(dialog._id)
                dispatch(getMessagesActionCreator(data.messages))
            } else dispatch(getMessagesActionCreator([]))
        } catch (error: any) {
            console.log(error)
            dispatch(updateMainNotification({
                type: error.response.data.type,
                code: error.response.data.code,
                message: error.response.data.message
            }))
        }
    }
}

export const sendMessage = (currentDialog: DialogType, text: string): ThunkType => {
    return async (dispatch) => {
        try {
            if (!currentDialog._id) {
                currentDialog = await sidebarAPI.createDialog(currentDialog.members)
                dispatch(setCurrentDialog(currentDialog))
                dispatch(change('search', 'toSearch', ''))
            }
            await mainAPI.sendMessage(currentDialog, text)
        } catch (error: any) {
            console.log(error)
            dispatch(updateMainNotification({
                type: error.response.data.type,
                code: error.response.data.code,
                message: error.response.data.message
            }))
            dispatch(toggleMainIsFetching())
        }
    }
}