import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { RegistrationFormDataType } from '../Auth'
import style from '../Auth.module.css'

type PropsType = {
    isFetching: boolean
    changeCurrentForm: () => void
}

const RegistrationForm: React.FC<InjectedFormProps<RegistrationFormDataType, PropsType> & PropsType> = ({ isFetching, ...props }) => {
    return (
        <form className={style.form} onSubmit={props.handleSubmit}>
            <Field placeholder='Логин' name='username' component='input' />
            <Field placeholder='Почта' name='email' component='input' />
            <div className={style.buttons}>
                <div className={style.authLink} onClick={props.changeCurrentForm}>Есть аккаунт?</div>
                <button className={style.authButton} type="submit" disabled={isFetching ? true : false} >Войти</button>
            </div>
        </form>
    )
}

export default reduxForm<RegistrationFormDataType, PropsType>({
    form: 'registration'
})(RegistrationForm)