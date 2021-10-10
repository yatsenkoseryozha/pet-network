import axios from 'axios'
import { UserType } from '../redux/reducers/Sidebar/DialogsReducer'

const authInstace = axios.create({
    baseURL: 'http://localhost:5000/auth/'
})

type RegistrationAPIType = {
    message: string
}

type LoginAPIType = {
    token: string
}

type AuthAPIType = {
    user: UserType
}

export const authAPI = {
    registration: async (username: string, email: string) => {
        return authInstace.post<RegistrationAPIType>('registration', { username, email })
            .then(response => response.data)
    },
    login: async (username: string, password: string) => {
        return authInstace.post<LoginAPIType>('login', { username, password })
            .then(response => response.data)
    },
    auth: async () => {
        return authInstace.get<AuthAPIType>('/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(response => response.data)
    }
}