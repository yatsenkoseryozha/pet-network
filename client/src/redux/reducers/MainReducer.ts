import { ThunkAction } from 'redux-thunk'
import { mainAPI } from '../../api/mainAPI'
import { AppStateType } from '../store'
import { CurrentDialogType } from './Sidebar/DialogsReducer'

const UPDATE_NEW_MESSAGE = 'UPDATE-NEW-MESSAGE'

let initialState = {
    newMessage: ''
}
export type InitialStateType = typeof initialState

const mainReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch(action.type) {
        case UPDATE_NEW_MESSAGE:
            return {
                ...state,
                newMessage: action.value
            }
        default: return state
    }
}

export default mainReducer

type ActionsTypes = UpdateNewMessageActionType

export type UpdateNewMessageActionType = {
    type: typeof UPDATE_NEW_MESSAGE,
    value: string
}
export const updateNewMessage = (value: string): UpdateNewMessageActionType => ({ type: UPDATE_NEW_MESSAGE, value })

 export const sendMessage = (currentDialog: CurrentDialogType, 
                            text: string): ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes> => {
    return async (dispatch) => {
        try {
            await mainAPI.sendMessage(currentDialog, text)
            dispatch(updateNewMessage(""))
        } catch (error) {
            console.log(error)
        }
    }
}