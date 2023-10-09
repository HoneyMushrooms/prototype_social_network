import React, { useState, useContext, useEffect } from "react";
import Content from "./Content";
import Sidebar from "./Sidebar";
import { Context } from "..";
import { observer } from "mobx-react-lite";

const Controller = () => {
    const { store } = useContext(Context);
    const [selectedContent, setSelectedContent] = useState(null);
    const [profileId, setProfileId] = useState(null); 
 
    const handleLinkClick = (content, id) => {
        if (content === selectedContent) {
            setSelectedContent(null);
        } else {
            setSelectedContent(content);
            setProfileId(id);
        }
        store.setActivePage(content);
    }

    return (
        <div style={{display: "flex"}}>
            <Sidebar handleLinkClick={handleLinkClick} selectedContent={selectedContent}/>
            <Content selectedContent={selectedContent} handleLinkClick={handleLinkClick} profileId={profileId} setProfileId={setProfileId}/>
        </div>
    );
};

export default observer(Controller);