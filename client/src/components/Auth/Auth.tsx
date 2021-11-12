import React, { useEffect } from 'react'
import { Route, useHistory, useLocation } from 'react-router-dom'
import { Space, Typography, notification } from 'antd'
import LoginForm from './components/LoginForm'
import RegistrationForm from './components/RegistrationForm'
import style from './Auth.module.css'
import { AuthNotificationType, SUCCESS } from '../../redux/reducers/AuthReducer'

const { Title } = Typography

const Auth: React.FC<{
    isFetching: boolean
    notification: AuthNotificationType | null
    registration: (username: string, email: string) => void
    login: (username: string, password: string) => void
    updateNotification: (notification: AuthNotificationType | null) => void
}> = ({
    registration,
    login,
    ...props
}) => {
    const history = useHistory()
    const location = useLocation()

    useEffect(() => {
        props.notification && notification[props.notification.type]({
            message: props.notification.message,
            placement: 'bottomRight',
            duration: 3,
            onClose: () => {
                if (location.pathname === '/registration' && props.notification?.type === SUCCESS)
                    history.push('/login')
            }
        })
    }, [props.notification])

    return (
        <div className={style.container}>
            <Route exact path='/login'>
                <Space direction='vertical' align='center'>
                    <Title level={3}>Вход</Title>
                    <LoginForm login={login} {...props} />
                </Space>
            </Route>
            <Route exact path='/registration'>
                <Space direction='vertical' align='center'>
                    <Title level={3}>Регистрация</Title>
                    <RegistrationForm registration={registration} {...props} />
                </Space>
            </Route>
        </div>
    )
}

export default Auth