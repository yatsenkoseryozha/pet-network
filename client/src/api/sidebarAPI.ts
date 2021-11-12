import { mainInstance } from './mainAPI'
import { DialogType, UserType } from '../redux/reducers/SidebarReducer'
import { ERROR, SUCCESS } from '../redux/reducers/AuthReducer'

type GetUsersAPIType = {
    type: typeof ERROR | typeof SUCCESS
    code: 0 | 41 | 99
    message: string
    users: Array<UserType>
}

type CreateDialogAPIType = {
    type: typeof ERROR | typeof SUCCESS
    code: 0 | 41 | 99
    message: string
    conversation: DialogType
}

type GetDialogsAPIType = {
    type: typeof ERROR | typeof SUCCESS
    code: 0 | 41 | 99
    message: string
    conversations: Array<DialogType>
}

type ChangePasswordAPIType = {
    type: typeof SUCCESS | typeof ERROR
    code: 0 | 1 | 41 | 99
    message: string
}

export const sidebarAPI = {
    getUsers: async (username: string) => {
        return mainInstance.post<GetUsersAPIType>('get-users', { username })
            .then(response => response.data)
    },
    createDialog: async (members: Array<UserType>) => {
        return mainInstance.post<CreateDialogAPIType>('create-conversation', { members })
            .then(response => response.data.conversation)
    },
    getDialogs: async () => {
        return mainInstance.get<GetDialogsAPIType>('get-conversations')
            .then(response => response.data)
    },
    changePassword: async (currentPassword: string, newPassword: string) => {
        return mainInstance.post<ChangePasswordAPIType>('change-password', {currentPassword, newPassword })
            .then(response => response.data)
    }
}