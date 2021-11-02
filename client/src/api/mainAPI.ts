import axios from 'axios'
import { MessageType } from '../redux/reducers/MainReducer'
import { DialogType } from '../redux/reducers/SidebarReducer'

export const mainInstance = axios.create({
    baseURL: 'http://localhost:5000/'
})

type GetMessagesAPIType = {
    messages: Array<MessageType>
}

type SendMessageAPIType = {
    message: string
}

export const mainAPI = {
    getMessages: async (conversation: string | null) => {
        return mainInstance.get<GetMessagesAPIType>('get-messages', {
            headers: {
                conversation: conversation
            }
        }).then(response => response.data)
    },
    sendMessage: async (conversation: DialogType, text: string) => {
        return mainInstance.post<SendMessageAPIType>('send-message', {conversation, text})
    }
}