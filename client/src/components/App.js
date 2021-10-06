import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import AuthContainer from './Auth/AuthContainer'
import MainContainer from './Main/MainContainer'
import style from './App.module.css'

const App = (props) => {
    if (!props.currentUser.id && localStorage.getItem('token')) {
        return null
    } else {
        return (
            <div className={style.wrapper}>
                <BrowserRouter>
                    <Route path="/">
                        {(!props.currentUser.id) ? <Redirect to='/auth' /> : <MainContainer />}
                    </Route>
                    <Route exact path="/auth">
                        {(props.currentUser.id) ? <Redirect to='/' /> : <AuthContainer />}
                    </Route>
                </BrowserRouter>
            </div>
        )
    }
}

export default App