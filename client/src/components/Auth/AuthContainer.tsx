import React from 'react'
import { connect } from 'react-redux'
import Auth from './Auth'
import { login, registration } from '../../redux/reducers/AuthReducer'
import { AppStateType } from '../../redux/store'

type MapStatePropsType = {
    isFetching: boolean
    registrationMessage: string
}

type MapDispatchPropsType = {
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
        isFetching: state.auth.isFetching,
        registrationMessage: state.auth.registrationMessage
    }
}

export default connect<MapStatePropsType, MapDispatchPropsType, {}, AppStateType>(
    mapStateToProps, {login, registration}
)(AuthContainer)