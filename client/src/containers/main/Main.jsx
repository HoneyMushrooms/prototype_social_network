import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import HeaderCC from '../../components/HeaderCC';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import { toast, ToastContainer } from 'react-toastify';
import toastOptions from '../../utils/toast';
import 'react-toastify/dist/ReactToastify.css';
import generateFingerprint from '../../utils/fingerprint';
import Controller from '../../components/Controller';

function MainPage({ setFirstConnect, firstConnect }) {
    const navigate = useNavigate();
    const { store, setRl, setNm } = useContext(Context);
    const location = useLocation();    
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [isConnected, setConnected] = useState(false);

    useEffect(() => {
        if(firstConnect) {
            setTimeout(() => { 
                toast.info('Подтвердите почту!', toastOptions);
                setFirstConnect(false);
            });
        }
    }, [firstConnect]);

    useEffect(() => {
        const checkAuth = async () => {
            if (!localStorage.getItem('token')) {
                navigate('/login');
            } else if (localStorage.getItem('token') && !store.isAuth) {
                await store.checkAuth(generateFingerprint());
            }
            setIsAuthChecked(true);
        };
        checkAuth();
    }, []);

    useEffect(() => {
        if(store.isAuth && !isConnected) {
            const ws = new WebSocket(`ws://localhost:5000/${store.user.id}`);
            store.setSocket(ws);
            ws.addEventListener('message', (message) => {
                setConnected(true);
                const msg = JSON.parse(message.data);
                
                if(msg.type !== 'newMessage') { 
                    if(store.activePage === 'people') {
                        setRl(msg)
                    }
                    if(msg.type === 'createFriendFromFollower') {
                        toast.info(`${msg.data.name} ${msg.data.surname} принял вас в друзья`, toastOptions);
                    } else if(msg.type === 'createRequestFriend') {
                        toast.info(`${msg.data.name} ${msg.data.surname} прислал запрос в друзья`, toastOptions);
                    } else if(msg.type === 'daleteRequestFriend') {
                        toast.info(`${msg.data.name} ${msg.data.surname} отменил запрос в друзья`, toastOptions);
                    } else if(msg.type === 'createFollowerFromFriend') {
                        toast.info(`${msg.data.name} ${msg.data.surname} удалил вас из друзей`, toastOptions);
                    }
                } else if(msg.type === 'newMessage'){
                    if(store.activePage === 'msg') {
                        console.log(msg)
                        setNm(msg.data)
                    }
                    toast.info(`${msg.name} ${msg.surname} прислал вам сообщение`, toastOptions);
                }
                
            });
            return () => {
                ws.close();
                setConnected(false);
            };
        }
    }, [store.isAuth, isConnected]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const confirm = params.get('confirm_email');
        if(confirm) toast.success(confirm, toastOptions);
    }, []);

    if(!isAuthChecked) {
        return <></>;
    }

    if(store.isError) {
        navigate('/login');
        store.setError(false);
    }

    return (
        <>
            <HeaderCC />
            <Controller />
            <ToastContainer/>
        </>
    );
}

export default observer(MainPage);