import * as axios from 'axios'

const mainInstance = axios.create({
    baseURL: 'http://localhost:5000/',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
})

export const settingsAPI = {
    changePassword(currentPassword, newPassword) {
        return mainInstance.post('change-password', {currentPassword, newPassword }).then(response => {
            return response.data
        })
    }
}