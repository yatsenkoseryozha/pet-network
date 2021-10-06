import { dialogsAPI } from "../../../api/sidebar/dialogsAPI"

const GET_DIALOGS = 'GET-DIALOGS'
const SET_CURRENT_DIALOG = 'SET-CURRENT-DIALOG'
const UPDATE_TO_SEARCH = 'UPDATE-TO-SEARCH'
const GET_USERS = 'GET-USERS'

const initialState = {
    dialogs: [],
    currentDialog: {
        id: null,
        receiver: {
            id: null,
            username: null
        },
        messages: []
    },
    toSearch: '',
    users: []
}

const dialogsReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_DIALOGS: {
            let newState = {...state}
            newState.dialogs = [...action.dialogs]
            return newState
        }
        case SET_CURRENT_DIALOG: {
            let newState = {...state}
            newState.currentDialog = {
                id: action.id,
                receiver: action.receiver,
                messages: [...action.messages]
            }
            return newState
        }
        case UPDATE_TO_SEARCH: {
            let newState = {...state}
            newState.toSearch = action.value
            return newState
        }
        case  GET_USERS: {
            let newState = {...state}
            newState.users = [...state.users]
            let filteredUsers = []
            action.users.forEach(user => {
                let hasAlready = newState.dialogs.map(dialog => {
                    return dialog.members.some(member => member.username === user.username)
                })
                if (!hasAlready.some(element => element)) filteredUsers.push(user)
            })
            newState.users = filteredUsers
            return newState
        }
        default:
            return state
    }
}

export default dialogsReducer

export const getDialogsActionCreator = (dialogs) => ({ type: GET_DIALOGS, dialogs })
export const setCurrentDialogActionCreator = (id, receiver, messages) => ({ type: SET_CURRENT_DIALOG, id, receiver, messages })
export const updateToSearch = (value) => ({ type: UPDATE_TO_SEARCH, value })
export const getUsersActionCreator = (users) => ({ type: GET_USERS, users })

export const getDialogs = () => (dispatch) => {
    return dialogsAPI.getDialogs().then(data => {
        dispatch(getDialogsActionCreator(data.conversations))
    })
}

export const setCurrentDialog = (dialog, currentUser) => (dispatch) => {
    return dialogsAPI.getMessages(dialog._id).then(data => {
        dialog.members
            .filter(member => member.id !== currentUser.id)
            .map(member => dispatch(setCurrentDialogActionCreator(dialog._id, {id: member._id, username: member.username}, data.messages)))
    })
}

export const getUsers = (username) => (dispatch) => {
    dispatch(updateToSearch(username))
    return dialogsAPI.getUsers(username).then(data => {
        dispatch(getUsersActionCreator(data.users))
    })
}