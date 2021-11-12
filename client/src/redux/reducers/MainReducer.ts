import { change } from 'redux-form'
import { ThunkAction } from 'redux-thunk'
import { mainAPI } from '../../api/mainAPI'
import { sidebarAPI } from '../../api/sidebarAPI'
import { AppStateType } from '../store'
import { ERROR, SUCCESS } from './AuthReducer'
import { DialogType, setCurrentDialog, SetCurrentDialogActionType, UserType } from './SidebarReducer'

const TOGGLE_MAIN_IS_FETCHING = 'TOGGLE-MAIN-IS-FETCHING'
const UPDATE_MAIN_NOTIFICATION = 'UPDATE-MAIN-NOTIFICATION'
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

export type GetMessagesActionType = {
    type: typeof GET_MESSAGES,
    messages: Array<MessageType>
}
export const getMessagesActionCreator = (messages: Array<MessageType>): GetMessagesActionType => ({ type: GET_MESSAGES, messages })

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getMessages = (dialog: DialogType): ThunkType => {
    return async (dispatch) => {
        try {
            if (dialog._id) {
                dispatch(toggleMainIsFetching())
                let data = await mainAPI.getMessages(dialog._id)
                dispatch(getMessagesActionCreator(data.messages))
                dispatch(updateMainNotification(null))
                dispatch(toggleMainIsFetching())
            } else dispatch(getMessagesActionCreator([]))
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

export const sendMessage = (currentDialog: DialogType, text: string): ThunkType => {
    return async (dispatch) => {
        try {
            dispatch(toggleMainIsFetching())
            if (!currentDialog._id) {
                currentDialog = await sidebarAPI.createDialog(currentDialog.members)
                dispatch(setCurrentDialog(currentDialog))
                dispatch(change('search', 'toSearch', ''))
            }
            await mainAPI.sendMessage(currentDialog, text)
            dispatch(updateMainNotification(null))
            dispatch(toggleMainIsFetching())
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