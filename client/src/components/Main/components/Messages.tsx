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
                                style={{
                                    textAlign: `${message.sender._id === currentUser?._id ? 'right' : 'left'}`
                                }}
                            >
                                <div
                                    className={style.message}
                                    style={{
                                        backgroundColor: `${message.sender._id === currentUser?._id ? 'rgb(238,255,222)' : '#FFFFFF'}`
                                    }}
                                >
                                    {message.text}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

export default Messages