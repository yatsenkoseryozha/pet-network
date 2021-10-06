import { useState } from 'react'
import style from '../Sidebar.module.css'
import leftArrow from '../images/leftArrow.svg'


const Settings = (props) => {
    const SETTINGS = 'SETTINGS'
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
                            <input type='password' placeholder='Текущий пароль' className={style.settingsInput} value={props.currentPassword} 
                                onChange={ e => props.updateCurrentPassword(e.currentTarget.value) } />
                            <input type='password' placeholder='Новый пароль' className={style.settingsInput} value={props.newPassword} 
                                onChange={ e => props.updateNewPassword(e.currentTarget.value) } />
                            <div className={style.settingsButton} onClick={ () => props.changePassword(props.currentPassword, props.newPassword) } >Сменить пароль</div>
                        </div>
                }
            </div>
        </>
    )
}

export default Settings