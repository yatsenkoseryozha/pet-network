import React from 'react'
import SidebarContainer from './components/Sidebar/SidebarContainer'
import Messages from './components/Messages'
import style from './Main.module.css'
import { CurrentDialogType, UserType } from '../../redux/reducers/Sidebar/DialogsReducer'

type PropsType = {
    currentUser: UserType | null
    currentDialog: CurrentDialogType | null
    newMessage: string
    updateNewMessage: (value: string) => void
    sendMessage: (currentDialog: CurrentDialogType, newMessage: string) => void
}

const Main: React.FC<PropsType> = ({ currentUser, currentDialog, newMessage, ...props }) => {
    let receiver: string | undefined = undefined

    if (currentUser && currentDialog)
        receiver = currentDialog.members.find((member: UserType) => member.username !== currentUser.username)?.username
    
    return (
        <>
            <SidebarContainer />
            <div className={style.wrapper}>
                <div className={style.headerContainer}>
                    <div className={style.receiver}>
                        {receiver}
                    </div>
                </div>
                {currentDialog && <Messages currentUser={currentUser} messages={currentDialog.messages} />}
                <div className={style.newMessageContainer}>
                    <textarea
                        className={style.newMessage} 
                        onChange={ e => props.updateNewMessage(e.currentTarget.value) } 
                        value={newMessage}
                        placeholder="Новое сообщение" />
                    <input 
                        type="submit"
                        className={style.sendButton} 
                        onClick={ () => currentDialog && props.sendMessage(currentDialog, newMessage) } />
                </div>
            </div>
        </>
    )
}

export default Main