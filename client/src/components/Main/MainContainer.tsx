import React from 'react'
import { connect } from 'react-redux'
import Main from './Main'
import { updateNewMessage, sendMessage } from '../../redux/reducers/MainReducer'
import { CurrentDialogType, UserType } from '../../redux/reducers/Sidebar/DialogsReducer'
import { AppStateType } from '../../redux/store'

type MapStatePropsType = {
    currentUser: UserType | null
    currentDialog: CurrentDialogType | null
    newMessage: string
}

type MapDispatchPropsType = {
    updateNewMessage: (value: string) => void
    sendMessage: (currentDialog: CurrentDialogType, text: string) => void
}

type PropsType = MapStatePropsType & MapDispatchPropsType

class MainContainer extends React.Component<PropsType> {
    render() {
        return <Main {...this.props} />
    }
}

const mapStateToProps = (state: AppStateType) => {
    return {
        currentUser: state.auth.currentUser,
        currentDialog: state.dialogs.currentDialog,
        newMessage: state.main.newMessage
    }
}

export default connect<MapStatePropsType, MapDispatchPropsType, {}, AppStateType>(
    mapStateToProps, {updateNewMessage, sendMessage}
)(MainContainer)