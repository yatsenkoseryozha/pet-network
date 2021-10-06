import React from 'react'
import { connect } from 'react-redux'
import Main from './Main'
import { updateNewMessage, sendMessage } from '../../redux/reducers/MainReducer'

class MainContainer extends React.Component {
    render() {
        return <Main {...this.props} />
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.currentUser,
        currentDialog: state.dialogs.currentDialog,
        newMessage: state.main.newMessage
    }
}

export default connect(mapStateToProps, {updateNewMessage, sendMessage})(MainContainer)