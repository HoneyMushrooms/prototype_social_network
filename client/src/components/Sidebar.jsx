import React, { useContext, useEffect } from "react";
import styles from '../styles/Sidebar.module.css';
import { Context } from "..";
import { observer } from 'mobx-react-lite';

const Sidebar = ({ handleLinkClick, selectedContent }) => {

    const { store } = useContext(Context);
    
    return (
        <div className={styles.block}>
            <ul className={styles.list}>
                <li className={selectedContent === 'profile' ? styles.selected : ''} onClick={() => handleLinkClick('profile')}>Мой Профиль</li><hr/>
                <li className={selectedContent === 'news' ? styles.selected : ''} onClick={() => handleLinkClick('news')}>Новости</li><hr/>
                <li className={selectedContent === 'msg' ? styles.selected : ''} onClick={() => handleLinkClick('msg')}>Сообщения</li><hr/>
                <li className={selectedContent === 'people' ? styles.selected : ''} onClick={() => handleLinkClick('people')}>Люди</li>
            </ul>
        </div>
    );
};

export default observer(Sidebar);