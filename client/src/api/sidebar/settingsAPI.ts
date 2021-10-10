import axios from 'axios'

const mainInstance = axios.create({
    baseURL: 'http://localhost:5000/',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
})

type ChangePasswordAPIType = {
    message: string
}

export const settingsAPI = {
    changePassword: async (currentPassword: string, newPassword: string) => {
        return mainInstance.post<ChangePasswordAPIType>('change-password', {currentPassword, newPassword })
            .then(response => response.data)
    }
}