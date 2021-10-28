import React from 'react'
import { connect } from 'react-redux'
import socket from '../../../../socket'
import { getDialogs, setCurrentDialog, updateToSearch, getUsers, UserType, DialogType } from '../../../../redux/reducers/Sidebar/DialogsReducer'
import { updateCurrentPassword, updateNewPassword, changePassword } from '../../../../redux/reducers/Sidebar/SettingsReducer'
import { getMessages } from '../../../../redux/reducers/MainReducer'
import { logout } from '../../../../redux/reducers/AuthReducer'
import { AppStateType } from '../../../../redux/store'
import Sidebar from './Sidebar'

type MapStatePropsType = {
    currentUser: UserType | null
    toSearch: string,
    users: Array<UserType>
    dialogs: Array<DialogType>
    currentPassword: string,
    newPassword: string
}

type MapDispatchPropsType = {
    updateToSearch: (value: string) => void
    getUsers: (username: string) => void 
    getDialogs: () => void
    setCurrentDialog: (dialog: DialogType) => void
    getMessages: (currentDialog: DialogType) => void
    updateCurrentPassword: (value: string) => void
    updateNewPassword: (value: string) => void
    changePassword: (currentPassword: string, newPassword: string) => void
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
        dialogs: state.dialogs.dialogs,
        toSearch: state.dialogs.toSearch,
        users: state.dialogs.users,
        currentPassword: state.settings.currentPassword,
        newPassword: state.settings.newPassword
    }
}

export default connect<MapStatePropsType, MapDispatchPropsType, {}, AppStateType>(
    mapStateToProps, { getDialogs, setCurrentDialog, getMessages, updateToSearch, getUsers, 
    updateCurrentPassword, updateNewPassword, changePassword, logout }
)(SidebarContainer)