import React, { useContext } from "react";
import { observer } from 'mobx-react-lite';
import { Context } from "../..";
import styles from '../../styles/Hello.module.css';

const Hello = () => {
    const { store } = useContext(Context);

    return (
        <h1 className={styles.hello}>Добро пожаловать, {store.user.name} {store.user.surname}!</h1>
    )
}

export default observer(Hello);