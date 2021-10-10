import React from 'react'
import style from '../Auth.module.css'

type PropsType = {
    username: string
    email: string
    changeCurrentForm: () => void
    updateUsername: (value: string) => void
    updateEmail: (value: string) => void
    registration: (username: string, email: string) => void
}

const RegistrationForm: React.FC<PropsType> = ({ username, email, ...props }) => {
    return (
        <div className={style.form}>
            <input type='text' placeholder='Логин' value={username} 
                onChange={ e => props.updateUsername(e.currentTarget.value) } />
            <input type='text' placeholder='Почта' value={email} 
                onChange={ e => props.updateEmail(e.currentTarget.value) } />
            <div className={style.buttons}>
                <div>
                    <div className={style.authLink} onClick={props.changeCurrentForm}>Есть аккаунт?</div>
                </div>
                <input type='submit' value='Создать' className={style.authButton} 
                    onClick={async () => {
                        props.registration(username, email)
                        props.changeCurrentForm()    
                    }} />
            </div>
        </div>
    )
}

export default RegistrationForm