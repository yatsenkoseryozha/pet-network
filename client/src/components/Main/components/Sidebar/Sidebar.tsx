import React, { useState } from 'react'
import Dialogs from './components/Dialogs'
import Settings from './components/Settings'
import style from './Sidebar.module.css'
import dialogsButton from './images/dialogsButton.svg'
import settingsButton from './images/settingsButton.svg'
import { DialogType, UserType } from '../../../../redux/reducers/Sidebar/DialogsReducer'

export const DIALOGS = 'DIALOGS'
export const SETTINGS = 'SETTINGS'

type PropsType = {
    currentUser: UserType | null
    toSearch: string
    users: Array<UserType>
    dialogs: Array<DialogType>
    currentPassword: string
    newPassword: string
    getUsers: (username: string) => void
    getDialogs: () => void
    setCurrentDialog: (dialog: DialogType) => void
    getMessages: (currentDialog: DialogType) => void
    updateCurrentPassword: (value: string) => void
    updateNewPassword: (value: string) => void
    changePassword: (currentPassword: string, newPassword: string) => void
    logout: () => void
}

const Sidebar: React.FC<PropsType> = ({ currentUser, toSearch, users, dialogs, currentPassword, newPassword, ...props }) => {
    const [currentTab, setCurrentTab] = useState(DIALOGS)

    return (
        <div className={style.wrapper}>
            {
                currentTab === DIALOGS &&
                    <Dialogs currentUser={currentUser} 
                        getDialogs={props.getDialogs} dialogs={dialogs} 
                        setCurrentDialog={props.setCurrentDialog} getMessages={props.getMessages}
                        toSearch={toSearch} getUsers={props.getUsers} users={users} />
            }
            {
                currentTab === SETTINGS &&
                    <Settings currentUser={currentUser} logout={props.logout} 
                        currentPassword={currentPassword} updateCurrentPassword={props.updateCurrentPassword}
                        newPassword={newPassword} updateNewPassword={props.updateNewPassword} changePassword={props.changePassword} />
            }
            <div className={style.navContainer}>
                <img src={dialogsButton} alt="Диалоги" className={style.navButton} onClick={ () => setCurrentTab(DIALOGS) } />
                <img src={settingsButton} alt="Настройки" className={style.navButton} onClick={ () => setCurrentTab(SETTINGS) } />
            </div>
        </div>
    )
}

export default Sidebar