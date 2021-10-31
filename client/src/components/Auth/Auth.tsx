import React from 'react'
import { Route } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import RegistrationForm from './components/RegistrationForm'
import style from './Auth.module.css'

type PropsType = {
    isFetching: boolean
    registrationMessage: string
    registration: (username: string, email: string) => void
    login: (username: string, password: string) => void
}

const Auth: React.FC<PropsType> = (props) => {
    return (
        <div className={style.container}>
            <Route exact path="/login">
                <LoginForm isFetching={props.isFetching} login={props.login} />
            </Route>
            <Route exact path="/registration">
                <RegistrationForm isFetching={props.isFetching} registration={props.registration}
                    registrationMessage={props.registrationMessage} />
            </Route>
        </div>
    )
}

export default Auth