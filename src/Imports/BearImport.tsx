import Graph from '../models/graph';
import Link from '../models/link';
import BaseNode from '../models/baseNode';
import Node from '../models/node';

export const bearImport = async (graph: Graph): Promise<Graph> => {

let tempGraph = graph;
tempGraph.Energy = 1000;

const dirHandle = await window.showDirectoryPicker();
for await (const entry of dirHandle.values()) {
  //console.log(entry.name);
  if(entry.kind === "directory") {
    let dirHandle2 = await dirHandle.getDirectoryHandle(entry.name);
    let fileHandleInfo: FileSystemHandle = await dirHandle2.getFileHandle("info.json");
    let infoFile: File = await fileHandleInfo.getFile();
    //Regex expressions for the import
    let linkRegEx: RegExp = /\[.+\]+\([a-zA-Z\:\/\-\?]+id=+[A-Za-z0-9\-]+\)/g;
    let idRegEx: RegExp = /id=.+\)/g;
    let linkNameRegEx: RegExp = /\[.+\]/g;
    let hashtagRegEx: RegExp = /\B(\#[a-zA-Z/_\Ä\ä\Ö\ö\Ü\ü]+)(?!;)/g;
    //1. Get information of current note
    let infoJson: any = JSON.parse(await infoFile.text());
    let noteID: string = infoJson["net.shinyfrog.bear"]["uniqueIdentifier"];
    let fileHandleText: FileSystemHandle = await dirHandle2.getFileHandle("text.txt");
    let file: File = await fileHandleText.getFile();
    let noteText: string = await file.text();
    let noteName = noteText.slice(2, noteText.indexOf("\n"));
    let link: Link = {ID: noteID, Name: noteName};
    //Update the global hashtagDictionary and collect hashtags for current note
    let hashtagDict: {[id: string]: BaseNode} = tempGraph.TopicDictionary;
    let hashtagsOfCurrentNote: string[] = [];
    let regExHashtagMatch: RegExpMatchArray | null = noteText.match(hashtagRegEx);
    if(regExHashtagMatch !== null){
      for(let i in regExHashtagMatch){
        let hashtag: string = regExHashtagMatch[i];
        //Check whether global hashtagDict has to be extended and collect hashtags for current note.
        let hashtagIsNew: boolean = true;
        for(let hashtagID in hashtagDict){
          if(hashtagDict[hashtagID].Name === hashtag){
            hashtagIsNew = false;
            hashtagsOfCurrentNote.push(hashtagID);
            hashtagDict[hashtagID].LinksTowards.push({ID: noteID, Name: ""});
          }
        }
        if(hashtagIsNew){
          let newHashtagID: string = (Object.keys(hashtagDict).length + 1).toString();
          hashtagsOfCurrentNote.push(newHashtagID);
          let newHashtagNode: Node = {
            ID: newHashtagID,
            Name: hashtag,
            Text: "",
            Hashtags: [],
            X: Math.floor(Math.random() * Math.floor(15000)),
            Y: Math.floor(Math.random() * Math.floor(15000)),
            LinksTowards: [{ID: noteID, Name: ""}], //This will be computed later
            LinksFrom: [] as Link[]  //This will be computed later
          };
          hashtagDict[newHashtagID] = newHashtagNode;
        }
      } 
    }
    //2. Get linked notes as list https://regexr.com
    let linkIDs: Link[] = [];
    noteText.match(linkRegEx)?.forEach((link: string) => {
      //console.log(link);
      //Get ID of link
      let idMatch: RegExpExecArray | null = idRegEx.exec(link);
      let newID: string | null = "";
      if(idMatch !== null){
        newID = idMatch[0];
      }
      //Get name of link
      let linkNameMatch: RegExpExecArray | null = linkNameRegEx.exec(link);
      let newLinkName: string | null = "";
      if(linkNameMatch !== null){
        newLinkName = linkNameMatch[0];
      }
      if(newID !== null && newID !== "" &&!(linkIDs.map(function(el){return el.ID}).includes(newID))){
        linkIDs.push({ID: newID.slice(3,newID.length-1), Name: newLinkName});
      }
      // link.match(idRegEx)?.forEach((id: string) => {
      //   let newID: string = id.slice(3,id.length-1);
      //   if(!(linkIDs.map(function(el){return el.ID}).includes(newID))){ //!!! Maybe too slow this check.
      //     linkIDs.push({ID: id.slice(3,id.length-1), Name: ""});
      //   }
      
    });
    //console.log("New link");
    //Get plain note text
    noteText = noteText.slice(noteText.indexOf("\n"), noteText.length);
    noteText = noteText.replace(hashtagRegEx, '');
    noteText = noteText.replace(linkRegEx, '');

    //3. Create new node with connections. Or update existing node.
    if(!(noteID in tempGraph.NodeDictionary)){
      tempGraph = { 
        ...tempGraph,
        TopicDictionary: hashtagDict,
        NodeDictionary: {
            ...tempGraph.NodeDictionary,
            [noteID]: {
                ID: noteID,
                Name: noteName,
                Text: noteText,
                Hashtags: hashtagsOfCurrentNote,
                X: Math.floor(Math.random() * Math.floor(15000)),
                Y: Math.floor(Math.random() * Math.floor(15000)),
                LinksTowards: linkIDs,
                LinksFrom: []
              }
        }
      } 
    } else {
      tempGraph = { 
        ...tempGraph,
        NodeDictionary: {
            ...tempGraph.NodeDictionary,
            [noteID]: {
                ID: noteID,
                Name: noteName,
                Text: noteText,
                Hashtags: [...tempGraph.NodeDictionary[noteID].Hashtags, ...hashtagsOfCurrentNote],
                X: tempGraph.NodeDictionary[noteID].X,
                Y: tempGraph.NodeDictionary[noteID].Y,
                LinksTowards: [...tempGraph.NodeDictionary[noteID].LinksTowards, ...linkIDs],
                LinksFrom: tempGraph.NodeDictionary[noteID].LinksFrom
              }
        }
      } 
    }
    //4. Construct the connected nodes if necessary.
    for(let i: number = 0; i < linkIDs.length; i++){
      if(linkIDs[i].ID in tempGraph.NodeDictionary){
        tempGraph = {
          ...tempGraph,
          NodeDictionary: {
            ...tempGraph.NodeDictionary,
            [linkIDs[i].ID]: {
              ...tempGraph.NodeDictionary[linkIDs[i].ID],
              LinksFrom: [...tempGraph.NodeDictionary[linkIDs[i].ID].LinksFrom, link]
            }
          }
        };
      }
      else{
        tempGraph = {
          ...tempGraph,
          NodeDictionary: {
            ...tempGraph.NodeDictionary,
            [linkIDs[i].ID]: {
              ID: linkIDs[i].ID,
              Name: "",
              Text: "",
              Hashtags: [],
              X: Math.floor(Math.random() * Math.floor(15000)),
              Y: Math.floor(Math.random() * Math.floor(15000)),
              LinksTowards: [] as Link[],
              LinksFrom: [link]
            }
          }
        };
      }
    }
  }
}
return tempGraph;
}
