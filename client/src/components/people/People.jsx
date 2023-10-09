import Menu from './Menu.jsx';
import { useContext, useState } from 'react';
import ListPeople from './ListPeople';
import FindPeople from './FindPeople.jsx';
import { Context } from '../../index.js';
import { observer } from 'mobx-react-lite';

const People = ({ handleLinkClick }) => {

    const { store } = useContext(Context);
    const [selectedMenu, setSelectedMenu] = useState('find');
    const [find, setFind] = useState([]);

    const handleMenuClick = (component) => {
        setSelectedMenu(component);
    }

    return (
        <>
            <Menu setSelectedMenu={handleMenuClick} selectedMenu={selectedMenu}/>
            {selectedMenu === 'find' && <FindPeople setFind={setFind}/>}
            <ListPeople selectedMenu={selectedMenu} find={find} handleLinkClick={handleLinkClick}/>
        </>
    )
}

export default observer(People);