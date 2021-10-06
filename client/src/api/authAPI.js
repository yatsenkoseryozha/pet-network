import * as axios from 'axios'

const authInstace = axios.create({
    baseURL: 'http://localhost:5000/auth/'
})

export const authAPI = {
    registration(username, email) {
        return authInstace.post('registration', { username, email }).then(response => {
            return response.data
        })
    },
    login(username, password) {
        return authInstace.post('login', { username, password }).then(response => {
            return response.data
        })
    },
    auth(token) {
        return authInstace.get('/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            return response.data
        })
    }
}