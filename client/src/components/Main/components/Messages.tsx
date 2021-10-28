import React, { useEffect, useRef } from 'react'
import { MessageType } from '../../../redux/reducers/MainReducer'
import { UserType } from '../../../redux/reducers/Sidebar/DialogsReducer'
import style from '../Main.module.css'

type PropsType = {
    currentUser: UserType | null
    messages: Array<MessageType>
}

const Messages: React.FC<PropsType> = ({ currentUser, messages }) => {
    const scrollRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => scrollRef.current?.scrollIntoView(), [messages])

    return (
        <div className={style.messages}>
            {messages?.map((message: MessageType, index: number) => {
                return (
                    <div className={ (currentUser && message.sender._id === currentUser._id) ?
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
    )
}

export default Messages