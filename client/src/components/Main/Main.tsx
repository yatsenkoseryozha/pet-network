import React from 'react'
import { Field, InjectedFormProps, reduxForm, reset } from 'redux-form'
import SidebarContainer from './components/Sidebar/SidebarContainer'
import Messages from './components/Messages'
import style from './Main.module.css'
import { DialogType, UserType } from '../../redux/reducers/SidebarReducer'
import { MessageType } from '../../redux/reducers/MainReducer'
import { Layout } from 'antd'

const { Content, Sider } = Layout

type NewMessagePropsType = {
    currentDialog: DialogType | null
}

type NewMessageFormDataType = {
    newMessage: string
}

const NewMessageForm: React.FC<InjectedFormProps<NewMessageFormDataType, NewMessagePropsType> & NewMessagePropsType> = ({currentDialog, ...props}) => {
    return (
        <form className={style.newMessageContainer} onSubmit={props.handleSubmit} >
            <Field className={style.newMessage} name='newMessage' component='textarea' type='text' placeholder='Новое сообщение' disabled={currentDialog ? false : true} />
            <button className={style.sendButton} type='submit' disabled={currentDialog ? false : true}>Отправить</button>
        </form>
    )
}

const NewMessageReduxForm = reduxForm<NewMessageFormDataType, NewMessagePropsType>({
    form: 'newMessage',
    onSubmitSuccess: (result: any, dispatch: any) => dispatch(reset('newMessage'))
})(NewMessageForm)

type PropsType = {
    currentUser: UserType | null
    currentDialog: DialogType | null
    messages: Array<MessageType>
    sendMessage: (currentDialog: DialogType, newMessage: string) => void
}

const Main: React.FC<PropsType> = ({ currentUser, currentDialog, messages, ...props }) => {
    let receiver: string | undefined = undefined

    if (currentUser && currentDialog)
        receiver = currentDialog.members.find((member: UserType) => member.username !== currentUser.username)?.username

    return (
        <Layout>
            <Sider width={370} theme='light' collapsedWidth="0">
                <SidebarContainer />
            </Sider>
            <Content className={style.wrapper}>
            {currentDialog && <div className={style.headerContainer}>
                    <div className={style.receiver}>{receiver}</div>
                </div>}
                <div className={style.messagesContainer}>
                    {currentDialog && <Messages currentUser={currentUser} messages={messages} />}
                </div>
                {currentDialog && <NewMessageReduxForm currentDialog={currentDialog} 
                    onSubmit={(formData: NewMessageFormDataType) => props.sendMessage(currentDialog, formData.newMessage)} />}
            </Content>
        </Layout>
    )
}

export default Main