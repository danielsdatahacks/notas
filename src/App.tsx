import React, {useState, useEffect} from 'react';
//import logo from './logo.svg';
import './Stylings/App.css';
import './Stylings/note.css';
import './Stylings/dropdown.css';
import NotasLogo from './Icons/logo512.png';
import Filter from './Icons/filter_extreme_orange.png';
import DownloadLogo from './Icons/download-logo'
import Graph from './models/graph';
import Node from './models/node';
import NotasGraph from './Graphs/NotasGraph'
import ForceTransform from './Graphs/SpringElectrical';
import Sidebar from './Sidebar'
import BaseNode from './models/baseNode';
import Hammer from 'hammerjs';
//import '../src/Stylings/bear.css'

// let graphData : Graph = {
//   Energy: 10000000,
//   NodeDictionary: {
//       "id1": {
//           ID: "id1",
//           Name: "",          
//           Text: "",
//           X: 1101,
//           Y: 1101,
//           LinksTowards: ["id2"],
//           LinksFrom: []
//       },
//       "id2": {
//           ID: "id2",
//           Name: "",  
//           Text: "",
//           X: 1501,
//           Y: 1501,
//           LinksTowards: ["id3", "id4", "id5", "id6", "id7"],
//           LinksFrom: ["id1"]
//       },
//       "id3": {
//           ID: "id3",
//           Name: "",  
//           Text: "",
//           X: 1301,
//           Y: 1301,
//           LinksTowards: [],
//           LinksFrom: ["id2"]
//       },
//       "id4": {
//           ID: "id4",
//           Name: "",  
//           Text: "",
//           X: 1151,
//           Y: 1251,
//           LinksTowards: [],
//           LinksFrom: ["id2"]
//       },
//       "id5": {
//           ID: "id5",
//           Name: "",  
//           Text: "",
//           X: 1161,
//           Y: 1251,
//           LinksTowards: [],
//           LinksFrom: ["id2"]
//       },
//       "id6": {
//           ID: "id6",
//           Name: "",  
//           Text: "",
//           X: 1161,
//           Y: 1281,
//           LinksTowards: [],
//           LinksFrom: ["id2"]
//       },
//       "id7": {
//           ID: "id7",
//           Name: "",  
//           Text: "",
//           X: 1261,
//           Y: 1251,
//           LinksTowards: [],
//           LinksFrom: ["id2"]
//       },
//       "id8": {
//           ID: "id8",
//           Name: "",  
//           Text: "",
//           X: 1262,
//           Y: 1451,
//           LinksTowards: [],
//           LinksFrom: ["id9"]
//       },
//       "id9": {
//           ID: "id9",
//           Name: "",  
//           Text: "",
//           X: 165,
//           Y: 152,
//           LinksTowards: ["id8"],
//           LinksFrom: []
//       },
//       "id10": {
//           ID: "id10",
//           Name: "",  
//           Text: "",
//           X: 1266,
//           Y: 1251,
//           LinksTowards: [],
//           LinksFrom: ["id11"]
//       },
//       "id11": {
//           ID: "id11",
//           Name: "",  
//           Text: "",
//           X: 155,
//           Y: 132,
//           LinksTowards: ["id10"],
//           LinksFrom: []
//       }
//   }
// }

