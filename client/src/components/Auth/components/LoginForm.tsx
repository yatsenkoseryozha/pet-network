import React from 'react'
import style from '../Auth.module.css'

type PropsType = {
    username: string
    password: string
    changeCurrentForm: () => void
    updateUsername: (value: string) => void
    updatePassword: (value: string) => void
    login: (username: string, password: string) => void
}

const LoginForm: React.FC<PropsType> = ({ username, password, ...props }) => {
    return (
        <div className={style.form}>
            <input type='text' placeholder='Логин' value={username} 
                onChange={ e => props.updateUsername(e.currentTarget.value) } />
            <input type='password' placeholder='Пароль' value={password} 
                onChange={ e => props.updatePassword(e.currentTarget.value) } />
            <div className={style.buttons}>
                <div>
                    <div className={style.authLink} onClick={props.changeCurrentForm}>Нет аккаунта?</div>
                </div>
                <input type='submit' value='Войти' className={style.authButton} 
                    onClick={ () => props.login(username, password) } />
            </div>
        </div>
    )
}

export default LoginForm