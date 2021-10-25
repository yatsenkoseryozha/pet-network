import React from 'react'
import SidebarContainer from './components/Sidebar/SidebarContainer'
import Messages from './components/Messages'
import style from './Main.module.css'
import { CurrentDialogType, UserType } from '../../redux/reducers/Sidebar/DialogsReducer'
import { Field, InjectedFormProps, reduxForm, reset } from 'redux-form'

type NewMessagePropsType = {
    currentDialog: CurrentDialogType | null
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
    currentDialog: CurrentDialogType | null
    sendMessage: (currentDialog: CurrentDialogType | null, newMessage: string) => void
}

const Main: React.FC<PropsType> = ({ currentUser, currentDialog, ...props }) => {
    let receiver: string | undefined = undefined

    if (currentUser && currentDialog)
        receiver = currentDialog.members.find((member: UserType) => member.username !== currentUser.username)?.username
    
    return (
        <>
            <SidebarContainer />
            <div className={style.wrapper}>
                <div className={style.headerContainer}>
                    <div className={style.receiver}>{receiver ? receiver : 'undefined'}</div>
                </div>
                <Messages currentUser={currentUser} currentDialog={currentDialog} />
                <NewMessageReduxForm currentDialog={currentDialog} 
                    onSubmit={(formData: NewMessageFormDataType) => props.sendMessage(currentDialog, formData.newMessage)} />
            </div>
        </>
    )
}

export default Main