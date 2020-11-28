import React, {useState} from 'react';
import Node from '../src/models/node';
import BaseNode from './models/baseNode';
import Customer from './models/Customer';
import Graph from './models/graph';
//import './Stylings/note.css';
import './Stylings/bear.css';

interface Props {
    SelectedNode: Node,
    HashtagDictionary: {[id: string]: Node}
}

function Sidebar(props: Props) {

  //https://nice-bay-0a8ac9503.azurestaticapps.net

  return (
    <div 
      className="note-main">
        <h1>{props.SelectedNode.Name}</h1>
        <p>
          {props.SelectedNode.Hashtags.map((hashtagID: string) => 
            (hashtagID in props.HashtagDictionary) && 
              <span key={hashtagID} className="hashtag">{props.HashtagDictionary[hashtagID].Name}</span>
          )}
        </p>
        <br/>
        <div>{props.SelectedNode.Text}</div>
        {props.SelectedNode.LinksTowards.map((link: BaseNode) =>
            <a key = {link.ID} href={"bear://x-callback-url/open-note?id=" + link.ID}>{link.Name}</a>
        )}
    </div>
  );
};

export default Sidebar;