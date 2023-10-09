import { useEffect, useState, useContext } from "react";
import styles from '../../styles/Conversations.module.css';
import api from '../../utils/axios';
import { getConversation } from "../../utils/router";
import changeTimeFormat from "../../utils/changeTimeFormat";
import ChatContainer from "./ChatContainer";
import { observer } from 'mobx-react-lite';
import { Context } from '../..';

const Conversations = () => {
    const [conversations, setConversations] = useState([]);
    const [chat, setChat] = useState();
    const { nm, setNm, store } = useContext(Context); 

    useEffect(() => {
       api.get(getConversation).then(({data}) => {setConversations([...data])})
    }, []);

    useEffect(() => {
        if(nm) {
            setConversations((prev) => {
                prev.map(e => {
                    if(e.uuid === nm.sender_id) {
                        e.text = nm.type === 'image' ? 
                        'изображение' : nm.type === 'video' ?
                        'видео' : nm.type === 'audio' ?
                        'аудио' : nm.text;
                        e.create_time = nm.create_time;
                    }
                    return e;
                }) 
                return [...prev];
            });
            setNm(null);
        }
    }, [nm]);

    return (
        <div className={styles.container}>
            {chat ? <ChatContainer user={chat}/> : conversations.length > 0 ? conversations.map((user, i) => (
                <div key={user.uuid}>
                    <div className={styles.item} onClick={() => setChat(user)}>     
                        <h3 className={styles.fullName}>{user.name} {user.surname}</h3>
                        <span className={styles.msg}>{ 
                            user.type === 'image' ? 
                            'изображение' : user.type === 'video' ?
                            'видео' : user.type === 'audio' ?
                            'аудио' : user.text ? user.text :
                            'начните диалог' 
                        }
                        </span>
                        <span className={styles.date}>{changeTimeFormat(user.create_time)}</span>
                    </div>
                    {conversations[i+1] && <hr/>}
                </div>   
            )) : <h2 style={{textAlign: 'center'}}>Тут будут диалоги</h2>}
        </div>
    )
}

export default observer(Conversations);