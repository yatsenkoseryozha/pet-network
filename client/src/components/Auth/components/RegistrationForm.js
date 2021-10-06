import React from 'react'
import style from '../Auth.module.css'

const RegistrationForm = (props) => {
    return (
        <div className={style.form}>
            <input type='text' placeholder='Логин' value={props.creditionals.username} 
                onChange={ e => props.updateUsername(e.currentTarget.value) } />
            <input type='text' placeholder='Почта' value={props.creditionals.email} 
                onChange={ e => props.updateEmail(e.currentTarget.value) } />
            <div className={style.buttons}>
                <div>
                    <div className={style.authLink} onClick={ () => props.setCurrentForm(props.login) }>Есть аккаунт?</div>
                </div>
                <input type='submit' value='Создать' className={style.authButton} onClick={props.registration} />
            </div>
        </div>
    )
}

export default RegistrationForm