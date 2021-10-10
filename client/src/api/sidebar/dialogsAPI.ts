import axios from 'axios'
import { DialogType, MessageType, UserType } from '../../redux/reducers/Sidebar/DialogsReducer'

const dialogsInstance = axios.create({
    baseURL: 'http://localhost:5000/',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
})

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
        return dialogsInstance.get<GetDialogsAPIType>('get-conversations')
            .then(response => response.data)
    },
    getMessages: async (conversation: string | null) => {
        return dialogsInstance.get<GetMessagesAPIType>('get-messages', {
            headers: {
                conversation: conversation
            }
        }).then(response => response.data)
    },
    getUsers: async (username: string) => {
        return dialogsInstance.get<GetUsersAPIType>('get-users', {
            headers: {
                username: username
            }
        }).then(response => response.data)
    }
}