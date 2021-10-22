import { ThunkAction } from "redux-thunk"
import { dialogsAPI } from "../../../api/sidebar/dialogsAPI"
import { AppStateType } from "../../store"

const GET_DIALOGS = 'GET-DIALOGS'
const SET_CURRENT_DIALOG = 'SET-CURRENT-DIALOG'
const UPDATE_TO_SEARCH = 'UPDATE-TO-SEARCH'
const GET_USERS = 'GET-USERS'


export type UserType = {
    id: string,
    username: string
}

export type MessageType = {
    id: string
    sender: {
        id: string
        username: string
    },
    text: string
}

export type DialogType = {
    id: string | null
    members: Array<UserType>
    lastMessage: MessageType | null
}

export type CurrentDialogType = {
    id: string | null,
    members: Array<UserType>,
    messages: Array<MessageType>
}

const initialState = {
    toSearch: '',
    users: [] as Array<UserType>,
    dialogs: [] as Array<DialogType>,
    currentDialog: null as CurrentDialogType | null
}

export type InitialStateType = typeof initialState

const dialogsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch(action.type) {
        case GET_DIALOGS: 
            return {
                ...state,
                dialogs: [...action.dialogs]
            }
        case SET_CURRENT_DIALOG:
            return {
                ...state,
                currentDialog: {
                    id: action.dialog.id,
                    members: action.dialog.members,
                    messages: [...action.messages]
                }
            }
        case UPDATE_TO_SEARCH:
            return {
                ...state,
                toSearch: action.value
            }
        case  GET_USERS:
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
        default: return state
    }
}

export default dialogsReducer

type ActionsTypes = UpdateToSearchActionType | GetUsersActionType | GetDialogsActionType | SetCurrentDialogActionType

type UpdateToSearchActionType = {
    type: typeof UPDATE_TO_SEARCH
    value: string
}
export const updateToSearch = (value: string): UpdateToSearchActionType => ({ type: UPDATE_TO_SEARCH, value })

type GetUsersActionType = {
    type: typeof GET_USERS
    users: Array<UserType>
}
export const getUsersActionCreator = (users: Array<UserType>): GetUsersActionType => ({ type: GET_USERS, users })

type GetDialogsActionType = {
    type: typeof GET_DIALOGS
    dialogs: Array<DialogType>
}
export const getDialogsActionCreator = (dialogs: Array<DialogType>): GetDialogsActionType => ({ type: GET_DIALOGS, dialogs })

type SetCurrentDialogActionType = {
    type: typeof SET_CURRENT_DIALOG
    dialog: DialogType
    messages: Array<MessageType>
}
export const setCurrentDialogActionCreator = (dialog: DialogType, messages: Array<MessageType>): SetCurrentDialogActionType => (
    { type: SET_CURRENT_DIALOG, dialog, messages }
)

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getUsers = (username: string): ThunkType => {
    return async (dispatch) => {
        try {
            dispatch(updateToSearch(username))
            if (username) {
                let data = await dialogsAPI.getUsers(username.toLowerCase())
                dispatch(getUsersActionCreator(data.users))
            } else dispatch(getUsersActionCreator([]))
        } catch (error) {
            console.log(error)
        }
    }
}

export const getDialogs = (): ThunkType => {
    return async (dispatch) => {
        try {
            let data = await dialogsAPI.getDialogs()
            dispatch(getDialogsActionCreator(data.conversations))
        } catch (error) {
            console.log(error)
        }
    }
}

export const setCurrentDialog = (dialog: DialogType): ThunkType => {
    return async (dispatch) => {
        try {
            let data = await dialogsAPI.getMessages(dialog.id)
            dispatch(setCurrentDialogActionCreator(dialog, data.messages))
        } catch (error) {
            console.log(error)
        }
    }
}