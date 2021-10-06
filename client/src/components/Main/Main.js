import SidebarContainer from './components/Sidebar/SidebarContainer'
import Messages from './components/Messages'
import style from './Main.module.css'

const Main = (props) => {
    return (
        <>
            <SidebarContainer />
            <div className={style.wrapper}>
                <div className={style.headerContainer}>
                    <div className={style.receiver}>
                        {props.currentDialog.receiver.username}
                    </div>
                </div>
                <Messages currentUser={props.currentUser} messages={props.currentDialog.messages} />
                <div className={style.newMessageContainer}>
                    <textarea
                        ref={props.lastMessageRef}
                        className={style.newMessage} 
                        onChange={ e => props.updateNewMessage(e.currentTarget.value) } 
                        value={props.newMessage}
                        placeholder="Новое сообщение" />
                    <input 
                        type="submit"
                        className={style.sendButton} 
                        onClick={ () => props.sendMessage(props.currentDialog, props.newMessage) } />
                </div>
            </div>
        </>
    )
}

export default Main