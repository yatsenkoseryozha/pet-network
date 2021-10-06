import { mainAPI } from "../../api/mainAPI"

const UPDATE_NEW_MESSAGE = 'UPDATE-NEW-MESSAGE'

let initialState = {
    newMessage: ''
}

const mainReducer = (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_NEW_MESSAGE: {
            let newState = {...state}
            newState.newMessage = action.value
            return newState
        }
        default:
            return state
    }
}

export default mainReducer

export const updateNewMessage = (value) => ({ type: UPDATE_NEW_MESSAGE, value })

export const sendMessage = (dialog, text) => (dispatch) => {
    return mainAPI.sendMessage(dialog, text).then(data => {
        dispatch(updateNewMessage(""))
    })
}   