import React, { useState } from 'react'
import LoginForm from './components/LoginForm'
import RegistrationForm from './components/RegistrationForm'
import style from './Auth.module.css'

const Auth = (props) => {
    const LOGIN = 'LOGIN'
    const REGISTRATION = 'REGISTRATION'

    const [currentForm, setCurrentForm] = useState(LOGIN)

    return (
        <div className={style.container}>        
            {
                (currentForm === LOGIN) ?
                    <LoginForm {...props} setCurrentForm={setCurrentForm} registration={REGISTRATION} /> :
                (currentForm === REGISTRATION) ?
                    <RegistrationForm {...props} setCurrentForm={setCurrentForm} login={LOGIN} /> :
                null
            }
        </div>
    )
}

export default Auth