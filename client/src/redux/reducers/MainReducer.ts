import { ThunkAction } from 'redux-thunk'
import { mainAPI } from '../../api/mainAPI'
import { dialogsAPI } from '../../api/sidebar/dialogsAPI'
import { AppStateType } from '../store'
import { DialogType, setCurrentDialog, SetCurrentDialogActionType, UserType } from './Sidebar/DialogsReducer'

const GET_MESSAGES = 'GET-MESSAGES'

export type MessageType = {
    _id: string
    sender: UserType,
    text: string
}

let initialState = {
    messages: [] as Array<MessageType>
}
export type InitialStateType = typeof initialState

const mainReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch(action.type) {
        case GET_MESSAGES:
            return {
                ...state,
                messages: [...action.messages]
            }
        default: return state
    }
}

export default mainReducer

type ActionsTypes = GetMessagesActionType | SetCurrentDialogActionType

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
                let data = await mainAPI.getMessages(dialog._id)
                dispatch(getMessagesActionCreator(data.messages))
            } else dispatch(getMessagesActionCreator([]))
        } catch (error) {
            console.log(error)
        }
    }
}

export const sendMessage = (currentDialog: DialogType, text: string): ThunkType => {
    return async (dispatch) => {
        try {
            if (!currentDialog._id) {
                currentDialog = await dialogsAPI.createDialog(currentDialog.members)
                dispatch(setCurrentDialog(currentDialog))
            }
            await mainAPI.sendMessage(currentDialog, text)
        } catch (error) {
            console.log(error)
        }
    }
}