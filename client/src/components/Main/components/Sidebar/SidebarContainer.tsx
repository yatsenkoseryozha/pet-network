import React from 'react'
import { connect } from 'react-redux'
import socket from '../../../../socket'
import { getDialogs, setCurrentDialog, getUsers, UserType, DialogType, changePassword, updatePasswordChangeMessage } from '../../../../redux/reducers/SidebarReducer'
import { getMessages } from '../../../../redux/reducers/MainReducer'
import { logout } from '../../../../redux/reducers/AuthReducer'
import { AppStateType } from '../../../../redux/store'
import Sidebar from './Sidebar'

type MapStatePropsType = {
    currentUser: UserType | null
    isFetching: boolean
    users: Array<UserType>
    dialogs: Array<DialogType>
    currentDialog: DialogType | null
    passwordChangeMessage: string
}

type MapDispatchPropsType = {
    getUsers: (username: string) => void 
    getDialogs: () => void
    setCurrentDialog: (dialog: DialogType) => void
    getMessages: (dialog: DialogType) => void
    changePassword: (currentPassword: string, newPassword: string) => void
    updatePasswordChangeMessage: (value: string) => void
    logout: () => void
}

type PropsType = MapStatePropsType & MapDispatchPropsType

class SidebarContainer extends React.Component<PropsType> {
    componentDidMount() {
        this.props.getDialogs()

        socket.on('NEW:MESSAGE', (receivers) => {
            if (receivers.find((receiver: UserType) => receiver._id === this.props.currentUser?._id))
                this.props.getDialogs()
        })
    }

    render() {
        return <Sidebar {...this.props} />
    }
}

const mapStateToProps = (state: AppStateType) => {
    return {
        currentUser: state.auth.currentUser,
        dialogs: state.sidebar.dialogs,
        currentDialog: state.sidebar.currentDialog,
        isFetching: state.sidebar.isFetching,
        users: state.sidebar.users,
        passwordChangeMessage: state.sidebar.passwordChangeMessage
    }
}

export default connect<MapStatePropsType, MapDispatchPropsType, {}, AppStateType>(
    mapStateToProps, { getDialogs, setCurrentDialog, getMessages, getUsers, changePassword, updatePasswordChangeMessage, logout }
)(SidebarContainer)