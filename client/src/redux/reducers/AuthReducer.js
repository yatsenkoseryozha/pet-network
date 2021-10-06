import { authAPI } from '../../api/authAPI'

const UPDATE_USERNAME = 'UPDATE-USERNAME'
const UPDATE_EMAIL = 'UPDATE-EMAIL'
const UPDATE_PASSWORD = 'UPDATE-PASSWORD'
const SET_CURRENT_USER = 'SET-CURRENT-USER'

let initialState = {
    creditionals: {
        username: '',
        email: '',
        password: '',
    },
    currentUser: {
        id: null,
        username: null,
        isActivated: null
    }
}

const authReducer = (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_USERNAME: {
            let newState = {...state}
            newState.creditionals = {...state.creditionals}
            newState.creditionals.username = action.value
            return newState
        }
        case UPDATE_EMAIL: {
            let newState = {...state}
            newState.creditionals = {...state.creditionals}
            newState.creditionals.email = action.value
            return newState
        }
        case UPDATE_PASSWORD: {
            let newState = {...state}
            newState.creditionals = {...state.creditionals}
            newState.creditionals.password = action.value
            return newState
        }
        case SET_CURRENT_USER: {
            let newState = {...state}
            newState.currentUser = {...state.currentUser}
            newState.currentUser.id = action.id
            newState.currentUser.username = action.username
            newState.currentUser.isActivated = action.isActivated
            return newState
        }
        default:
            return state
    }
}

export default authReducer

export const updateUsername = (value) => ({ type: UPDATE_USERNAME, value })
export const updateEmail = (value) => ({ type: UPDATE_EMAIL, value })
export const updatePassword = (value) => ({ type: UPDATE_PASSWORD, value })
export const setCurrentUser = (id, username, isActivated) => ({ type: SET_CURRENT_USER, id, username, isActivated })

export const registration = (username, email) => (dispatch) => {
    return authAPI.registration(username, email).then(data => {
        return data.message
    })
}

export const login = (username, password) => (dispatch) => {
    return authAPI.login(username, password).then(data => {
        return data.token
    })
}

export const auth = (token) => (dispatch) => {
    return authAPI.auth(token).then(data => {
        dispatch(setCurrentUser(data.id, data.username, data.isActivated))
    })
}
