import React, { useState } from 'react'
import { Field, InjectedFormProps, reduxForm, reset } from 'redux-form'
import { Input, Layout, PageHeader, Avatar, Button } from 'antd'
import { PaperClipOutlined, UserOutlined, LeftOutlined } from '@ant-design/icons';
import SidebarContainer from './components/Sidebar/SidebarContainer'
import Messages from './components/Messages'
import style from './Main.module.css'
import { DialogType, UserType } from '../../redux/reducers/SidebarReducer'
import { MessageType } from '../../redux/reducers/MainReducer'

const { Content, Sider } = Layout

type NewMessagePropsType = {
    currentDialog: DialogType | null
}

type NewMessageFormDataType = {
    newMessage: string
}

class NewMessageForm extends React.Component<InjectedFormProps<NewMessageFormDataType, NewMessagePropsType> & NewMessagePropsType, {}> {
    renderField(props: any) {
        return (
            <Input
                {...props.input}
                placeholder="Новое сообщение"
                size='large'
                style={{
                    width: '100%', height: '42px',
                    padding: '10px',
                    borderRadius: '48px',
                    lineHeight: '42px'
                }}
            />
        )
    }

    render() {
        return (
            <form className={style.newMessageForm} onSubmit={this.props.handleSubmit} >
                <Button
                    size='large'
                    shape='circle'
                    style={{
                        border: 'none',
                        marginRight: '9px',
                        boxShadow: 'none'
                    }}
                    icon={
                        <PaperClipOutlined
                            style={{
                                fontSize: '24px',
                                color: 'rgba(112,117,121,0.8)'
                            }}
                        />
                    }
                />
                <Field name='newMessage' component={this.renderField} />
            </form>
        )
    }
}

const NewMessageReduxForm = reduxForm<NewMessageFormDataType, NewMessagePropsType>({
    form: 'newMessage',
    onSubmitSuccess: (result: any, dispatch: any) => dispatch(reset('newMessage'))
})(NewMessageForm)

const Main: React.FC<{
    currentUser: UserType | null
    currentDialog: DialogType | null
    isFetching: boolean
    messages: Array<MessageType>
    setCurrentDialog: (dialog: DialogType | null) => void
    sendMessage: (currentDialog: DialogType, newMessage: string) => void
    getMessages: (currentDialog: DialogType) => void
}> = ({
    currentUser,
    currentDialog,
    isFetching,
    messages,
    ...props
}) => {
        const [siderCollapsible, setSiderCollapsible] = useState(false)
        const [siderCollapsed, setSiderCollapsed] = useState(false)

        let receiver = currentDialog?.members.find((member: UserType) => member.username !== currentUser?.username)

        return (
            <Layout>
                <Sider
                    width={siderCollapsible ? '100%' : 370}
                    theme='light'
                    collapsible={siderCollapsible}
                    collapsed={siderCollapsed}
                    collapsedWidth={0}
                    zeroWidthTriggerStyle={{
                        display: 'none'
                    }}
                    breakpoint='md'
                    onBreakpoint={broken => {
                        setSiderCollapsible(broken)

                        if (currentDialog)
                            setSiderCollapsed(broken)
                    }}
                >
                    <SidebarContainer siderCollapsible={siderCollapsible} siderCollapsed={siderCollapsed} setSiderCollapsed={setSiderCollapsed} />
                </Sider>
                <Content 
                    className={style.content}
                    style={{
                        borderLeft: `${currentDialog ? '1px solid rgb(218,220,224)' : 'none'}` 
                    }}
                >
                    {
                        currentDialog && <>
                            <PageHeader
                                className={style.header}
                                title={
                                    <div className={style.headerContent}>
                                        <Avatar size={40} icon={<UserOutlined />} />
                                        <div className={style.info}>
                                            <div className={style.title}>
                                                <h3>{receiver?.username}</h3>
                                            </div>
                                            <div className={style.status}>last seen recently</div>
                                        </div>
                                    </div>
                                }
                                style={{
                                    borderBottom: '1px solid rgb(218,220,224)',
                                    padding: '4.5px 13px 4.5px 24px',
                                    backgroundColor: '#FFFFFF'
                                }}
                                backIcon={siderCollapsible ? <LeftOutlined /> : false}
                                onBack={() => {
                                    setSiderCollapsed(false)
                                    props.setCurrentDialog(null)
                                }}
                            />
                            <div className={style.messagesContainer}>
                                <Messages
                                    currentUser={currentUser}
                                    currentDialog={currentDialog}
                                    getMessages={props.getMessages}
                                    isFetching={isFetching}
                                    messages={messages}
                                />
                            </div>
                            <div className={style.newMessageFormContainer}>
                                <NewMessageReduxForm
                                    currentDialog={currentDialog}
                                    onSubmit={(formData: NewMessageFormDataType) => {
                                        if (formData.newMessage)
                                            props.sendMessage(currentDialog, formData.newMessage)
                                    }}
                                />
                            </div>
                        </>
                    }
                </Content>
            </Layout>
        )
    }

export default Main