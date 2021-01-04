import BaseNode from "../models/baseNode";
import Node from "../models/node";
import Link from "../models/link";
import NodeHashtags from "../models/nodeHashtags";
import * as regex from '../Regex/regex'
import Graph from "../models/graph";

//This function extracts the hashtags from the noteText and updates the global hashtagDict if necessary.
export const getHashtagsFromNoteText = (noteID: string, noteText: string, hashtagDict: {[id: string]: BaseNode}): NodeHashtags => {

    let nodeHashtags: NodeHashtags = {HashtagDict: {}, Hashtags: [] as string []};

    let hashtagDictTemp = hashtagDict;
    let hashtagsOfCurrentNote: string[] = [];
    let regExHashtagMatch: RegExpMatchArray | null = noteText.match(regex.hashtagRegEx);
    if(regExHashtagMatch !== null){
      for(let i in regExHashtagMatch){
        let hashtag: string = regExHashtagMatch[i];
        hashtag = hashtag.slice(1,hashtag.length);
        //Check whether global hashtagDict has to be extended and collect hashtags for current note.
        let hashtagIsNew: boolean = true;
        for(let hashtagID in hashtagDictTemp){
          if(hashtagDictTemp[hashtagID].Name === hashtag){
            hashtagIsNew = false;
            hashtagsOfCurrentNote.push(hashtagID);
            hashtagDictTemp[hashtagID].LinksTowards.push({ID: noteID, Name: ""});
          }
        }
        if(hashtagIsNew){
          let newHashtagID: string = (Object.keys(hashtagDictTemp).length + 1).toString();
          hashtagsOfCurrentNote.push(newHashtagID);
          let newHashtagNode: Node = {
            ID: newHashtagID,
            Name: hashtag,
            Text: "",
            Hashtags: [],
            X: Math.floor(Math.random() * Math.floor(15000)),
            Y: Math.floor(Math.random() * Math.floor(15000)),
            IsFixed: false,
            LinksTowards: [{ID: noteID, Name: ""}], //This will be computed later
            LinksFrom: [] as Link[]  //This will be computed later
          };
          hashtagDictTemp[newHashtagID] = newHashtagNode;
        }
      } 
    }

    nodeHashtags.HashtagDict = hashtagDictTemp;
    nodeHashtags.Hashtags = hashtagsOfCurrentNote;

    return nodeHashtags;
}

//Get the linked nodes from the note text. Only linked node IDs are returned that exist in the global node dictionary.
export const getLinkedNodesFromText = (noteText: string, nodeDictionary: {[id: string]: Node}): Link[] => {

    let linkIDs: Link[] = [];
    noteText.match(regex.linkRegEx)?.forEach((link: string) => {

      //Get ID of link
      let idMatch: RegExpExecArray | null = /id=.+\)/g.exec(link); //!WEIRD BUG HERE! WHEN I USE THE regex.idRegEx here it sometimes does not work
      let newID: string | null = "";
      if(idMatch !== null){
        newID = idMatch[0];
      }
      //Get name of link
      let linkNameMatch: RegExpExecArray | null = regex.linkNameRegEx.exec(link);
      let newLinkName: string | null = "";
      if(linkNameMatch !== null){
        newLinkName = linkNameMatch[0];
      }

      //Add the ID if it exists in the global node dictionary
      if(newID !== null && newID.length > 4)
      {
        newID = newID.slice(3,newID.length-1); //Take ... from id=...)
        if(!(linkIDs.map(function(el){return el.ID}).includes(newID)) && (newID in nodeDictionary)){
          linkIDs.push({ID: newID, Name: newLinkName});
        }
      }
      
    });

    return linkIDs;
}

