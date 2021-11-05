import React from 'react'
import { Field, InjectedFormProps, reduxForm, reset } from 'redux-form'
import { Input, Layout, PageHeader, Avatar, Button } from 'antd'
import { PaperClipOutlined, UserOutlined } from '@ant-design/icons';
import SidebarContainer from './components/Sidebar/SidebarContainer'
import Messages from './components/Messages'
import style from './Main.module.css'
import { DialogType, UserType } from '../../redux/reducers/SidebarReducer'
import { MessageType } from '../../redux/reducers/MainReducer'

const { Content, Sider } = Layout

type NewMessagePropsType = {
    currentDialog: DialogType | null
}

type NewMessageFormDataType = {
    newMessage: string
}

const NewMessageForm: React.FC<InjectedFormProps<NewMessageFormDataType, NewMessagePropsType> & NewMessagePropsType> = ({
    currentDialog,
    ...props
}) => {
    return (
        <form className={style.newMessageForm} onSubmit={props.handleSubmit} >
            <Button
                size='large'
                shape='circle'
                style={{
                    border: 'none',
                    marginRight: '9px',
                    boxShadow: 'none'
                }}
                icon={
                    <PaperClipOutlined
                        style={{
                            fontSize: '24px',
                            color: 'rgba(112,117,121,0.8)'
                        }}
                    />
                }
            />
            <Field
                name='newMessage'
                component={
                    (props: any) => <Input
                        {...props.input}
                        placeholder="Новое сообщение"
                        size='large'
                        style={{
                            width: '100%', height: '42px',
                            padding: '10px',
                            borderRadius: '48px',
                            lineHeight: '42px'
                        }}
                    />
                }
            />
        </form>
    )
}

const NewMessageReduxForm = reduxForm<NewMessageFormDataType, NewMessagePropsType>({
    form: 'newMessage',
    onSubmitSuccess: (result: any, dispatch: any) => dispatch(reset('newMessage'))
})(NewMessageForm)

const Main: React.FC<{
    currentUser: UserType | null
    currentDialog: DialogType | null
    messages: Array<MessageType>
    sendMessage: (currentDialog: DialogType, newMessage: string) => void
}> = ({
    currentUser,
    currentDialog,
    messages,
    ...props
}) => {
        let receiver = currentDialog?.members.find((member: UserType) => member.username !== currentUser?.username)

        return (
            <Layout>
                <Sider width='25vw' theme='light'>
                    <SidebarContainer />
                </Sider>
                <Content className={style.content}>
                    {
                        currentDialog && <>
                            <PageHeader
                                className={style.header}
                                title={
                                    <div className={style.headerContent}>
                                        <Avatar size={40} icon={<UserOutlined />} />
                                        <div className={style.info}>
                                            <div className={style.title}>
                                                <h3>{receiver?.username}</h3>
                                            </div>
                                            <div className={style.status}>last seen recently</div>
                                        </div>
                                    </div>
                                }
                                style={{
                                    borderBottom: '1px solid rgb(218,220,224)',
                                    padding: '4.5px 13px 4.5px 24px',
                                    backgroundColor: '#FFFFFF'
                                }}
                            />
                            <div className={style.messagesContainer}>
                                <Messages currentUser={currentUser} messages={messages} />
                            </div>
                            <div className={style.newMessageFormContainer}>
                                <NewMessageReduxForm
                                    currentDialog={currentDialog}
                                    onSubmit={(formData: NewMessageFormDataType) => props.sendMessage(currentDialog, formData.newMessage)}
                                />
                            </div>
                        </>
                    }
                </Content>
            </Layout>
        )
    }

export default Main