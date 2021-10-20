import React from 'react'
import { connect } from 'react-redux'
import { getDialogs, setCurrentDialog, updateToSearch, getUsers, UserType, DialogType } from '../../../../redux/reducers/Sidebar/DialogsReducer'
import { updateCurrentPassword, updateNewPassword, changePassword } from '../../../../redux/reducers/Sidebar/SettingsReducer'
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
    updateCurrentPassword: (value: string) => void
    updateNewPassword: (value: string) => void
    changePassword: (currentPassword: string, newPassword: string) => void
    logout: () => void
}

type PropsType = MapStatePropsType & MapDispatchPropsType

class SidebarContainer extends React.Component<PropsType> {
    componentDidMount() {
        this.props.getDialogs()
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
    mapStateToProps, { getDialogs, setCurrentDialog, updateToSearch, getUsers, 
    updateCurrentPassword, updateNewPassword, changePassword, logout }
)(SidebarContainer)