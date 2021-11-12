import axios from 'axios'
import { mainInstance } from './mainAPI'
import { SUCCESS, ERROR } from '../redux/reducers/AuthReducer'
import { UserType } from '../redux/reducers/SidebarReducer'

const authInstace = axios.create({
    baseURL: 'http://localhost:5000/auth/'
})

type RegistrationAPIType = {
    type: typeof SUCCESS | typeof ERROR
    code: 0 | 1 | 2 | 99
    message: string
}

type LoginAPIType = {
    type: typeof SUCCESS | typeof ERROR
    code: 0 | 1 | 99
    message: string
    token: string
}

type AuthAPIType = {
    type: typeof SUCCESS | typeof ERROR
    code: 0 | 41 | 99
    message: string
    user: UserType
}

export const authAPI = {
    registration: async (username: string, email: string, password: string) => {
        return authInstace.post<RegistrationAPIType>('registration', { username, email, password })
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
        }).then(response => {
            mainInstance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
            return response.data
        })
    }
}