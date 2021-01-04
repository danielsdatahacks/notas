import React, {useState, useEffect} from 'react';
import BaseNode from '../models/baseNode';
import '../Stylings/note.css';
//import './Stylings/bear.css';
import marked from 'marked';
import Graph from '../models/graph';
import * as regex from '../Regex/regex'
import {getHashtagsFromNoteText, getLinkedNodesFromText, updateGraphFromLinksOfNote, updateGraphFromHashtagsOfNote, updateNoteName, removeNoteFromGraph, unfixTextNodes} from '../Imports/importUtil'
import { Icon } from '@iconify/react';
import dotsThreeVertical from '@iconify-icons/ph/dots-three-vertical';
import linkSimpleHorizontal from '@iconify-icons/ph/link-simple-horizontal';
import trashIcon from '@iconify-icons/ph/trash';
import circlesThree from '@iconify-icons/ph/circles-three';
import xIcon from '@iconify-icons/ph/x';
import { ListGroup, OverlayTrigger, Popover } from 'react-bootstrap';
import NotasLogo from '../Icons/logo512.png';
import SidebarNoteText from './SidebarNoteText';
import SidebarMain from './SidebarMain';
import SidebarNotes from './SidebarNotes';
import { SidebarView } from '../models/sidebarViews';
import notebookIcon from '@iconify-icons/ph/notebook';
import hashIcon from '@iconify-icons/ph/hash';


interface Props {
    Graph: Graph,
    onClickNode(id: string): void,
    setGraph: React.Dispatch<React.SetStateAction<Graph>>,
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>,
    setCopyNoteToast: React.Dispatch<React.SetStateAction<boolean>>,
    SelectedNodeID: string,
    HashtagDictionary: {[id: string]: BaseNode},
    setSidebarView: React.Dispatch<React.SetStateAction<SidebarView>>,
    sidebarView: SidebarView,
    filterHashtagID: string,
    setFilterHashtagID: React.Dispatch<React.SetStateAction<string>>
}

