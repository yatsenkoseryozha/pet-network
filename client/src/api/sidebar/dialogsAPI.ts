import { mainInstance } from '../mainAPI'
import { DialogType, UserType } from '../../redux/reducers/Sidebar/DialogsReducer'

type GetUsersAPIType = {
    users: Array<UserType>
}

type CreateDialogAPIType = {
    conversation: DialogType
}

type GetDialogsAPIType = {
    conversations: Array<DialogType>
}

export const dialogsAPI = {
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
    getDialogs: async () => {
        return mainInstance.get<GetDialogsAPIType>('get-conversations')
            .then(response => response.data)
    }
}