import * as axios from 'axios'

const mainInstance = axios.create({
    baseURL: 'http://localhost:5000/',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
})

export const mainAPI = {
    sendMessage(conversation, text) {
        return mainInstance.post('send-message', {conversation, text}).then(response => {
            return response.data
        })
    }
}