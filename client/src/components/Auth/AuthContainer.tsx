import React from 'react'
import { connect } from 'react-redux'
import Auth from './Auth'
import { login, registration, updateAuthNotification as updateNotification, AuthNotificationType } from '../../redux/reducers/AuthReducer'
import { AppStateType } from '../../redux/store'

type MapStatePropsType = {
    isFetching: boolean
    notification: AuthNotificationType | null
}

type MapDispatchPropsType = {
    registration: (username: string, email: string, password: string) => void
    login: (username: string, password: string) => void
    updateNotification: (notification: AuthNotificationType | null) => void
}

type PropsType = MapStatePropsType & MapDispatchPropsType

class AuthContainer extends React.Component<PropsType> {
    render() {
        return <Auth {...this.props} />
    }
}

const mapStateToProps = (state: AppStateType) => {
    return {
        isFetching: state.auth.isFetching,
        notification: state.auth.notification
    }
}

export default connect<MapStatePropsType, MapDispatchPropsType, {}, AppStateType>(
    mapStateToProps, {login, registration, updateNotification}
)(AuthContainer)