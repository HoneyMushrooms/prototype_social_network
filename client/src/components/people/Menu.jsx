import styles from '../../styles/Menu.module.css';
import { Context } from '../..';
import { useContext } from 'react'; 
import { observer } from 'mobx-react-lite';

const Menu = ({ selectedMenu, setSelectedMenu }) => {
    
    const { store } = useContext(Context);

    return (
        <div className={styles.container}>
            <ul className={styles.word_list}>
                <li className={selectedMenu === 'find' ? styles.selected : ''} onClick={() => setSelectedMenu('find')}>Поиск</li>
                <li className={selectedMenu === 'friend' ? styles.selected : ''} onClick={() => setSelectedMenu('friend')}>Друзья</li>
                <li className={selectedMenu === 'subscriber' ? styles.selected : ''} onClick={() => setSelectedMenu('subscriber')}>Подписки</li>
                <li className={selectedMenu === 'follower' ? styles.selected : ''} onClick={() => setSelectedMenu('follower')}>Подписчики</li>
            </ul>
        </div>
    )
}

export default observer(Menu);