import { settingsAPI } from "../../../api/sidebar/settingsAPI"

const UPDATE_CURRENT_PASSWORD = 'UPDATE-CURRENT-PASSWORD'
const UPDATE_NEW_PASSWORD = 'UPDATE-NEW-PASSWORD'

let initialState = {
    passwordChange: {
        currentPassword: null, 
        newPassword: null
    }
}

const settingsReducer = (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_CURRENT_PASSWORD: {
            let newState = {...state}
            newState.passwordChange = {...newState.passwordChange}
            newState.passwordChange.currentPassword = action.value
            return newState
        }
        case UPDATE_NEW_PASSWORD: {
            let newState = {...state}
            newState.passwordChange = {...newState.passwordChange}
            newState.passwordChange.newPassword = action.value
            return newState
        }
        default: {
            return state
        }
    }
}

export default settingsReducer

export const updateCurrentPassword = (value) => ({ type: UPDATE_CURRENT_PASSWORD, value })
export const updateNewPassword = (value) => ({ type: UPDATE_NEW_PASSWORD, value })

export const changePassword = (currentPassword, newPassword) => (dispatch) => {
    return settingsAPI.changePassword(currentPassword, newPassword).then((data) => {
        return data.message
    })
}
