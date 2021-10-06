import styled from 'styled-components'
import style from '../Sidebar.module.css'
import leftArrow from '../images/leftArrow.svg'

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

const DialogsItem = styled.div `
    display: flex;
    flex-direction: column;
    justify-content: ${props =>
        props.type === 'DIALOG' ? 'space-between' :
        props.type === 'USER' && 'center'
    };
    align-items: ${props =>
        props.type === 'DIALOG' ? 'flex-start' :
        props.type === 'USER' && 'center'
    };
    box-sizing: border-box;
    width: 100%; height: 120px;
    padding: 10px; margin-bottom: 10px;
    background-color: #FFFFFF;
    font-size: ${props =>
        props.type === 'DIALOG' ? '24px' :
        props.type === 'USER' && '28px'
    };
    cursor: pointer;
    &:last-child {
        margin-bottom: 0;
    }
`

const Dialogs = (props) => {
    return (
        <>
            <div className={style.searchContainer}>
                {
                    (props.toSearch) &&
                        <img src={leftArrow} alt='Назад' className={style.leftArrow} 
                            onClick={ () => props.getUsers('') } />
                }
                <SearchInput type='text' placeholder='Поиск' className={style.searchInput} value={props.toSearch} 
                    toSearch={props.toSearch} onChange={e => props.getUsers(e.currentTarget.value)} />
            </div>
            <div className={style.dialogsContainer}>
                {
                    props.dialogs.length > 0 &&
                        <>
                            {
                                props.dialogs.map((dialog, index) => {
                                    if (dialog.members.find(member => member.username.indexOf(props.toSearch) === 0)) {
                                        return (
                                            <DialogsItem type={'DIALOG'} key={index}
                                                onClick={ () => props.setCurrentDialog(dialog, props.currentUser) }>
                                                <div className={style.receiver}>
                                                    {
                                                        dialog.members
                                                            .filter(member => member.id !== props.currentUser.id)
                                                            .map(member => member.username)
                                                    }
                                                </div>
                                                <div className={style.lastMessage}>
                                                    <span className={style.from}>
                                                        {(dialog.lastMessage.sender !== props.currentUser.username) ? null : "You: " }
                                                    </span>
                                                    {dialog.lastMessage.text}
                                                </div>
                                            </DialogsItem>
                                        )
                                    } else return null
                                })
                            }
                        </>
                }
                {
                    props.users.length > 0 &&
                        <>
                            {
                                props.users.map((user, index) => {
                                    return (
                                        <DialogsItem type={'USER'} key={index} onClick={() => props.setCurrentDialog({
                                            _id: undefined,
                                            members: [user, props.currentUser],
                                            lastMessage: undefined
                                        }, props.currentUser)} >
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