import React, { useEffect, useRef } from 'react'
import { CurrentDialogType, MessageType, UserType } from '../../../redux/reducers/Sidebar/DialogsReducer'
import style from '../Main.module.css'

type PropsType = {
    currentUser: UserType | null
    currentDialog: CurrentDialogType | null
}

const Messages: React.FC<PropsType> = ({ currentUser, currentDialog }) => {
    const scrollRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"})
    }, [currentDialog?.messages])

    return (
        <div className={style.messagesContainer}> 
            <div className={style.messages}>
                {currentDialog && currentDialog.messages.map((message: MessageType, index: number) => {
                    return (
                        <div className={ (currentUser && message.sender.id === currentUser._id) ?
                                [style.message, style.currentUserMessage].join(' ') : style.message } 
                            ref={scrollRef} 
                            key={index}>
                            <div className={style.messageAuthor}>
                                <span className={style.author}>{message.sender.username}</span>
                            </div>
                            <div className={style.messageText}>
                                <span className={style.text}>{message.text}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Messages