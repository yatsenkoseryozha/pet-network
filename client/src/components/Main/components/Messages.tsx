import React, { useEffect, useRef } from 'react'
import { MessageType } from '../../../redux/reducers/MainReducer'
import { UserType } from '../../../redux/reducers/SidebarReducer'
import style from '../Main.module.css'

const Messages: React.FC<{
    currentUser: UserType | null
    messages: Array<MessageType>
}> = ({ 
    currentUser,
    messages 
}) => {
    const scrollRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => scrollRef.current?.scrollIntoView(), [messages])

    return (
        <div className={style.messages}>
            {
                messages?.map((message: MessageType, index: number) => {
                    return (
                        <div
                            className={style.messageContainer}
                            ref={scrollRef}
                            key={index}
                            style={
                                message.sender._id === currentUser?._id ? {
                                    textAlign: 'right'
                                } : {
                                    textAlign: 'left'
                                }
                            }
                        >
                            <span
                                className={style.message}
                                style={
                                    message.sender._id === currentUser?._id ? {
                                        backgroundColor: 'rgb(238,255,222)'
                                    } : {
                                        backgroundColor: '#FFFFFF'
                                    }
                                }
                            >
                                {message.text}
                            </span>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Messages