function Sidebar(props: Props) {

  function onClickHideSidebar() {
    props.setShowSidebar(false);
  }

  function onClickDeleteNote() {
    let tempGraph = removeNoteFromGraph(props.SelectedNodeID, props.Graph);
    props.setGraph({
      ...tempGraph,
      Energy: 1000
    });

    props.setShowSidebar(false);
  }

  function copyLinkToClipboard() {
    var tempInput = document.createElement("input");
    if(props.SelectedNodeID in props.Graph.NodeDictionary){
      tempInput.value = "[" + props.Graph.NodeDictionary[props.SelectedNodeID].Name + "]" + "(notasid=" + props.SelectedNodeID + ")";
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      props.setCopyNoteToast(true);
    }
  }

  function onClickNotasLogo() {
    props.setSidebarView(SidebarView.Main);
  }

  function onClickAllNotes() {
    props.setSidebarView(SidebarView.NotesList);
    props.setFilterHashtagID("");
  }

  function onClickHashtag(id: string) {
    props.setSidebarView(SidebarView.NotesList);
    props.setFilterHashtagID(id);
  }

  function onClickRearrangeNodes() {
    props.setGraph({...unfixTextNodes(props.Graph, props.filterHashtagID)});
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Content>
        <ListGroup>
        {props.sidebarView === SidebarView.NotesList &&
            <ListGroup.Item action onClick={onClickRearrangeNodes}>
              <Icon width="1.5em" icon={circlesThree} color="rgb(253,107,33)" />
              {" Rearrange notes"}
            </ListGroup.Item>
          }
          {props.sidebarView === SidebarView.NoteText &&
            <ListGroup.Item action onClick={copyLinkToClipboard}>
              <Icon width="1.5em" icon={linkSimpleHorizontal} color="rgb(253,107,33)" />
              {" Copy link to note"}
            </ListGroup.Item>
          }
          {props.sidebarView === SidebarView.NoteText &&
            <ListGroup.Item action onClick={onClickDeleteNote}>
              <Icon width="1.5em" icon={trashIcon} color="rgb(253,107,33)" />
              {"Delete note"}
            </ListGroup.Item>
          }
          <ListGroup.Item action onClick={onClickHideSidebar}>
              <Icon width="1.5em" icon={xIcon} color="rgb(253,107,33)" />
              {"Hide Sidebar"}
          </ListGroup.Item>
        </ListGroup>
      </Popover.Content>
    </Popover>
  );

  //https://nice-bay-0a8ac9503.azurestaticapps.net

  return (
    <div className="note-container">
          <div className="note-settings-bar">
            <div className="sidebar-settings-container">
              <div className="custom-breadcrumb-item-start" onClick={onClickNotasLogo}>
                <img className="notas-logo" src={NotasLogo} alt=""/>
              </div>
              {/* <div className="sidebar-notas-logo-text">Notas</div> */}
              {(props.sidebarView === SidebarView.NotesList || props.sidebarView === SidebarView.NoteText) && props.filterHashtagID === "" &&
                <React.Fragment>
                  <div className="custom-breadcrumb-seperator">{"/"}</div>
                  <div className="custom-breadcrumb-item" onClick={onClickAllNotes}>
                    <Icon icon={notebookIcon} color="rgb(253,107,33)"/>
                    <div className="sidebar-list-object-text">All notes</div>
                  </div>
                </React.Fragment>
              }
              {(props.sidebarView === SidebarView.NotesList || props.sidebarView === SidebarView.NoteText) && props.filterHashtagID !== "" && props.filterHashtagID in props.Graph.TopicDictionary &&
                <React.Fragment>
                  <div className="custom-breadcrumb-seperator">{"/"}</div>
                  <div className="custom-breadcrumb-item" onClick={() => onClickHashtag(props.filterHashtagID)}>
                    <Icon icon={hashIcon} color="rgb(253,107,33)"/>
                    <div className="sidebar-list-object-text">{props.Graph.TopicDictionary[props.filterHashtagID].Name}</div>
                  </div>
                </React.Fragment>
              }
              {props.sidebarView === SidebarView.NoteText &&
                <React.Fragment>
                  <div className="custom-breadcrumb-seperator">{"/"}</div>
                </React.Fragment>
              }
            </div>
            <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={popover}>
              <div className="download-logo-container">
                <Icon icon={dotsThreeVertical} width="1.2em" color="rgb(253,107,33)"/>
              </div>
            </OverlayTrigger> 
          </div>
          <div className="note-main">
            {props.sidebarView === SidebarView.Main &&
              <SidebarMain 
                setFilterHashtagID={props.setFilterHashtagID}
                setSidebarView={props.setSidebarView} 
                TopicDictionary={props.Graph.TopicDictionary}
              />
            }
            {props.sidebarView === SidebarView.NotesList &&
              <SidebarNotes 
                filterHashtagID={props.filterHashtagID}
                onClickNode={props.onClickNode} 
                setSidebarView={props.setSidebarView} 
                NodeDictionary={props.Graph.NodeDictionary}
                TopicDictionary={props.Graph.TopicDictionary}
              />
            }
            {props.sidebarView === SidebarView.NoteText &&
              <SidebarNoteText 
                Graph={props.Graph} 
                SelectedNodeID={props.SelectedNodeID} 
                setGraph={props.setGraph}
              />
            }
          </div>
    </div>
  );
};

export default Sidebar;

/*
{/* <h1>{props.SelectedNode.Name}</h1>
<p>
  {props.SelectedNode.Hashtags.map((hashtagID: string) => 
    (hashtagID in props.HashtagDictionary) && 
      <span key={hashtagID} className="hashtag">{props.HashtagDictionary[hashtagID].Name}</span>
  )}
</p>
<br/>
<div>{props.SelectedNode.Text}</div>
{props.SelectedNode.LinksTowards.map((link: Link) =>
    <a key = {link.ID} href={"bear://x-callback-url/open-note?id=" + link.ID}>{link.Name}</a>
)} 
*/