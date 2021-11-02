import { mainInstance } from './mainAPI'
import { DialogType, UserType } from '../redux/reducers/SidebarReducer'

type GetDialogsAPIType = {
    conversations: Array<DialogType>
}

type GetUsersAPIType = {
    users: Array<UserType>
}

type CreateDialogAPIType = {
    conversation: DialogType
}

type ChangePasswordAPIType = {
    message: string
}

export const sidebarAPI = {
    getDialogs: async () => {
        return mainInstance.get<GetDialogsAPIType>('get-conversations')
            .then(response => response.data)
    },
    getUsers: async (username: string) => {
        return mainInstance.get<GetUsersAPIType>('get-users', {
            headers: {
                username: username
            }
        }).then(response => response.data)
    },
    createDialog: async (members: Array<UserType>) => {
        return mainInstance.post<CreateDialogAPIType>('create-conversation', { members })
            .then(response => response.data.conversation)
    },
    changePassword: async (currentPassword: string, newPassword: string) => {
        return mainInstance.post<ChangePasswordAPIType>('change-password', {currentPassword, newPassword })
            .then(response => response.data)
    }
}