import React from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import AuthContainer from './Auth/AuthContainer'
import MainContainer from './Main/MainContainer'
import style from './App.module.css'
import { UserType } from '../redux/reducers/Sidebar/DialogsReducer'

type PropsType = {
    currentUser: UserType | null
}

const App: React.FC<PropsType> = ({ currentUser }) => {
    return (
        <div className={style.wrapper}>
            <BrowserRouter>
                <Route path="/">
                    {!currentUser ? <Redirect to='/auth' /> : <MainContainer />}
                </Route>
                <Route exact path="/auth">
                    {currentUser ? <Redirect to='/' /> : <AuthContainer />}
                </Route>
            </BrowserRouter>
        </div>
    )
}

export default App