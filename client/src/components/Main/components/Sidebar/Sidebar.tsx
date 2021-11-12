import React, { useState } from 'react'
import { Input, Dropdown, Button, Menu, Typography, List, Avatar, Empty } from 'antd'
import { MenuOutlined, SettingOutlined, LogoutOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons'
import SearchResults from './components/SearchResults'
import SettingsDrawer from './components/SettingsDrawers'
import style from './Sidebar.module.css'
import { DialogType, UserType, SidebarNotificationType } from '../../../../redux/reducers/SidebarReducer'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'

const { Text } = Typography

type SearchPropsType = {
    getUsers: (username: string) => void
}

type SearchFormDataType = {
    toSearch: string
}

class SearchForm extends React.Component<InjectedFormProps<SearchFormDataType, SearchPropsType> & SearchPropsType, {}> {
    renderField(props: any) {
        return (
            <Input
                {...props.input}
                placeholder="Кого будем искать?"
                prefix={<SearchOutlined style={{ color: 'rgba(112,117,121,0.8)' }} />}
                size='large'
                allowClear
                style={{
                    borderRadius: '24px',
                    lineHeight: '26px'
                }}
            />
        )
    }

    render() {
        return (
            <form className={style.searchForm} onSubmit={this.props.handleSubmit} >
                <Field 
                    name='toSearch' 
                    component={this.renderField} 
                    onChange={(_, value: string) => this.props.getUsers(value)}
                />
            </form>
        )
    }
}

const SearchReduxForm = reduxForm<SearchFormDataType, SearchPropsType>({
    form: 'search'
})(SearchForm)

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
                style={{
                    padding: '15px',
                    backgroundColor: `${dialog._id !== currentDialog?._id ? '' : '#F5F5F5'}`
                }}
            >
                <List.Item.Meta
                    avatar={<Avatar size={54} icon={<UserOutlined />} />}
                    title={
                        <div className={style.title}>
                            {receiver?.username}
                        </div>
                    }
                    description={
                        <div className={style.description}>
                            {
                                dialog.lastMessage?.sender._id === receiver?._id ?
                                    dialog.lastMessage?.text : <span><b>You:</b> {dialog.lastMessage?.text}</span>
                            }
                        </div>
                    }
                />
            </List.Item>
        )
    }

const Sidebar: React.FC<{
    currentUser: UserType | null
    toSearch: string
    isFetching: boolean
    users: Array<UserType>
    dialogs: Array<DialogType>
    currentDialog: DialogType | null
    notification: SidebarNotificationType | null
    updateNotification: (notification: SidebarNotificationType | null) => void
    getUsers: (username: string) => void
    setCurrentDialog: (dialog: DialogType) => void
    getMessages: (dialog: DialogType) => void
    changePassword: (currentPassword: string, newPassword: string, callback: any) => void
    logout: () => void
}> = ({
    currentUser,
    toSearch,
    isFetching,
    users,
    dialogs,
    currentDialog,
    notification,
    ...props
}) => {
        const [settingsDrawerVisible, changeSettingsDrawerVisible] = useState(false)

        const DropdownMenu = (
            <Menu>
                <Menu.Item key='settings' onClick={() => changeSettingsDrawerVisible(true)}>
                    <Text>
                        <SettingOutlined /> Настройки
                    </Text>
                </Menu.Item>
                <Menu.Item key='logout' onClick={props.logout}>
                    <Text type='danger'>
                        <LogoutOutlined /> Выйти
                    </Text>
                </Menu.Item>
            </Menu>
        )

        return (
            <>
                <div className={style.searchContainer}>
                    <Dropdown overlay={DropdownMenu} placement="bottomRight" trigger={['click']}>
                        <Button
                            size='large'
                            shape='circle'
                            icon={
                                <MenuOutlined
                                    style={{
                                        fontSize: '18px',
                                        color: 'rgba(112,117,121,0.8)'
                                    }}
                                />
                            }
                            style={{
                                border: 'none',
                                marginRight: '18px',
                                boxShadow: 'none'
                            }}
                        />
                    </Dropdown>
                    <SearchReduxForm getUsers={props.getUsers} />
                </div>
                {
                    toSearch ?
                        <SearchResults
                            currentUser={currentUser}
                            toSearch={toSearch}
                            isFetching={isFetching}
                            users={users}
                            dialogs={dialogs}
                            setCurrentDialog={props.setCurrentDialog}
                            currentDialog={currentDialog}
                        /> : (
                            dialogs.length > 0 ? (
                                <List
                                    dataSource={dialogs}
                                    renderItem={item => {
                                        let receiver = item.members.find((member: UserType) => member.username !== currentUser?.username)
                                        if (item.members.find(member => member._id === receiver?._id))
                                            return <DialogsListItem
                                                dialog={item}
                                                setCurrentDialog={() => props.setCurrentDialog(item)}
                                                currentDialog={currentDialog}
                                                receiver={receiver}
                                            />
                                    }}
                                />
                            ) : (
                                <div className={style.feedbackContainer}>
                                    <Empty description={false} />
                                </div>
                            )
                        )
                }
                <SettingsDrawer
                    isFetching={isFetching}
                    settingsDrawerVisible={settingsDrawerVisible}
                    changeSettingsDrawerVisible={changeSettingsDrawerVisible}
                    changePassword={props.changePassword}
                    notification={notification}
                    updateNotification={props.updateNotification}
                />
            </>
        )
    }

export default Sidebar