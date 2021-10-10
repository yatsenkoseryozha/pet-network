import { ThunkAction } from "redux-thunk"
import { settingsAPI } from "../../../api/sidebar/settingsAPI"
import { AppStateType } from "../../store"

const UPDATE_CURRENT_PASSWORD = 'UPDATE-CURRENT-PASSWORD'
const UPDATE_NEW_PASSWORD = 'UPDATE-NEW-PASSWORD'

let initialState = {
    currentPassword: '', 
    newPassword: ''
}

export type InitialStateType = typeof initialState

const settingsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch(action.type) {
        case UPDATE_CURRENT_PASSWORD: {
            return {
                ...state,
                currentPassword: action.value
            }
        }
        case UPDATE_NEW_PASSWORD: {
            return {
                ...state,
                newPassword: action.value
            }
        }
        default: return state
    }
}

export default settingsReducer

type ActionsTypes = UpdateCurrentPasswordActionType | UpdateNewPasswordActionType

type UpdateCurrentPasswordActionType = { 
    type: typeof UPDATE_CURRENT_PASSWORD, 
    value: string 
}
export const updateCurrentPassword = (value: string): UpdateCurrentPasswordActionType => ({ 
    type: UPDATE_CURRENT_PASSWORD, value })

type UpdateNewPasswordActionType = { 
    type: typeof UPDATE_NEW_PASSWORD, 
    value: string 
}
export const updateNewPassword = (value: string): UpdateNewPasswordActionType => ({ type: UPDATE_NEW_PASSWORD, value })

export const changePassword = (currentPassword: string, 
                            newPassword: string): ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes> => {
    return async () => {
        try {
            let data = await settingsAPI.changePassword(currentPassword, newPassword)
            alert(data.message)
        } catch (error) {
            console.log(error)
        }
    }
}
