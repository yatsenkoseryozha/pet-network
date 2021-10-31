import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Button, notification } from 'antd'
import { UserOutlined, MailOutlined } from '@ant-design/icons'
import style from '../Auth.module.css'

type PropsType = {
    isFetching: boolean
    registrationMessage: string
    registration: (username: string, email: string) => void
}

const RegistrationForm: React.FC<PropsType> = ({ isFetching, registrationMessage, ...props }) => {    

    useEffect(() => {
        !isFetching && registrationMessage && notification.info({
            message: registrationMessage,
            placement: 'bottomRight',
        })
    })

    const onFinish = (values: any) => props.registration(values.username, values.email)

    return (
        <Form name='registration' className={style.form} onFinish={onFinish}>
            <Form.Item name='username' rules={[{ required: true, message: 'Поле является обязательным!' }]}>
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Имя пользователя" />
            </Form.Item>
            <Form.Item name='email' rules={[{ required: true, message: "Поле является обязательным!" }]}>
                <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder='Почта' />
            </Form.Item>
            <Form.Item>
                <Button type='primary' htmlType='submit' className={style.formButton} disabled={isFetching ? true : false}>Создать</Button>
                <Link to='/login'>Есть аккаунт?</Link>
            </Form.Item>
        </Form>
    )
}

export default RegistrationForm