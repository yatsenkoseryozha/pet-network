import { ThunkAction } from "redux-thunk"
import { dialogsAPI } from "../../../api/sidebar/dialogsAPI"
import { AppStateType } from "../../store"
import { MessageType } from "../MainReducer"

const GET_DIALOGS = 'GET-DIALOGS'
const SET_CURRENT_DIALOG = 'SET-CURRENT-DIALOG'
const UPDATE_TO_SEARCH = 'UPDATE-TO-SEARCH'
const GET_USERS = 'GET-USERS'


export type UserType = {
    _id: string,
    username: string
}

export type DialogType = {
    _id: string | null
    members: Array<UserType>
    lastMessage: MessageType | null
}

const initialState = {
    toSearch: '',
    users: [] as Array<UserType>,
    dialogs: [] as Array<DialogType>,
    currentDialog: null as DialogType | null
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
                currentDialog: {...action.dialog}
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

export type SetCurrentDialogActionType = {
    type: typeof SET_CURRENT_DIALOG
    dialog: DialogType
}
export const setCurrentDialog = (dialog: DialogType): SetCurrentDialogActionType => (
    { type: SET_CURRENT_DIALOG, dialog }
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