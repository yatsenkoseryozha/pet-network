import React from 'react'
import { connect } from 'react-redux'
import { getDialogs, setCurrentDialog, updateToSearch, getUsers } from '../../../../redux/reducers/Sidebar/DialogsReducer'
import { updateCurrentPassword, updateNewPassword, changePassword } from '../../../../redux/reducers/Sidebar/SettingsReducer'
import Sidebar from './Sidebar'

class SidebarContainer extends React.Component {
    componentDidMount() {
        this.props.getDialogs()
    }
    
    logout = () => {
        localStorage.removeItem('token')
        window.location.reload()
    }

    changePassword = (currentPassword, newPassword) => {
        return this.props.changePassword(currentPassword, newPassword).then(message => {
            alert(message)
        }).catch(error => alert(error.response.data.message))
    }

    render() {
        return <Sidebar {...this.props} changePassword={this.changePassword} logout={this.logout} />
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.currentUser,
        dialogs: state.dialogs.dialogs,
        toSearch: state.dialogs.toSearch,
        users: state.dialogs.users,
        currentPassword: state.settings.passwordChange.currentPassword,
        newPassword: state.settings.passwordChange.newPassword
    }
}

export default connect(mapStateToProps, {
    getDialogs, setCurrentDialog, updateToSearch, getUsers, 
    updateCurrentPassword, updateNewPassword, changePassword
})(SidebarContainer)