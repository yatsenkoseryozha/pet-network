import { mainInstance } from '../mainAPI'
import { DialogType, MessageType, UserType } from '../../redux/reducers/Sidebar/DialogsReducer'

type GetDialogsAPIType = {
    conversations: Array<DialogType>
}

type GetMessagesAPIType = {
    messages: Array<MessageType>
}

type GetUsersAPIType = {
    users: Array<UserType>
}

export const dialogsAPI = {
    getDialogs: async () => {
        return mainInstance.get<GetDialogsAPIType>('get-conversations')
            .then(response => response.data)
    },
    getMessages: async (conversation: string | null) => {
        return mainInstance.get<GetMessagesAPIType>('get-messages', {
            headers: {
                conversation: conversation
            }
        }).then(response => response.data)
    },
    getUsers: async (username: string) => {
        return mainInstance.get<GetUsersAPIType>('get-users', {
            headers: {
                username: username
            }
        }).then(response => response.data)
    }
}