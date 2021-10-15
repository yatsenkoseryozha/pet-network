import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { LoginFormDataType } from '../Auth'
import style from '../Auth.module.css'

type PropsType = {
    isFetching: boolean
    changeCurrentForm: () => void
}

const LoginForm: React.FC<InjectedFormProps<LoginFormDataType, PropsType> & PropsType> = ({ isFetching, ...props }) => {
    return (
        <form className={style.form} onSubmit={props.handleSubmit}>
            <Field placeholder='Логин' name='username' component='input' />
            <Field placeholder='Пароль' name='password' type='password' component='input' />
            <div className={style.buttons}>
                <div className={style.authLink} onClick={props.changeCurrentForm}>Нет аккаунта?</div>
                <button className={style.authButton} type="submit" disabled={isFetching ? true : false} >Войти</button>
            </div>
        </form>
    )
}

export default reduxForm<LoginFormDataType, PropsType>({
    form: 'login'
})(LoginForm)
  