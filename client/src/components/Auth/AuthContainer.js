import React from 'react'
import { connect } from 'react-redux'
import Auth from './Auth'
import { updateUsername, updateEmail, updatePassword, login, registration } from '../../redux/reducers/AuthReducer'

class AuthContainer extends React.Component {
    registration = () => {
        this.props.registration(this.props.creditionals.username, this.props.creditionals.email).then(message => {
            alert(message)
            window.location = '/login'
        }).catch(error => {
            alert(error.response.data.message)
        })
    }
    
    login = () => {
        this.props.login(this.props.creditionals.username, this.props.creditionals.password).then(token => {
            localStorage.setItem('token', token)
            window.location = '/'
        }).catch(error => {
            alert(error.response.data.message)
        })
    }

    render() {
        return <Auth {...this.props} login={this.login} registration={this.registration} />
    }
}

const mapStateToProps = (state) => {
    return {
        creditionals: state.auth.creditionals
    }
}

export default connect(mapStateToProps, {updateUsername, updateEmail, updatePassword, login, registration})(AuthContainer)