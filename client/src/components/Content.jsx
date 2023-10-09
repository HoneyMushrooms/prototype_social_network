import React from 'react';
import Hello from './default/Hello';
import styles from '../styles/Content.module.css';
import Profile from './profile/Profile';
import Edit from './profile/Edit';
import People from './people/People';
import OtherProfile from './profile/OtherProfile';
import News from './News';
import Conversations from './message/Conversations';

const Content = ({ selectedContent, handleLinkClick, profileId }) => {

    let component = <Hello />;

    if(selectedContent === 'profile') {
        component = <Profile handleLinkClick={handleLinkClick}/>;
    } else if(selectedContent === 'edit') {
        component = <Edit handleLinkClick={handleLinkClick}/>;
    } else if(selectedContent === 'people') {
        component = <People handleLinkClick={handleLinkClick}/>;
    } else if(selectedContent === 'other_profile') {
        component = <OtherProfile profileId={profileId}/>;
    } else if(selectedContent === 'news') {
        component = <News handleLinkClick={handleLinkClick}/>;
    }  else if(selectedContent === 'msg') {
        component = <Conversations handleLinkClick={handleLinkClick}/>;
    } 


    return (
        <div className={styles.block}>{component}</div>
    )
};

export default Content;