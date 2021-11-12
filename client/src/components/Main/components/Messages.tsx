import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import React, { useEffect, useRef } from 'react'
import { MessageType } from '../../../redux/reducers/MainReducer'
import { DialogType, UserType } from '../../../redux/reducers/SidebarReducer'
import style from '../Main.module.css'
import sidebarStyle from './Sidebar/Sidebar.module.css'

const Messages: React.FC<{
    currentUser: UserType | null
    currentDialog: DialogType
    isFetching: boolean
    messages: Array<MessageType>
    getMessages: (currentDialog: DialogType) => void
}> = ({
    currentUser,
    currentDialog,
    isFetching,
    messages,
    ...props
}) => {
        const scrollRef = useRef<HTMLDivElement | null>(null)

        useEffect(() => scrollRef.current?.scrollIntoView(), [messages])

        useEffect(() => props.getMessages(currentDialog), [currentDialog])

        return (
            <div className={style.messages}>
                {
                    isFetching ? (
                        <div className={sidebarStyle.feedbackContainer}>
                            <Spin 
                                size='large' 
                                indicator={<LoadingOutlined style={{ fontSize: 48, color: 'white' }} spin />}
                            />
                        </div>
                    ) : (
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
                    )
                }
            </div>
        )
    }

export default Messages