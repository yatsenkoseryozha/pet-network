import React, { useEffect, useRef } from 'react'
import { MessageType } from '../../../redux/reducers/MainReducer'
import { DialogType, UserType } from '../../../redux/reducers/SidebarReducer'
import style from '../Main.module.css'

const Messages: React.FC<{
    currentUser: UserType | null
    currentDialog: DialogType
    messages: Array<MessageType>
    getMessages: (currentDialog: DialogType) => void
}> = ({
    currentUser,
    currentDialog,
    messages,
    ...props
}) => {
        const scrollRef = useRef<HTMLDivElement | null>(null)

        useEffect(() => scrollRef.current?.scrollIntoView(), [messages])

        useEffect(() => props.getMessages(currentDialog), [currentDialog])

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
                                <span
                                    className={style.message}
                                    style={{
                                        backgroundColor: `${message.sender._id === currentUser?._id ? 'rgb(238,255,222)' : '#FFFFFF'}`
                                    }}
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