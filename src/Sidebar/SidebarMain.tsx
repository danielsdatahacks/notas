import React, {useState, useEffect} from 'react';
import BaseNode from '../models/baseNode';
import { SidebarView } from '../models/sidebarViews';
import Sidebar from './Sidebar';
import notebookIcon from '@iconify-icons/ph/notebook';
import hashIcon from '@iconify-icons/ph/hash';
import Icon from '@iconify/react';

interface Props {
    TopicDictionary: {[id: string]: BaseNode},
    setSidebarView: React.Dispatch<React.SetStateAction<SidebarView>>,
    setFilterHashtagID: React.Dispatch<React.SetStateAction<string>>
}

function SidebarMain(props: Props) {

    function onClickAllNotes() {
        props.setSidebarView(SidebarView.NotesList);
        props.setFilterHashtagID("");
    }

    function onClickHashtag(id: string) {
        props.setSidebarView(SidebarView.NotesList);
        props.setFilterHashtagID(id);
    }

    return (
        <div className="sidebar-main-container">
            <div className="sidebar-list-object-container" onClick={onClickAllNotes}>
                <Icon icon={notebookIcon} color="rgb(253,107,33)"/>
                <div className="sidebar-list-object-text">All notes</div>
            </div>
            {
                Object.keys(props.TopicDictionary).map((key: string) => 
                    <div key={key} className="sidebar-list-object-container" onClick={() => onClickHashtag(key)}>
                        <Icon icon={hashIcon} color="rgb(253,107,33)"/>
                        <div className="sidebar-list-object-text">{props.TopicDictionary[key].Name}</div>
                    </div>
                )
            }
        </div>
    );
}

export default SidebarMain