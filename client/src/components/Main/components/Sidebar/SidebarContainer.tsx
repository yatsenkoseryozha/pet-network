import React from 'react'
import { connect } from 'react-redux'
import socket from '../../../../socket'
import { 
    getUsers, 
    getDialogs, 
    setCurrentDialog, 
    changePassword, 
    updateSidebarNotification as updateNotification,
    UserType, DialogType, SidebarNotificationType
} from '../../../../redux/reducers/SidebarReducer'
import { getMessages } from '../../../../redux/reducers/MainReducer'
import { logout } from '../../../../redux/reducers/AuthReducer'
import { AppStateType } from '../../../../redux/store'
import Sidebar from './Sidebar'

type MapStatePropsType = {
    currentUser: UserType | null
    toSearch: string
    isFetching: boolean
    users: Array<UserType>
    dialogs: Array<DialogType>
    currentDialog: DialogType | null
    notification: SidebarNotificationType | null
}

type MapDispatchPropsType = {
    getUsers: (username: string) => void 
    getDialogs: () => void
    setCurrentDialog: (dialog: DialogType) => void
    getMessages: (dialog: DialogType) => void
    changePassword: (currentPassword: string, newPassword: string, callback: any) => void
    updateNotification: (notification: SidebarNotificationType | null) => void
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
        toSearch: state.form.search?.values?.toSearch,
        isFetching: state.sidebar.isFetching,
        dialogs: state.sidebar.dialogs,
        currentDialog: state.sidebar.currentDialog,
        users: state.sidebar.users,
        notification: state.sidebar.notification
    }
}

export default connect<MapStatePropsType, MapDispatchPropsType, {}, AppStateType>(
    mapStateToProps, { getDialogs, setCurrentDialog, getMessages, getUsers, changePassword, updateNotification, logout }
)(SidebarContainer)