import styled from 'styled-components'
import style from '../Sidebar.module.css'
import leftArrow from '../images/leftArrow.svg'
import { DialogType, UserType } from '../../../../../redux/reducers/Sidebar/DialogsReducer'
import React from 'react'

const DIALOG = 'DIALOG'
const USER = 'USER'

type PropsType = {
    currentUser: UserType | null
    toSearch: string
    users: Array<UserType>
    dialogs: Array<DialogType>
    getUsers: (username: string) => void
    setCurrentDialog: (dialog: DialogType, currentUser: UserType) => void
}

const SearchInput = styled.input `
    flex-grow: 1;
    width: 100%; height: 100%;
    border: none;
    padding-left: 10px;
    font-size: 24px;
    &:focus {
        outline: none;
    }
`

type DialogsItemPropsType = {
    type: typeof DIALOG | typeof USER
}

const DialogsItem = styled.div `
    display: flex;
    flex-direction: column;
    justify-content: ${(props: DialogsItemPropsType) =>
        props.type === DIALOG ? 'space-between' :
        props.type === USER && 'center'
    };
    align-items: ${(props: DialogsItemPropsType) =>
        props.type === DIALOG ? 'flex-start' :
        props.type === USER && 'center'
    };
    box-sizing: border-box;
    width: 100%; height: 120px;
    padding: 10px; margin-bottom: 10px;
    background-color: #FFFFFF;
    font-size: ${(props: DialogsItemPropsType) =>
        props.type === DIALOG ? '24px' :
        props.type === USER && '28px'
    };
    cursor: pointer;
    &:last-child {
        margin-bottom: 0;
    }
`

const Dialogs: React.FC<PropsType> = ({ currentUser, toSearch, users, dialogs, ...props }) => {
    return (
        <>
            <div className={style.searchContainer}>
                {
                    (toSearch) &&
                        <img src={leftArrow} alt='Назад' className={style.leftArrow} 
                            onClick={ () => props.getUsers('') } />
                }
                <SearchInput type='text' placeholder='Поиск' className={style.searchInput} value={toSearch} 
                    onChange={e => props.getUsers(e.currentTarget.value)} />
            </div>
            <div className={style.dialogsContainer}>
                {
                    dialogs.length > 0 &&
                        <>
                            {
                                dialogs.map((dialog, index) => {
                                    if (dialog.members.find(member => member.username.indexOf(toSearch) === 0)) {
                                        return (
                                            <DialogsItem type={DIALOG} key={index}
                                                onClick={ () => currentUser && props.setCurrentDialog(dialog, currentUser) }>
                                                <div className={style.receiver}>
                                                    {
                                                        currentUser && dialog.members
                                                            .filter(member => member.id !== currentUser.id)
                                                            .map(member => member.username)
                                                    }
                                                </div>
                                                <div className={style.lastMessage}>
                                                    <span className={style.from}>
                                                        {(dialog.lastMessage && currentUser) &&  
                                                            typeof dialog.lastMessage.sender !== typeof currentUser.username ? null : "You: " }
                                                    </span>
                                                    {dialog.lastMessage && dialog.lastMessage.text}
                                                </div>
                                            </DialogsItem>
                                        )
                                    } else return null
                                })
                            }
                        </>
                }
                {
                    users.length > 0 &&
                        <>
                            {
                                users.map((user, index) => {
                                    return (
                                        <DialogsItem type={USER} key={index} onClick={() => currentUser && props.setCurrentDialog({
                                            id: null,
                                            members: [user, currentUser],
                                            lastMessage: null
                                        }, currentUser)} >
                                            <div className={style.receiver} >
                                                {user.username}
                                            </div>
                                        </DialogsItem>
                                    )
                                })
                            }
                        </>
                }
            </div>
        </>
    )
}

export default Dialogs