function App() {

  const [graph, setGraph]: [Graph, React.Dispatch<React.SetStateAction<Graph>>] = useState({Energy: 1000, NodeDictionary: {}});
  const [selectedNode, selectNode]: [Node, React.Dispatch<React.SetStateAction<Node>>] = useState({ID: "", Name: "", Text: "", Hashtags: [] as string[], X: 0, Y: 0, LinksTowards: [] as BaseNode[], LinksFrom: [] as BaseNode[]});
  const [searchInput, setSearchInput]: [string, React.Dispatch<React.SetStateAction<string>>] = useState("");
  const [filterHashtag, setFilterHashtag]: [string, React.Dispatch<React.SetStateAction<string>>] = useState("");
  const [highlightedHashtag, setHighlightHashtag]: [string, React.Dispatch<React.SetStateAction<string>>] = useState("");
  
  // async function onClick() {
  //   let fileHandle: FileSystemFileHandle;
  //   [fileHandle] = await window.showOpenFilePicker();
  //   const file: File = await fileHandle.getFile();
  //   console.log(file);
  //   const contents: string = await file.text();
  //   setText(contents);
  // }

  async function onClickBearImport () {

    let tempGraph = graph;

    const dirHandle = await window.showDirectoryPicker();
    for await (const entry of dirHandle.values()) {
      //console.log(entry.name);
      if(entry.kind === "directory") {
        let dirHandle2 = await dirHandle.getDirectoryHandle(entry.name);
        let fileHandleInfo: FileSystemHandle = await dirHandle2.getFileHandle("info.json");
        let infoFile: File = await fileHandleInfo.getFile();

        //1. Get information of current note
        let infoJson: any = JSON.parse(await infoFile.text());
        let noteID: string = infoJson["net.shinyfrog.bear"]["uniqueIdentifier"];
        let fileHandleText: FileSystemHandle = await dirHandle2.getFileHandle("text.txt");
        let file: File = await fileHandleText.getFile();
        let noteText: string = await file.text();
        let noteName = noteText.slice(2, noteText.indexOf("\n"));
        let noteBase: BaseNode = {ID: noteID, Name: noteName};

        //console.log(noteID);
        //console.log(noteName);

        //2. Get linked notes as list https://regexr.com
        let linkRegEx: RegExp = /\[.+\]+\([a-zA-Z\:\/\-\?]+id=+[A-Za-z0-9\-]+\)/g;
        let idRegEx: RegExp = /id=.+\)/g;
        let linkNameRegEx: RegExp = /\[.+\]/g;
        let hashtagRegEx: RegExp = /\B(\#[a-zA-Z/_\Ä\ä\Ö\ö\Ü\ü]+)(?!;)/g;
        let linkIDs: BaseNode[] = [];
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

        //Get hashtags
        let hashtags: string[] = [];
        noteText.match(hashtagRegEx)?.forEach((hashtag: string) => {
          console.log(hashtag);
          hashtags.push(hashtag);
        });

        //Get plain note text
        noteText = noteText.slice(noteText.indexOf("\n"), noteText.length);
        noteText = noteText.replace(hashtagRegEx, '');
        noteText = noteText.replace(linkRegEx, '');

        //3. Create new node with connections. Or update existing node.
        if(!(noteID in tempGraph.NodeDictionary)){
          tempGraph = { 
            ...tempGraph,
            NodeDictionary: {
                ...tempGraph.NodeDictionary,
                [noteID]: {
                    ID: noteID,
                    Name: noteName,
                    Text: noteText,
                    Hashtags: hashtags,
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
                    Hashtags: [...tempGraph.NodeDictionary[noteID].Hashtags, ...hashtags],
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
                  LinksFrom: [...tempGraph.NodeDictionary[linkIDs[i].ID].LinksFrom, noteBase]
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
                  LinksTowards: [] as BaseNode[],
                  LinksFrom: [noteBase]
                }
              }
            };
          }
        };

        //console.log(tempGraph);
    }

    setGraph(tempGraph);
    }
  }

  useEffect(() => {

    //Touch gestures
    // const viewerImage = document.getElementById("notas-graph");
    // if(viewerImage !== null){
    //   const hammertime: HammerManager = new Hammer(viewerImage);
    //   hammertime.get('pinch').set({ enable: true });

    //   hammertime.on("pinch", e => {
    //     console.log("I pinched!");
    //     console.log(e);
    //   });

    //   hammertime.on("tap", e => {
    //     console.log("I tapped!");
    //     console.log(e);
    //   });
    // }

    //Force graph animation
    const timer = setTimeout(() => {setGraph({...ForceTransform(graph)});}, 40);
    return () => clearTimeout(timer);
  });

  function onClickNode(id: string) {
    if(id in graph.NodeDictionary) {
        console.log(id);
        selectNode({...graph.NodeDictionary[id]});
    }
  }

  function onSearchInputChange(e: any) {
    setSearchInput(e.target.value);
    setHighlightHashtag(e.target.value);
  }

  function onSearchButtonClick() {
    setFilterHashtag(searchInput);
  }

  function handlePinch(e: any) {
    console.log(e);
  }

  return (
    <div className="App">
      <div className="App-header">
        <div className="download-logo-container" onClick={onClickBearImport}>
          <DownloadLogo/>
        </div>
        <div className="searchbar-container">
          <input 
            onChange={onSearchInputChange}
            className="form-control searchbar" 
            type="text" 
            placeholder="Enter hashtag" 
            aria-label="Search" 
            value={searchInput}
          />
          <div className="search-bar-end">
            <div className="dropdown">
              <img 
              onClick={onSearchButtonClick}
              className="filter-logo" src={Filter} alt=""/>
              {/* <div className="dropdown-content">
                <a className="dropdown-element" href="#">
                  <img className="filter-logo" src={Filter} alt=""/>
                  <div>Hashtag filter</div>
                 </a>
                <a className="dropdown-element" href="#">
                  <img className="filter-logo" src={Filter} alt=""/>
                  <div>Hashtag filter</div>
                </a> 
              </div>*/}
            </div>
          </div>
        </div>
        <img className="notas-logo" src={NotasLogo} alt=""/>
      </div>
      <div className="App-main">
        <div className="App-graph">
            <NotasGraph id={"notas-graph"} Graph={graph} FilterHashtag={filterHashtag} HighlightedHashtag={highlightedHashtag} SelectedNode={selectedNode} onClickNode={onClickNode}/>
        </div>
        <div className="App-sidebar">
          {<Sidebar Node={selectedNode}/>
          }
        </div>
      </div>
    </div>
  );
}

export default App;


//Attribute icons
//<div>Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
//<div>Icons made by <a href="https://www.flaticon.com/authors/becris" title="Becris">Becris</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>