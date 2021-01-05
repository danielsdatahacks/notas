import React, {useState, useEffect} from 'react';
import { getHashtagsFromNoteText, getLinkedNodesFromText, updateGraphFromHashtagsOfNote, updateGraphFromLinksOfNote, updateNoteName } from '../Imports/importUtil';
import Graph from '../models/graph';
import * as regex from '../Regex/regex';
import marked from 'marked';

interface Props {
    Graph: Graph,
    SelectedNodeID: string,
    setGraph: React.Dispatch<React.SetStateAction<Graph>>
}

function SidebarNoteText(props: Props) {

    const [inEditMode, setInEditMode] = useState(false);
    const [markupHtml, setMarkupHtml] = useState({ __html: ""});

    let markdownInput: HTMLTextAreaElement | null;

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
            let nodeHashtags = getHashtagsFromNoteText(props.SelectedNodeID, selectedNode.Text, props.Graph);
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

    return (
        <React.Fragment>
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
        </React.Fragment>
    );
}

export default SidebarNoteText