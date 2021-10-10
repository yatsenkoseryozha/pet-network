import React, { useState } from 'react'
import style from '../Sidebar.module.css'
import leftArrow from '../images/leftArrow.svg'
import { SETTINGS } from '../Sidebar'

type PropsType = {
    currentPassword: string
    newPassword: string
    updateCurrentPassword: (currentPassword: string) => void
    updateNewPassword: (newPassword: string) => void
    changePassword: (currentPassword: string, newPassword: string) => void
    logout: () => void
}


const Settings: React.FC<PropsType> = ({ currentPassword, newPassword, ...props }) => {
    const PASSWORD_CHANGE = 'PASSWORD_CHANGE'

    const [currentTab, setCurrentTab] = useState(SETTINGS)

    return (
        <>
            <div className={style.settingsHeader}>
                {
                    currentTab === SETTINGS &&
                        <div>Настройки</div>
                }
                {
                    currentTab === PASSWORD_CHANGE &&
                        <>
                            <img src={leftArrow} alt='Назад' className={style.leftArrow} 
                                onClick={ () => setCurrentTab(SETTINGS) } />
                            <div>Смена пароля</div>
                        </>
                }
            </div>
            <div className={style.settingsContainer}>
                {
                    currentTab === SETTINGS &&
                        <>
                            <div className={style.settingsButton} onClick={ () => setCurrentTab(PASSWORD_CHANGE) } >Смена пароля</div>
                            <div className={[style.settingsButton, style.logoutButton].join(' ')} onClick={props.logout} >Выйти</div>
                        </>
                }
                {
                    currentTab === PASSWORD_CHANGE &&
                        <div className={style.setting}>
                            <input type='password' placeholder='Текущий пароль' className={style.settingsInput} value={currentPassword} 
                                onChange={ e => props.updateCurrentPassword(e.currentTarget.value) } />
                            <input type='password' placeholder='Новый пароль' className={style.settingsInput} value={newPassword} 
                                onChange={ e => props.updateNewPassword(e.currentTarget.value) } />
                            <div className={style.settingsButton} onClick={ () => props.changePassword(currentPassword, newPassword) } >Сменить пароль</div>
                        </div>
                }
            </div>
        </>
    )
}

export default Settings