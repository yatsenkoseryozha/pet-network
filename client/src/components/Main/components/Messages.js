import React, { useEffect, useRef } from 'react'
import style from '../Main.module.css'

const Messages = (props) => {
    const scrollRef = useRef()

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"})
    }, [props.messages])

    return (
        <div className={style.messagesContainer}> 
            <div className={style.messages}>
                {props.messages.map((message, index) => {
                    return (
                        <div className={ (message.sender.id === props.currentUser.id) ?
                                [style.message, style.currentUserMessage].join(' ') : style.message } 
                            ref={scrollRef} key={index}>
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