import React from 'react'
import { connect } from 'react-redux'
import Auth from './Auth'
import { updateUsername, updateEmail, updatePassword, login, registration } from '../../redux/reducers/AuthReducer'
import { AppStateType } from '../../redux/store'

type MapStatePropsType = {
    username: string
    email: string
    password: string
    registrationMessage: string
}

type MapDispatchPropsType = {
    updateUsername: (value: string) => void
    updateEmail: (value: string) => void
    updatePassword: (value: string) => void
    registration: (username: string, email: string) => void
    login: (username: string, password: string) => void
}

type PropsType = MapStatePropsType & MapDispatchPropsType

class AuthContainer extends React.Component<PropsType> {
    render() {
        return <Auth {...this.props} />
    }
}

const mapStateToProps = (state: AppStateType) => {
    return {
        username: state.auth.username,
        email: state.auth.email,
        password: state.auth.password,
        registrationMessage: state.auth.registrationMessage
    }
}

export default connect<MapStatePropsType, MapDispatchPropsType, {}, AppStateType>(
    mapStateToProps, {updateUsername, updateEmail, updatePassword, login, registration}
)(AuthContainer)