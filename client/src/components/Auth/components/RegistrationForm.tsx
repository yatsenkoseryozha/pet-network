import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import { UserOutlined, MailOutlined } from '@ant-design/icons'
import style from '../Auth.module.css'
import { AuthNotificationType } from '../../../redux/reducers/AuthReducer'

const RegistrationForm: React.FC<{
    isFetching: boolean
    notification: AuthNotificationType | null
    registration: (username: string, email: string) => void
    updateNotification: (notification: AuthNotificationType | null) => void
}> = ({
    isFetching,
    notification,
    updateNotification,
    ...props
}) => {
        useEffect(() => () => updateNotification(null), [updateNotification])

        const onFinish = (values: any) => props.registration(values.username, values.email)

        return (
            <Form name='registration' className={style.form} onFinish={onFinish}>
                <Form.Item
                    name='username'
                    hasFeedback={notification && notification?.code !== 0 ? true : false}
                    validateStatus={
                        notification?.code === 99 || notification?.code === 2 ? '' : notification?.type
                    }
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
                    name='email'
                    hasFeedback={notification && notification?.code !== 0 ? true : false}
                    validateStatus={
                        notification?.code === 99 || notification?.code === 1 ? '' : notification?.type
                    }
                    rules={[
                        {
                            required: true,
                            message: "Обязательное поле"
                        },
                        {
                            type: 'email',
                            message: "Неккорректный адрес"
                        }
                    ]}
                >
                    <Input
                        placeholder="Почта"
                        prefix={<MailOutlined />}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type='primary'
                        htmlType='submit'
                        className={style.formButton}
                        disabled={isFetching}
                    >
                        Создать
                    </Button>
                    <Link to='/login'>Есть аккаунт?</Link>
                </Form.Item>
            </Form>
        )
    }

export default RegistrationForm