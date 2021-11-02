import React, { useState } from 'react'
import { Input, Button, Menu, Drawer, Form, Alert } from 'antd'
import { UserOutlined } from '@ant-design/icons'

const { SubMenu } = Menu

const PasswordChangeDrawer: React.FC<{
    isFetching: boolean
    userPasswordDrawerVisible: boolean
    passwordChangeMessage: string
    onClose: () => void
    changePassword: (currentPassword: string, newPassword: string) => void
    updatePasswordChangeMessage: (value: string) => void
}> = ({
    isFetching,
    userPasswordDrawerVisible,
    passwordChangeMessage,
    ...props
}) => {
        return (
            <Drawer
                title="Смена пароля"
                placement='left'
                width={370}
                onClose={props.onClose}
                visible={userPasswordDrawerVisible}
                style={{ position: 'absolute' }}
            >
                <Form
                    name='passwordChange'
                    initialValues={{ remember: true }}
                    onFinish={(values: {
                        currentPassword: string
                        newPassword: string
                    }) => {
                        props.changePassword(values.currentPassword, values.newPassword)
                    }}
                    autoComplete='off'
                >
                    <Form.Item name='currentPassword' rules={[{ required: true, message: "Обязательное поле!" }]}>
                        <Input.Password placeholder="Текущий пароль" />
                    </Form.Item>

                    <Form.Item name='newPassword' rules={[{ required: true, message: "Обязательное поле!" }]}>
                        <Input.Password placeholder="Новый пароль" />
                    </Form.Item>

                    <Form.Item>
                        <Button type='primary' htmlType='submit' loading={isFetching ? true : false}>
                            Подтвердить
                        </Button>
                    </Form.Item>
                </Form>
                {
                    passwordChangeMessage && <Alert 
                        type="success" 
                        closable 
                        message={passwordChangeMessage}
                        onClose={() => props.updatePasswordChangeMessage('')}
                    />
                }
            </Drawer>
        )
    }

const SettingsDrawer: React.FC<{
    isFetching: boolean
    settingsDrawerVisible: boolean
    passwordChangeMessage: string
    changeSettingsDrawerVisible: (value: boolean) => void
    changePassword: (currentPassword: string, newPassword: string) => void
    updatePasswordChangeMessage: (value: string) => void
}> = ({
    isFetching,
    settingsDrawerVisible,
    passwordChangeMessage,
    ...props
}) => {
        const [userPasswordDrawerVisible, changeUserPasswordDrawerVisible] = useState(false)

        return (
            <>
                <Drawer
                    title='Настройки'
                    placement='left'
                    width={370}
                    bodyStyle={{ padding: '0px' }}
                    visible={settingsDrawerVisible}
                    onClose={() => props.changeSettingsDrawerVisible(false)}
                >
                    <Menu mode='inline' style={{ width: 370 }}>
                        <SubMenu key='userSettings' icon={<UserOutlined />} title="Настройки профиля">
                            <Menu.Item
                                key='passwordChange'
                                onClick={() => {
                                    props.changeSettingsDrawerVisible(false)
                                    changeUserPasswordDrawerVisible(true)
                                }}
                            >
                                Сменить пароль
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </Drawer>
                <PasswordChangeDrawer
                    isFetching={isFetching}
                    userPasswordDrawerVisible={userPasswordDrawerVisible}
                    onClose={() => {
                        changeUserPasswordDrawerVisible(false)
                        props.changeSettingsDrawerVisible(true)
                    }}
                    changePassword={props.changePassword}
                    passwordChangeMessage={passwordChangeMessage}
                    updatePasswordChangeMessage={props.updatePasswordChangeMessage}
                />
            </>
        )
    }

export default SettingsDrawer