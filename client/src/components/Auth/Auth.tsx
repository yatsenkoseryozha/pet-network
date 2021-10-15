import React, { useState } from 'react'
import LoginForm from './components/LoginForm'
import RegistrationForm from './components/RegistrationForm'
import style from './Auth.module.css'

type PropsType = {
    isFetching: boolean
    registrationMessage: string
    registration: (username: string, email: string) => void
    login: (username: string, password: string) => void
}

export type LoginFormDataType = {
    username: string
    password: string
}

export type RegistrationFormDataType = {
    username: string
    email: string
}

const Auth: React.FC<PropsType> = (props) => {
    const LOGIN = 'LOGIN'
    const REGISTRATION = 'REGISTRATION'

    const [currentForm, changeCurrentForm] = useState(LOGIN)

    const login = (formData: LoginFormDataType) => props.login(formData.username, formData.password)

    const registration = (formData: RegistrationFormDataType) => props.registration(formData.username, formData.email)

    return (
        <div className={style.container}>        
            {
                (currentForm === LOGIN) ?
                    <LoginForm {...props} onSubmit={login} changeCurrentForm={ () => changeCurrentForm(REGISTRATION) } /> :
                (currentForm === REGISTRATION) &&
                    <RegistrationForm {...props} onSubmit={registration} changeCurrentForm={ () => changeCurrentForm(LOGIN) } />
            }
            {
                props.registrationMessage ?
                    <div className={style.registrationMessage}>{props.registrationMessage}</div> : null
            }
        </div>
    )
}

export default Auth