import React from 'react'
import { connect } from 'react-redux'
import socket from '../../../../socket'
import { 
    getUsers, 
    getDialogs, 
    changePassword, 
    updateSidebarNotification as updateNotification,
    UserType, DialogType, SidebarNotificationType
} from '../../../../redux/reducers/SidebarReducer'
import { setCurrentDialog, getMessages } from '../../../../redux/reducers/MainReducer'
import { logout } from '../../../../redux/reducers/AuthReducer'
import { AppStateType } from '../../../../redux/store'
import Sidebar from './Sidebar'

type OwnStatePropsType = {
    siderCollapsible: boolean
    siderCollapsed: boolean
    setSiderCollapsed: (value: boolean) => void
}

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

type PropsType = MapStatePropsType & MapDispatchPropsType & OwnStatePropsType

class SidebarContainer extends React.Component<PropsType> {
    componentDidMount() {
        this.props.getDialogs()

        socket.on('NEW:MESSAGE', (receivers) => {
            if (receivers.find((receiver: UserType) => receiver._id === this.props.currentUser?._id))
                this.props.getDialogs()
        })
    }

    setCurrentDialog = (dialog: DialogType) => {
        this.props.setCurrentDialog(dialog)

        if (this.props.siderCollapsible)
            this.props.setSiderCollapsed(true)
    }

    render() {
        return <Sidebar {...this.props} setCurrentDialog={this.setCurrentDialog} />
    }
}

const mapStateToProps = (state: AppStateType) => {
    return {
        currentUser: state.auth.currentUser,
        toSearch: state.form.search?.values?.toSearch,
        isFetching: state.sidebar.isFetching,
        dialogs: state.sidebar.dialogs,
        currentDialog: state.main.currentDialog,
        users: state.sidebar.users,
        notification: state.sidebar.notification
    }
}

export default connect<MapStatePropsType, MapDispatchPropsType, {}, AppStateType>(
    mapStateToProps, { getDialogs, setCurrentDialog, getMessages, getUsers, changePassword, updateNotification, logout }
)(SidebarContainer)