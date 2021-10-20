import { mainInstance } from '../mainAPI'

type ChangePasswordAPIType = {
    message: string
}

export const settingsAPI = {
    changePassword: async (currentPassword: string, newPassword: string) => {
        return mainInstance.post<ChangePasswordAPIType>('change-password', {currentPassword, newPassword })
            .then(response => response.data)
    }
}