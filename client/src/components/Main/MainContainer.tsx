import React from 'react'
import { connect } from 'react-redux'
import socket from '../../socket'
import Main from './Main'
import { getMessages, MessageType, sendMessage } from '../../redux/reducers/MainReducer'
import { DialogType, UserType } from '../../redux/reducers/Sidebar/DialogsReducer'
import { AppStateType } from '../../redux/store'

type MapStatePropsType = {
    currentUser: UserType | null
    currentDialog: DialogType | null
    messages: Array<MessageType>
}

type MapDispatchPropsType = {
    getMessages: (currentDialog: DialogType) => void
    sendMessage: (currentDialog: DialogType, text: string) => void
}

type PropsType = MapStatePropsType & MapDispatchPropsType

class MainContainer extends React.Component<PropsType> {
    componentDidMount() {    
        socket.on('NEW:MESSAGE', (receivers) => {
            if (this.props.currentDialog && receivers.find((receiver: UserType) => receiver._id === this.props.currentUser?._id))
                this.props.getMessages(this.props.currentDialog)
        })
    }

    render() {
        return <Main {...this.props} />
    }
}

const mapStateToProps = (state: AppStateType) => {
    return {
        currentUser: state.auth.currentUser,
        currentDialog: state.dialogs.currentDialog,
        messages: state.main.messages
    }
}

export default connect<MapStatePropsType, MapDispatchPropsType, {}, AppStateType>(
    mapStateToProps, {getMessages, sendMessage}
)(MainContainer)