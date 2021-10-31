import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Button, notification } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import style from '../Auth.module.css'

type PropsType = {
    isFetching: boolean
    login: (username: string, password: string) => void
}

const LoginForm: React.FC<PropsType> = ({ isFetching, ...props }) => {
    const onFinish = (values: any) => props.login(values.username, values.password)

    return (
        <Form name='login' className={style.form} onFinish={onFinish}>
            <Form.Item name='username' rules={[{ required: true, message: 'Поле является обязательным!' }]}>
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Имя пользователя" />
            </Form.Item>
            <Form.Item name='password' rules={[{ required: true, message: "Поле является обязательным!" }]}>
                <Input prefix={<LockOutlined className="site-form-item-icon" />} type='password' placeholder='Пароль' />
            </Form.Item>
            <Form.Item>
                <Button type='primary' htmlType='submit' className={style.formButton} disabled={isFetching ? true : false}>Войти</Button>
                <Link to="/registration">Нет аккаунта?</Link>
            </Form.Item>
        </Form>
    )
}

export default LoginForm
  