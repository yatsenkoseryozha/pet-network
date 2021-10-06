import React from 'react'
import style from '../Auth.module.css'

const LoginForm = (props) => {
    return (
        <div className={style.form}>
            <input type='text' placeholder='Логин' value={props.creditionals.username} 
                onChange={ e => props.updateUsername(e.currentTarget.value) } />
            <input type='password' placeholder='Пароль' value={props.creditionals.password} 
                onChange={ e => props.updatePassword(e.currentTarget.value) } />
            <div className={style.buttons}>
                <div>
                    <div className={style.authLink} onClick={ () => props.setCurrentForm(props.registration) }>Нет аккаунта?</div>
                </div>
                <input type='submit' value='Войти' className={style.authButton} onClick={props.login} />
            </div>
        </div>
    )
}

export default LoginForm