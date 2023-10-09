import React, { useContext } from "react";
import logo from '../img/logo.png';
import exitIcon from '../img/exit.png';
import styles from '../styles/Header.module.css';
import { Context } from "..";
import { observer } from 'mobx-react-lite';
import generateFingerprint from "../utils/fingerprint";
import { useNavigate } from 'react-router-dom';

const HeaderCC = () => {

    const navigate = useNavigate();
    const { store } = useContext(Context);

    const handleSubmit = async () => {
        try {
            await store.logout(generateFingerprint());
            store.socket.close();
            navigate('/login');
        } catch(e) {
            console.log(e);
        }
    }

    return (
        <div className={styles.header}>
            <img className={styles.logo} src={logo} alt="Logo"/>
            <h1>CherryConnect</h1>
            <div className={styles.spacer}></div>
            <img className={styles.exit_icon} src={exitIcon} alt="Exit" onClick={handleSubmit}/>
        </div>
    );
};

export default observer(HeaderCC);