//Given the links from a note update the graph
export const updateGraphFromLinksOfNote = (noteID: string, linkToNote: Link, linksOfNote: Link[], graph: Graph): Graph => {

    let tempGraph = graph;

    if(noteID in tempGraph.NodeDictionary){

        //Store previous links
        let previousLinksOfNote = graph.NodeDictionary[noteID].LinksTowards;

        //Set LinksFrom from given note
        tempGraph = {
            ...tempGraph,
            NodeDictionary: {
                ...tempGraph.NodeDictionary,
                [noteID]: {
                    ...tempGraph.NodeDictionary[noteID],
                    LinksTowards: linksOfNote
                }
            }
        }

        //Get list of links that need to be removed
        let linksToRemove: Link[] = [];
        for(let i: number = 0; i < previousLinksOfNote.length; i++){
            let linkExists = linksOfNote.map(function(el){return el.ID}).includes(previousLinksOfNote[i].ID);
            if(!linkExists){
                linksToRemove.push(previousLinksOfNote[i]);
            }
        }

        //Remove links that have to be removed
        for(let i: number = 0; i < linksToRemove.length; i++){
            if(linksToRemove[i].ID in tempGraph.NodeDictionary){
                let linksFrom = tempGraph.NodeDictionary[linksToRemove[i].ID].LinksFrom;
                const index = linksFrom.map(function(el){return el.ID}).indexOf(noteID);
                if (index > -1) {
                    linksFrom.splice(index, 1);
                    tempGraph = {
                        ...tempGraph,
                        NodeDictionary: {
                            ...tempGraph.NodeDictionary,
                            [linksToRemove[i].ID]: {
                                ...tempGraph.NodeDictionary[linksToRemove[i].ID],
                                LinksFrom: linksFrom
                            }
                        }
                    }
                }
            }
        }
    
        //Update the links in the linked notes.
        for(let i: number = 0; i < linksOfNote.length; i++){
            if(linksOfNote[i].ID in tempGraph.NodeDictionary){
                let linkExists = tempGraph.NodeDictionary[linksOfNote[i].ID].LinksFrom.map(function(el){return el.ID}).includes(linkToNote.ID);
                if(!(linkExists)){
                    tempGraph = {
                        ...tempGraph,
                        NodeDictionary: {
                          ...tempGraph.NodeDictionary,
                          [linksOfNote[i].ID]: {
                            ...tempGraph.NodeDictionary[linksOfNote[i].ID],
                            LinksFrom: [...tempGraph.NodeDictionary[linksOfNote[i].ID].LinksFrom, linkToNote]
                          }
                        }
                    };
                }
            }
        }
    }

    return tempGraph;
}

export const updateGraphFromHashtagsOfNote = (noteID: string, nodeHashtags: NodeHashtags, graph: Graph): Graph => {

    let tempGraph = graph;

    if(noteID in tempGraph.NodeDictionary){
        tempGraph = {
            ...tempGraph,
              Energy: 1000,
              NodeDictionary: {
                ...tempGraph.NodeDictionary,
                [noteID]: {
                  ...tempGraph.NodeDictionary[noteID],
                  Hashtags: nodeHashtags.Hashtags
                }
            },
            TopicDictionary: nodeHashtags.HashtagDict
        };
    }

    return tempGraph;

};

export const updateNoteName = (noteID: string, noteName: string, graph: Graph): Graph => {
    let tempGraph = graph;

    if(noteID in tempGraph.NodeDictionary){
        tempGraph = {
            ...tempGraph,
            NodeDictionary: {
                ...tempGraph.NodeDictionary,
                [noteID]: {
                    ...tempGraph.NodeDictionary[noteID],
                    Name: noteName
                }
            }
        }
    }

    return tempGraph;
}

