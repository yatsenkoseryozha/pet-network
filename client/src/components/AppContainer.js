import React from 'react'
import { connect } from 'react-redux'
import App from './App'
import { auth } from '../redux/reducers/AuthReducer'

class AppContainer extends React.Component {
    componentDidMount() {
        if (!this.props.currentUser.id && localStorage.getItem('token')) {
            this.props.auth(localStorage.getItem('token')).catch(error => {
                localStorage.removeItem('token')
                window.location.reload()
            })
        }        
    }

    render() {
        return <App {...this.props} changePassword={this.props.changePassword} />
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.currentUser
    }
}

export default connect(mapStateToProps, {auth})(AppContainer)