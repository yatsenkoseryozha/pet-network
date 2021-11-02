import React, { useState } from 'react'
import { Input, Dropdown, Button, Menu, Typography, List, Avatar } from 'antd'
import { MenuOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'
import SearchResults from './components/SearchResults'
import SettingsDrawer from './components/SettingsDrawers'
import style from './Sidebar.module.css'
import { DialogType, UserType } from '../../../../redux/reducers/SidebarReducer'

const { Text } = Typography

export const DialogsListItem: React.FC<{
    dialog: DialogType
    currentDialog: DialogType | null
    receiver: UserType | undefined
    setCurrentDialog: () => void
}> = ({
    dialog,
    currentDialog,
    receiver,
    ...props
}) => {
        return (
            <List.Item
                onClick={props.setCurrentDialog}
                className={style.dialog}
                style={dialog._id !== currentDialog?._id ? { padding: '15px' } : { padding: '15px', backgroundColor: '#F5F5F5' }}
            >
                <List.Item.Meta
                    avatar={<Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{receiver?.username[0].toUpperCase()}</Avatar>}
                    title={receiver?.username}
                    description={dialog.lastMessage?.sender._id === receiver?._id ? dialog.lastMessage?.text : <span><b>You:</b> {dialog.lastMessage?.text}</span>}
                />
            </List.Item>
        )
    }

const Sidebar: React.FC<{
    currentUser: UserType | null
    isFetching: boolean
    users: Array<UserType>
    dialogs: Array<DialogType>
    currentDialog: DialogType | null
    passwordChangeMessage: string
    getUsers: (username: string) => void
    setCurrentDialog: (dialog: DialogType) => void
    getMessages: (dialog: DialogType) => void
    changePassword: (currentPassword: string, newPassword: string) => void
    updatePasswordChangeMessage: (value: string) => void
    logout: () => void
}> = ({
    currentUser,
    isFetching,
    users,
    dialogs,
    currentDialog,
    passwordChangeMessage,
    ...props
}) => {
        const DropdownMenu = (
            <Menu>
                <Menu.Item key='settings' onClick={() => changeSettingsDrawerVisible(true)}>
                    <Text>
                        <SettingOutlined /> Настройки
                    </Text>
                </Menu.Item>
                <Menu.Item key='logout' onClick={props.logout}>
                    <Text type="danger">
                        <LogoutOutlined /> Выйти
                    </Text>
                </Menu.Item>
            </Menu>
        )

        const [settingsDrawerVisible, changeSettingsDrawerVisible] = useState(false)

        const [toSearch, updateToSearch] = useState('')

        const setCurrentDialog = (dialog: DialogType) => {
            props.setCurrentDialog(dialog)
            props.getMessages(dialog)
        }

        return (
            <>
                <div className={style.searchContainer}>
                    <Dropdown overlay={DropdownMenu} placement="bottomRight" trigger={['click']}>
                        <Button
                            style={{
                                border: 'none',
                                borderRadius: '50%',
                                padding: '4px 9px',
                                marginRight: '4px',
                                boxShadow: 'none'
                            }}
                        >
                            <MenuOutlined />
                        </Button>
                    </Dropdown>
                    <Input
                        placeholder="Кого будем искать?"
                        allowClear
                        style={{ borderRadius: '24px' }}
                        onChange={(event) => {
                            updateToSearch(event.currentTarget.value)
                            props.getUsers(event.currentTarget.value)
                        }}
                    />
                </div>
                {
                    toSearch ?
                        <SearchResults
                            isFetching={isFetching}
                            dialogs={dialogs}
                            setCurrentDialog={setCurrentDialog}
                            currentDialog={currentDialog}
                            toSearch={toSearch}
                            users={users}
                            currentUser={currentUser}
                        /> : <List
                            dataSource={dialogs}
                            renderItem={item => {
                                let receiver = item.members.find((member: UserType) => member.username !== currentUser?.username)
                                if (item.members.find(member => member._id === receiver?._id))
                                    return <DialogsListItem
                                        dialog={item}
                                        setCurrentDialog={() => setCurrentDialog(item)}
                                        currentDialog={currentDialog}
                                        receiver={receiver}
                                    />
                            }}
                        />
                }
                <SettingsDrawer
                    isFetching={isFetching}
                    settingsDrawerVisible={settingsDrawerVisible}
                    changeSettingsDrawerVisible={changeSettingsDrawerVisible}
                    changePassword={props.changePassword}
                    passwordChangeMessage={passwordChangeMessage}
                    updatePasswordChangeMessage={props.updatePasswordChangeMessage}
                />
            </>
        )
    }

export default Sidebar