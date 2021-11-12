import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import style from '../Auth.module.css'
import { AuthNotificationType } from '../../../redux/reducers/AuthReducer'

const LoginForm: React.FC<{
    isFetching: boolean
    notification: AuthNotificationType | null
    login: (username: string, password: string) => void
    updateNotification: (notification: AuthNotificationType | null) => void
}> = ({
    isFetching,
    notification,
    updateNotification,
    ...props
}) => {
        useEffect(() => () => updateNotification(null), [updateNotification])

        const onFinish = (values: any) => props.login(values.username, values.password)

        return (
            <Form name='login' className={style.form} onFinish={onFinish}>
                <Form.Item
                    name='username'
                    hasFeedback={notification ? true : false}
                    validateStatus={notification?.code === 99 ? '' : notification?.type}
                    rules={[
                        {
                            required: true,
                            message: "Обязательное поле"
                        }
                    ]}
                >
                    <Input
                        placeholder="Имя пользователя"
                        prefix={<UserOutlined />}
                        onChange={() => notification && updateNotification(null)}
                    />
                </Form.Item>
                <Form.Item
                    name='password'
                    hasFeedback={notification ? true : false}
                    validateStatus={notification?.code === 99 ? '' : notification?.type}
                    rules={[
                        {
                            required: true,
                            message: "Обязательное поле"
                        }
                    ]}
                >
                    <Input
                        type='password'
                        placeholder="Пароль"
                        prefix={<LockOutlined />}
                        onChange={() => notification && updateNotification(null)}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type='primary'
                        htmlType='submit'
                        className={style.formButton}
                        disabled={isFetching}
                    >
                        Войти
                    </Button>
                    <Link to='/registration'>Нет аккаунта?</Link>
                </Form.Item>
            </Form>
        )
    }

export default LoginForm
