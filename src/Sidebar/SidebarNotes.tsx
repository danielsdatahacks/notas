import React, {useEffect} from 'react';
import BaseNode from '../models/baseNode';
import Node from '../models/node';
import { SidebarView } from '../models/sidebarViews';

interface Props {
    NodeDictionary:  {[id: string]: Node},
    TopicDictionary: {[id: string]: BaseNode},
    onClickNode(id: string): void,
    setSidebarView: React.Dispatch<React.SetStateAction<SidebarView>>,
    filterHashtagID: string
}

function SidebarNotes(props: Props) {

    function onClickNote(id: string) {
        props.onClickNode(id);
        props.setSidebarView(SidebarView.NoteText);
    }

    return (
        <div className="sidebar-notes-container">
            {
                Object.keys(props.NodeDictionary).map((id: string)=> 
                (props.filterHashtagID === "" || props.NodeDictionary[id].Hashtags.includes(props.filterHashtagID)) &&
                    <div key={id} onClick={() => onClickNote(id)} className="sidebar-list-object-container">
                        {props.NodeDictionary[id].Name}
                    </div>
                )
            }
        </div>
    );
}

export default SidebarNotes;