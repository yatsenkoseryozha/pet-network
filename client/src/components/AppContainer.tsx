import React from 'react'
import { connect } from 'react-redux'
import App from './App'
import { auth } from '../redux/reducers/AuthReducer'
import { UserType } from '../redux/reducers/SidebarReducer'
import { AppStateType } from '../redux/store'

type MapStatePropsType = {
    isFetching: boolean
    currentUser: UserType | null
}

type MapDispatchPropsType = {
    auth: () => void
}

type PropsType = MapStatePropsType & MapDispatchPropsType

class AppContainer extends React.Component<PropsType> {
    componentDidMount() {
        if (localStorage.getItem('token'))
            this.props.auth()
    }

    render() {
        return <App {...this.props} />
    }
}

const mapStateToProps = (state: AppStateType) => {
    return {
        isFetching: state.auth.isFetching,
        currentUser: state.auth.currentUser
    }
}
export default connect<MapStatePropsType, MapDispatchPropsType, {}, AppStateType>(
    mapStateToProps, {auth}
)(AppContainer)