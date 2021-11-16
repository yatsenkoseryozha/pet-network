import React from 'react'
import { connect } from 'react-redux'
import socket from '../../socket'
import Main from './Main'
import { setCurrentDialog, getMessages, MessageType, sendMessage } from '../../redux/reducers/MainReducer'
import { DialogType, UserType } from '../../redux/reducers/SidebarReducer'
import { AppStateType } from '../../redux/store'

type MapStatePropsType = {
    currentUser: UserType | null
    currentDialog: DialogType | null
    isFetching: boolean
    messages: Array<MessageType>
}

type MapDispatchPropsType = {
    setCurrentDialog: (dialog: DialogType | null) => void
    sendMessage: (currentDialog: DialogType, text: string) => void
    getMessages: (currentDialog: DialogType) => void
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
        currentDialog: state.main.currentDialog,
        isFetching: state.main.isFetching,
        messages: state.main.messages
    }
}

export default connect<MapStatePropsType, MapDispatchPropsType, {}, AppStateType>(
    mapStateToProps, { setCurrentDialog, getMessages, sendMessage }
)(MainContainer)