//Removes the note from the dictionary
//Removes links from and towards the given node
//Removes the links from the hashtags
export const removeNoteFromGraph = (noteID: string, graph: Graph): Graph => {
    let tempGraph = graph;

    if(noteID in tempGraph.NodeDictionary){

        let hashtags = tempGraph.NodeDictionary[noteID].Hashtags;
        let linksTowards = tempGraph.NodeDictionary[noteID].LinksTowards;
        let linksFrom = tempGraph.NodeDictionary[noteID].LinksFrom;

        //Remove node
        delete tempGraph.NodeDictionary[noteID];

        //Remove hashtag links
        for(let i: number = 0; i < hashtags.length; i++){
            if(hashtags[i] in tempGraph.TopicDictionary){
                let hashtagLinksTowards = tempGraph.TopicDictionary[hashtags[i]].LinksTowards;
                const index = hashtagLinksTowards.map(function(el){return el.ID}).indexOf(noteID);
                if (index > -1) {
                    hashtagLinksTowards.splice(index, 1);
                    tempGraph = {
                        ...tempGraph,
                        TopicDictionary: {
                            ...tempGraph.TopicDictionary,
                            [hashtags[i]]: {
                                ...tempGraph.TopicDictionary[hashtags[i]],
                                LinksTowards: hashtagLinksTowards
                            }
                        }
                    }
                }
            }
        }

        //Remove links from the given note
        for(let i: number = 0; i < linksTowards.length; i++){
            if(linksTowards[i].ID in tempGraph.NodeDictionary){
                let nodeLinksFrom = tempGraph.NodeDictionary[linksTowards[i].ID].LinksFrom;
                const index = nodeLinksFrom.map(function(el){return el.ID}).indexOf(noteID);
                if (index > -1) {
                    nodeLinksFrom.splice(index, 1);
                    tempGraph = {
                        ...tempGraph,
                        NodeDictionary: {
                            ...tempGraph.NodeDictionary,
                            [linksTowards[i].ID]: {
                                ...tempGraph.NodeDictionary[linksTowards[i].ID],
                                LinksFrom: nodeLinksFrom
                            }
                        }
                    }
                }
            }
        }

        //Remove links towards the given note
        for(let i: number = 0; i < linksFrom.length; i++){
            if(linksFrom[i].ID in tempGraph.NodeDictionary){
                let nodeLinksTowards = tempGraph.NodeDictionary[linksFrom[i].ID].LinksTowards;
                const index = nodeLinksTowards.map(function(el){return el.ID}).indexOf(noteID);
                if (index > -1) {
                    nodeLinksTowards.splice(index, 1);
                    tempGraph = {
                        ...tempGraph,
                        NodeDictionary: {
                            ...tempGraph.NodeDictionary,
                            [linksFrom[i].ID]: {
                                ...tempGraph.NodeDictionary[linksFrom[i].ID],
                                LinksTowards: nodeLinksTowards
                            }
                        }
                    }
                }
            }
        }
    }

    return tempGraph;
}

//If filterHashtagID === "" all node positions will be unfixed.
export const unfixTextNodes = (graph: Graph, filterHashtagID: string): Graph => {
    let tempGraph = graph;

    if(filterHashtagID === ""){
        Object.keys(tempGraph.NodeDictionary).map((id: string) => {
            if(tempGraph.NodeDictionary[id].IsFixed) {
                tempGraph = {
                    ...tempGraph,
                    NodeDictionary: {
                        ...tempGraph.NodeDictionary,
                        [id]: {
                            ...tempGraph.NodeDictionary[id],
                            IsFixed: false
                        }
                    }
                }
            }
        });
    } else if (filterHashtagID !== "" && filterHashtagID in graph.TopicDictionary) {
        for(let i: number = 0; i < graph.TopicDictionary[filterHashtagID].LinksTowards.length; i++){
            let noteID = graph.TopicDictionary[filterHashtagID].LinksTowards[i].ID;
            if(noteID in graph.NodeDictionary && graph.NodeDictionary[noteID].IsFixed){
                tempGraph = {
                    ...tempGraph,
                    NodeDictionary: {
                        ...tempGraph.NodeDictionary,
                        [noteID]: {
                            ...tempGraph.NodeDictionary[noteID],
                            IsFixed : false
                        }
                    }
                }
            }
        }
    }

    //Increase energy so that nodes are rearranged.
    tempGraph = {...tempGraph, Energy: 1000};

    return tempGraph;
}

export const fixAllNodes = (graph: Graph): Graph | null => {
    let tempGraph = graph;

    let unfixedNodeExists = false;

    Object.keys(tempGraph.NodeDictionary).map((id: string) => {
        if(!tempGraph.NodeDictionary[id].IsFixed) {
            unfixedNodeExists = true;
            tempGraph = {
                ...tempGraph,
                NodeDictionary: {
                    ...tempGraph.NodeDictionary,
                    [id]: {
                        ...tempGraph.NodeDictionary[id],
                        IsFixed: true
                    }
                }
            }
        }
    })

    Object.keys(tempGraph.TopicDictionary).map((id: string) => {
        if(!tempGraph.TopicDictionary[id].IsFixed) {
            unfixedNodeExists = true;
            tempGraph = {
                ...tempGraph,
                TopicDictionary: {
                    ...tempGraph.TopicDictionary,
                    [id]: {
                        ...tempGraph.TopicDictionary[id],
                        IsFixed: true
                    }
                }
            }
        }
    })

    if(unfixedNodeExists) {
        return tempGraph;
    } else {
        return null;
    }
}