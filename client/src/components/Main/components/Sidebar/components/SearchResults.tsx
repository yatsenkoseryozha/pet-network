import React from 'react'
import { DialogType, UserType } from '../../../../../redux/reducers/SidebarReducer'
import style from '../Sidebar.module.css'
import { List, Avatar, Divider, Empty } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { DialogsListItem } from '../Sidebar'

const SearchResults: React.FC<{
    currentUser: UserType | null
    toSearch: string
    isFetching: boolean
    users: Array<UserType>
    dialogs: Array<DialogType>
    currentDialog: DialogType | null
    setCurrentDialog: (dialog: DialogType) => void
}> = ({
    currentUser,
    toSearch,
    isFetching,
    users,
    dialogs,
    currentDialog,
    ...props
}) => {
        let filteredDialogs: Array<DialogType> = []
        dialogs.map(dialog => {
            if (dialog.members.find(member => member._id !== currentUser?._id && member.username.toLowerCase().indexOf(toSearch.toLowerCase()) === 0))
                filteredDialogs.push(dialog)
        })

        let filteredUsers: Array<UserType> = []
        users.map(user => {
            if (!dialogs.find(dialog => dialog.members.find(member => member._id === user._id)))
                filteredUsers.push(user)
        })

        return (
            <>
                {
                    filteredDialogs.length > 0 && <>
                        <Divider orientation="left">ДИАЛОГИ</Divider>
                        <List
                            dataSource={filteredDialogs}
                            renderItem={dialog => {
                                return <DialogsListItem
                                    dialog={dialog}
                                    setCurrentDialog={() => props.setCurrentDialog(dialog)}
                                    currentDialog={currentDialog}
                                    receiver={dialog.members.find((member: UserType) => member.username !== currentUser?.username)}
                                />
                            }}
                        />
                    </>
                }
                {
                    filteredUsers.length > 0 && <>
                        <Divider orientation="left">ПОЛЬЗОВАТЕЛИ</Divider>
                        <List
                            dataSource={filteredUsers}
                            renderItem={user => {
                                return (
                                    <List.Item
                                        className={style.dialog}
                                        style={{ padding: '15px' }}
                                        onClick={() => props.setCurrentDialog({
                                            _id: null,
                                            members: [user, currentUser as UserType],
                                            lastMessage: null
                                        })}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar size={54} icon={<UserOutlined />} />}
                                            title={
                                                <div className={style.title}>
                                                    {user.username}
                                                </div>
                                            }
                                            description={
                                                <div className={style.description}>
                                                    last seen recently
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )
                            }}
                        />
                    </>
                }
                {
                    filteredDialogs.length === 0 && filteredUsers.length === 0 && (
                        <div className={style.feedbackContainer}>
                            <Empty description={false} />
                        </div>
                    )
                }
            </>
        )
    }

export default SearchResults