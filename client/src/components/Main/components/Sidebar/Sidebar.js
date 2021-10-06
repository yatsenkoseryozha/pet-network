import React, { useState } from 'react'
import Dialogs from './components/Dialogs'
import Settings from './components/Settings'
import style from './Sidebar.module.css'
import dialogsButton from './images/dialogsButton.svg'
import settingsButton from './images/settingsButton.svg'

const Sidebar = (props) => {
    const DIALOGS = 'DIALOGS'
    const SETTINGS = 'SETTINGS'

    const [currentTab, setCurrentTab] = useState(DIALOGS)

    return (
        <div className={style.wrapper}>
            {
                currentTab === DIALOGS &&
                    <Dialogs currentUser={props.currentUser} dialogs={props.dialogs} setCurrentDialog={props.setCurrentDialog}
                        toSearch={props.toSearch} getUsers={props.getUsers} users={props.users} />
            }
            {
                currentTab === SETTINGS &&
                    <Settings currentPassword={props.currentPassword} updateCurrentPassword={props.updateCurrentPassword}
                        newPassword={props.newPassword} updateNewPassword={props.updateNewPassword} 
                        changePassword={props.changePassword} logout={props.logout} />
            }
            <div className={style.navContainer}>
                <img src={dialogsButton} alt="Диалоги" className={style.navButton} onClick={ () => setCurrentTab(DIALOGS) } />
                <img src={settingsButton} alt="Настройки" className={style.navButton} onClick={ () => setCurrentTab(SETTINGS) } />
            </div>
        </div>
    )
}

export default Sidebar