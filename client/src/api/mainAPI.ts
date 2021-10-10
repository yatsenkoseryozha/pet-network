import axios from 'axios'
import { CurrentDialogType } from '../redux/reducers/Sidebar/DialogsReducer'

const mainInstance = axios.create({
    baseURL: 'http://localhost:5000/',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
})

type SendMessageAPIType = {
    message: string
}

export const mainAPI = {
    sendMessage: async (conversation: CurrentDialogType, text: string) => {
        return mainInstance.post<SendMessageAPIType>('send-message', {conversation, text})
    }
}