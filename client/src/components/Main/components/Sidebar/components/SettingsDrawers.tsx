import React, { useState } from 'react'
import { Input, Button, Menu, Drawer, Form, Alert } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { SidebarNotificationType } from '../../../../../redux/reducers/SidebarReducer'

const { SubMenu } = Menu

const PasswordChangeDrawer: React.FC<{
    isFetching: boolean
    userPasswordDrawerVisible: boolean
    notification: SidebarNotificationType | null
    changePassword: (currentPassword: string, newPassword: string, callback: any) => void
    updateNotification: (notification: SidebarNotificationType | null) => void
    onClose: () => void
}> = ({
    isFetching,
    userPasswordDrawerVisible,
    notification,
    ...props
}) => {
        const [passwordChangeForm] = Form.useForm()

        return (
            <Drawer
                title="Смена пароля"
                placement='left'
                width={310}
                visible={userPasswordDrawerVisible}
                onClose={() => {
                    passwordChangeForm.resetFields()
                    props.onClose()
                }}
            >
                <Form
                    form={passwordChangeForm}
                    name='passwordChange'
                    onFinish={(values: {
                        currentPassword: string
                        newPassword: string
                    }) => {
                        props.changePassword(values.currentPassword, values.newPassword, passwordChangeForm.resetFields)
                    }}
                >
                    <Form.Item
                        name='currentPassword'
                        validateStatus={notification?.code === 99 ? '' : notification?.type}
                        rules={[
                            {
                                required: true,
                                message: "Обязательное поле!"
                            }
                        ]}
                    >
                        <Input
                            placeholder="Текущий пароль"
                            type='password'
                            allowClear
                            onChange={() => notification && props.updateNotification(null)}
                        />
                    </Form.Item>
                    <Form.Item
                        name='newPassword'
                        validateStatus={notification?.code === 99 ? '' : notification?.type}
                        rules={[
                            {
                                required: true,
                                message: "Обязательное поле!"
                            }
                        ]}
                    >
                        <Input
                            placeholder="Новый пароль"
                            type='password'
                            allowClear
                            onChange={() => notification && props.updateNotification(null)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button 
                            type='primary' 
                            htmlType='submit' 
                            loading={isFetching}
                            style={{
                                width: '100%'
                            }}
                        >
                            Подтвердить
                        </Button>
                    </Form.Item>
                </Form>
                {
                    notification && <Alert
                        type={notification.type}
                        message={notification.message}
                        showIcon
                    />
                }
            </Drawer>
        )
    }

const SettingsDrawer: React.FC<{
    isFetching: boolean
    settingsDrawerVisible: boolean
    notification: SidebarNotificationType | null
    updateNotification: (notification: SidebarNotificationType | null) => void
    changeSettingsDrawerVisible: (value: boolean) => void
    changePassword: (currentPassword: string, newPassword: string, callback: any) => void
}> = ({
    isFetching,
    settingsDrawerVisible,
    notification,
    ...props
}) => {
    const [openKeys, setOpenKeys] = useState('')
    const [selectedKeys, setSelectedKeys] = useState('')

    const [userPasswordDrawerVisible, changeUserPasswordDrawerVisible] = useState(false)

        return (
            <>
                <Drawer
                    title='Настройки'
                    placement='left'
                    width={370}
                    bodyStyle={{ padding: '0px' }}
                    visible={settingsDrawerVisible}
                    onClose={() => {
                        setOpenKeys('')
                        setSelectedKeys('')
                        props.changeSettingsDrawerVisible(false)
                    }}
                >
                    <Menu
                        mode='inline'
                        selectedKeys={[selectedKeys]}
                        openKeys={[openKeys]}
                        style={{ width: '100%' }}
                    >
                        <SubMenu
                            title="Настройки профиля"
                            key='userSettings'
                            icon={<UserOutlined />}
                            onTitleClick={() => setOpenKeys('userSettings')}
                        >
                            <Menu.Item
                                key='passwordChange'
                                onClick={() => {
                                    setSelectedKeys('passwordChange')
                                    changeUserPasswordDrawerVisible(true)
                                }}
                            >
                                Сменить пароль
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                    <PasswordChangeDrawer
                        isFetching={isFetching}
                        userPasswordDrawerVisible={userPasswordDrawerVisible}
                        changePassword={props.changePassword}
                        notification={notification}
                        updateNotification={props.updateNotification}
                        onClose={() => {
                            props.updateNotification(null)
                            changeUserPasswordDrawerVisible(false)
                        }}
                    />
                </Drawer>
            </>
        )
    }

export default SettingsDrawer