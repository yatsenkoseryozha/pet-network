import * as axios from 'axios'

const dialogsInstance = axios.create({
    baseURL: 'http://localhost:5000/',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
})

export const dialogsAPI = {
    getDialogs() {
        return dialogsInstance.get('get-conversations').then(response => {
            return response.data
        })
    },
    getMessages(conversation) {
        return dialogsInstance.get('get-messages', {
            headers: {
                conversation: conversation
            }
        }).then(response => {
            return response.data
        })
    },
    getUsers(username) {
        return dialogsInstance.get('get-users', {
            headers: {
                username: username
            }
        }).then((response => {
            return response.data
        }))
    }
}