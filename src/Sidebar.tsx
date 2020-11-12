import React from 'react';
import Node from '../src/models/node';
import BaseNode from './models/baseNode';
//import './Stylings/note.css';
import './Stylings/bear.css';

interface Props {
    Node: Node
}

function Sidebar(props: Props) {

  return (
    <div className="note-main">
        <h1>{props.Node.Name}</h1>
        <p>
        {props.Node.Hashtags.map((hashtag: string) => 
            <span key={hashtag} className="hashtag">{hashtag}</span>
        )}
        </p>
        <br/>
        <div>{props.Node.Text}</div>
        {props.Node.LinksTowards.map((link: BaseNode) =>
            <a key={link.ID} href={"bear://x-callback-url/open-note?id=" + link.ID}>{link.Name}</a>
        )}
    </div>
  );
};

export default Sidebar;