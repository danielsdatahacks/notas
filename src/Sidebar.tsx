import React, {useState, useEffect} from 'react';
import BaseNode from './models/baseNode';
import './Stylings/note.css';
//import './Stylings/bear.css';
import marked from 'marked';
import Graph from './models/graph';
import * as regex from './Regex/regex'
import {getHashtagsFromNoteText, getLinkedNodesFromText, updateGraphFromLinksOfNote, updateGraphFromHashtagsOfNote, updateNoteName, removeNoteFromGraph} from './Imports/importUtil'
import { Icon } from '@iconify/react';
import dotsThreeVertical from '@iconify-icons/ph/dots-three-vertical';
import linkSimpleHorizontal from '@iconify-icons/ph/link-simple-horizontal';
import trashIcon from '@iconify-icons/ph/trash';
import xIcon from '@iconify-icons/ph/x';
import { ListGroup, OverlayTrigger, Popover } from 'react-bootstrap';

interface Props {
    Graph: Graph,
    setGraph: React.Dispatch<React.SetStateAction<Graph>>,
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>,
    setCopyNoteToast: React.Dispatch<React.SetStateAction<boolean>>,
    SelectedNodeID: string,
    HashtagDictionary: {[id: string]: BaseNode}
}

function Sidebar(props: Props) {

  const [inEditMode, setInEditMode] = useState(false);
  const [markupHtml, setMarkupHtml] = useState({ __html: ""});
  //const [prevLinkedNotes, setLinkedNotes] = useState([] as Link[]);
  let markdownInput: HTMLTextAreaElement | null;

  //Used when we switch between view mode and edit mode in the sidebar
  useEffect(() => {
    console.log("Edit mode changed.");
    if(inEditMode){
      //Switch to edit mode
      markdownInput?.focus();
      markdownInput?.setSelectionRange(markdownInput?.value.length,markdownInput?.value.length);
    } else {
      //Check whether hashtags and links have been changed
      //Switch to view mode

      let html = {__html: ""};
      if(props.SelectedNodeID in props.Graph.NodeDictionary){

        let tempGraph = props.Graph;
        let selectedNode = tempGraph.NodeDictionary[props.SelectedNodeID];
        let noteName = selectedNode.Text.slice(2, selectedNode.Text.indexOf("\n")); //!Improve that part. TODO.

        //Update name of note
        tempGraph = updateNoteName(selectedNode.ID, noteName, tempGraph);

        //Get the links from the node text
        let linkedNodes = getLinkedNodesFromText(selectedNode.Text, tempGraph.NodeDictionary);
        tempGraph = updateGraphFromLinksOfNote(selectedNode.ID, {ID: selectedNode.ID, Name: noteName}, linkedNodes, tempGraph)

        //Get the hashtags from the node text
        let nodeHashtags = getHashtagsFromNoteText(props.SelectedNodeID, selectedNode.Text, props.Graph.TopicDictionary);
        tempGraph = updateGraphFromHashtagsOfNote(selectedNode.ID, nodeHashtags, tempGraph);

        //Update the graph
        props.setGraph({
          ...tempGraph,
          Energy: 1000
        });

        //Get raw markup from node text.
        let rawMarkup = marked(selectedNode.Text);
        rawMarkup = rawMarkup.replace(regex.hashtagRegEx, function (x) {
          return "<span class=\"hashtag-notas\">" + x + "</span>";
        });
        html = {__html: rawMarkup};
      };
      setMarkupHtml(html);
    }
  }, [inEditMode])

  //Used when we switch between selected nodes
  useEffect(() => {
    console.log("Selected node changed.")
    let html = {__html: ""};
    if(props.SelectedNodeID in props.Graph.NodeDictionary){

      //Get raw markup from node text.
      let rawMarkup = marked(props.Graph.NodeDictionary[props.SelectedNodeID].Text);
      rawMarkup = rawMarkup.replace(regex.hashtagRegEx, function (x) {
        return "<span class=\"hashtag-notas\">" + x + "</span>";
      });
      html = {__html: rawMarkup};
    }
    setMarkupHtml(html);
  }, [props.SelectedNodeID])


  function onClickMarkdownText() {
    setInEditMode(!inEditMode);
  }

  function handleInputChange(e: any) {
    if(props.SelectedNodeID in props.Graph.NodeDictionary){
      props.setGraph({
        ...props.Graph,
        NodeDictionary: {
          ...props.Graph.NodeDictionary,
          [props.SelectedNodeID]: {
            ...props.Graph.NodeDictionary[props.SelectedNodeID],
            Text: e.target.value
          }
        }
      });
    }
  }

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

  const popover = (
    <Popover id="popover-basic">
      <Popover.Content>
        <ListGroup>
          <ListGroup.Item action onClick={copyLinkToClipboard}>
            <Icon width="1.5em" icon={linkSimpleHorizontal} color="rgb(253,107,33)" />
            {" Copy link to note"}
          </ListGroup.Item>
          <ListGroup.Item action onClick={onClickDeleteNote}>
              <Icon width="1.5em" icon={trashIcon} color="rgb(253,107,33)" />
              {"Delete note"}
          </ListGroup.Item>
        </ListGroup>
      </Popover.Content>
    </Popover>
  );

  //https://nice-bay-0a8ac9503.azurestaticapps.net

  return (
    <div 
      className="note-container">
          <div className="note-settings-bar">
            <div className="icon-container" onClick={onClickHideSidebar}>
              <Icon icon={xIcon} />
            </div>
            <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={popover}>
              <div className="download-logo-container">
                <Icon icon={dotsThreeVertical} />
              </div>
            </OverlayTrigger> 
          </div>
          <div className="note-main">
            {inEditMode && 
                <textarea name="textarea" 
                          ref={(input) => {markdownInput = input}} 
                          className="markdown-input"
                          value={props.SelectedNodeID in props.Graph.NodeDictionary ? props.Graph.NodeDictionary[props.SelectedNodeID].Text : ""}
                          onBlur = {onClickMarkdownText} 
                          onChange={handleInputChange}
                ></textarea>
            }
            {!inEditMode &&
              <div onClick = {onClickMarkdownText} dangerouslySetInnerHTML={markupHtml} />
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