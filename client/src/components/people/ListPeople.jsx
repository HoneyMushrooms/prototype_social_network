import { useEffect, useState, useContext } from 'react';
import styles from '../../styles/ListPeople.module.css';
import api from '../../utils/axios';
import { friend, host, subscription, follower, daleteRequestFriend, createFriendFromFollower, createFollowerFromFriend, createRequestFriend } from '../../utils/router';
import { observer } from 'mobx-react-lite';
import { Context } from '../..';

const ListPeople = ({ selectedMenu, find, handleLinkClick }) => {

    const [list, setList] = useState([]);
    const { store, rl, setRl } = useContext(Context); 

    useEffect(() => {
        async function getPeople() {
            if(selectedMenu === 'find') {
                setList([]);
            } if(selectedMenu === 'friend') {
                const { data } = await api.get(friend);
                setList(data);
            } else if(selectedMenu === 'follower') {
                const { data } = await api.get(follower);
                setList(data);
            } else if(selectedMenu === 'subscriber') {
                const { data } = await api.get(subscription);
                setList(data);
            }
        }
        getPeople();
    }, [selectedMenu]);

    useEffect(() => {
        if(find.length) {
            setList(find);
        }
    }, [find]);

    useEffect(() => {
        if(rl) {
            setRl(null)
            if(rl.type === 'createFriendFromFollower') {
                if(selectedMenu === 'friend') {
                    setList((prev) => [rl.data, ...prev]);
                } else if(selectedMenu === 'subscriber') {
                    setList((prev) => [...prev.filter(e => e.uuid !== rl.data.uuid)]);
                } else if(selectedMenu === 'find') {
                    setList((prev) => [...prev.map(e => e.uuid === rl.data.uuid ? {...rl.data} : e)]);
                } 
            } else if(rl.type === 'createRequestFriend') {
                if(selectedMenu === 'follower') {
                    setList((prev) => [rl.data, ...prev]);
                } else if(selectedMenu === 'find') {
                    setList((prev) => [...prev.map(e => e.uuid === rl.data.uuid ? {...rl.data} : e)]);
                } 
            } else if(rl.type === 'daleteRequestFriend') {
                if(selectedMenu === 'follower') {
                    setList((prev) => [...prev.filter(e => e.uuid !== rl.data.uuid)]);
                } else if(selectedMenu === 'find') {
                    setList((prev) => [...prev.map(e => e.uuid === rl.data.uuid ? {...rl.data} : e)]);
                } 
            } else if(rl.type === 'createFollowerFromFriend') {
                if(selectedMenu === 'subscriber') {
                    setList((prev) => [rl.data, ...prev]);
                } else if(selectedMenu === 'friend') {
                    setList((prev) => [...prev.filter(e => e.uuid !== rl.data.uuid)]);
                } else if(selectedMenu === 'find') {
                    setList((prev) => [...prev.map(e => e.uuid === rl.data.uuid ? {...rl.data} : e)]);
                } 
            }
        }
    }, [rl]);

    const handleSubmit = async (user) => {
        if(user.text === 'Принять заявку в друзья') {
            store.socket.send(JSON.stringify({
                type: 'createFriendFromFollower',
                to: user.uuid,
                data: {
                    uuid: store.user.id,
                    name: store.user.name,
                    surname: store.user.surname,
                    old_relationship: true,
                    logo: store.user.logo,
                    text: 'Удалить из друзей'
                }
            }));
            await api.patch(createFriendFromFollower, { user1: user.uuid });
        } else if(user.text === 'Отправить заявку в друзья') {
            store.socket.send(JSON.stringify({
                type: 'createRequestFriend',
                to: user.uuid,
                data: {
                    uuid: store.user.id,
                    name: store.user.name,
                    surname: store.user.surname,
                    old_relationship: true,
                    logo: store.user.logo,
                    text: 'Принять заявку в друзья'
                }
            }));
            await api.post(createRequestFriend, { user2: user.uuid });
        } else if(user.text === 'Отменить заявку в друзья') {
            store.socket.send(JSON.stringify({
                type: 'daleteRequestFriend',
                to: user.uuid,
                data: {
                    uuid: store.user.id,
                    name: store.user.name,
                    surname: store.user.surname,
                    logo: store.user.logo,
                    text: 'Отправить заявку в друзья'
                }
            }));
            await api.delete(daleteRequestFriend, { params: { user2: user.uuid } });
        } else if(user.text === 'Удалить из друзей') {
            store.socket.send(JSON.stringify({
                type: 'createFollowerFromFriend',
                to: user.uuid,
                data: {
                    uuid: store.user.id,
                    name: store.user.name,
                    surname: store.user.surname,
                    logo: store.user.logo,
                    text: 'Отменить заявку в друзья'
                }
            }));
            await api.patch(createFollowerFromFriend, { user1: user.uuid });
        }

        if(selectedMenu === 'find') {
            setList((prev) => {
                const newList = prev.map(e => {
                    if(e.uuid === user.uuid) {
                        if(e.text === 'Отправить заявку в друзья') {
                            e.text = 'Отменить заявку в друзья';
                        } else if(e.text === 'Отменить заявку в друзья') {
                            e.text = 'Отправить заявку в друзья';
                        } else if(e.text === 'Принять заявку в друзья') {
                            e.text = 'Удалить из друзей';
                        } else if(e.text === 'Удалить из друзей') {
                            e.text = 'Принять заявку в друзья';
                        }
                    }
                    return e;
                })
                return [...newList];
            })
        } else {
            setList((prev) => {
                const newList = prev.filter(e => e.uuid !== user.uuid);
                return [...newList];
            })
        }
    };

    return (
        <>
            {list ? list.map((user) => (
                <div key={user.uuid} className={styles.container}>
                    <img src={host + '/' + user.logo} alt="logo"/>     
                    <span onClick={() => handleLinkClick('other_profile', user.uuid)} className={styles.link} >{user.name} {user.surname}</span>{user.old_relationship && <span style={{color: 'red'}}>{'New'}</span>}
                    <button onClick={() => handleSubmit(user)}>{user.text}</button>        
                </div>
            )) : <div>Загрузка...</div>}
        </>
    )
}

export default observer(ListPeople);