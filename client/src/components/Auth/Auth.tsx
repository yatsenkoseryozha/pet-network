import React, { useState } from 'react'
import LoginForm from './components/LoginForm'
import RegistrationForm from './components/RegistrationForm'
import style from './Auth.module.css'

type PropsType = {
    username: string
    email: string
    password: string
    registrationMessage: string
    updateUsername: (value: string) => void
    updateEmail: (value: string) => void
    updatePassword: (value: string) => void
    registration: (username: string, email: string) => void
    login: (username: string, password: string) => void
}

const Auth: React.FC<PropsType> = (props) => {
    const LOGIN = 'LOGIN'
    const REGISTRATION = 'REGISTRATION'

    const [currentForm, changeCurrentForm] = useState(LOGIN)

    return (
        <div className={style.container}>        
            {
                (currentForm === LOGIN) ?
                    <LoginForm {...props} changeCurrentForm={ () => changeCurrentForm(REGISTRATION) } /> :
                (currentForm === REGISTRATION) ?
                    <RegistrationForm {...props} changeCurrentForm={ () => changeCurrentForm(LOGIN) } /> :
                null
            }
            <div className={style.registrationMessage}>
                {props.registrationMessage}
            </div>
        </div>
    )
}

export default Auth