import React, {useState, useEffect} from 'react';
//import logo from './logo.svg';
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import './Stylings/App.css';
import './Stylings/note.css';
import './Stylings/dropdown.css';
import NotasLogo from './Icons/logo512.png';
import Graph from './models/graph';
import Node from './models/node';
import NotasGraph from './Graphs/NotasGraph'
import ForceTransform from './Graphs/SpringElectrical';
import Sidebar from './Sidebar/Sidebar'
//import BaseNode from './models/baseNode';
import Link from './models/link';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import ListGroup from 'react-bootstrap/ListGroup';
import './Stylings/popover.css';
import { Icon } from '@iconify/react';
import downloadSimple from '@iconify-icons/ph/download-simple';
import cloudArrowDown from '@iconify-icons/ph/cloud-arrow-down';
import cloudArrowUp from '@iconify-icons/ph/cloud-arrow-up';
import plusCircle from '@iconify-icons/ph/plus-circle';
import minusCircle from '@iconify-icons/ph/minus-circle';
import funnelIcon from '@iconify-icons/ph/funnel';
import {bearImport} from "./Imports/BearImport";
import slidersIcon from '@iconify-icons/ph/sliders';
import Identity from './models/identity';
import Spinner from 'react-bootstrap/Spinner';
import { v4 as uuidv4 } from 'uuid';
import Toast from 'react-bootstrap/Toast';
import {SidebarView} from './models/sidebarViews';
import { fixAllNodes } from './Imports/importUtil';
import { getAutomaticTypeDirectiveNames } from 'typescript';

//import uuid from 'uuid';
//import { textChangeRangeIsUnchanged } from 'typescript';


//import Hammer from 'hammerjs';
//import '../src/Stylings/bear.css'
interface Props {
  identity: Identity,
}

function App(props: Props) {

  const [showAzureDownloadSpinner, setAzureDownloadSpinner]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0);
  const [showAzureUploadSpinner, setAzureUploadSpinner]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0);
  const [showBearImportSpinner, setBearImportSpinner]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0);
  const [graph, setGraph]: [Graph, React.Dispatch<React.SetStateAction<Graph>>] = useState({ExternalUserID: "", Energy: 0, DeletedNodeIDs: [] as string[], NodeDictionary: {}, TopicDictionary: {}});
  const [selectedNodeID, selectNode]: [string, React.Dispatch<React.SetStateAction<string>>] = useState("");
  //const [searchInput, setSearchInput]: [string, React.Dispatch<React.SetStateAction<string>>] = useState("");
  const [filterHashtagID, setFilterHashtagID]: [string, React.Dispatch<React.SetStateAction<string>>] = useState("");
  const [highlightedHashtag, setHighlightHashtag]: [string, React.Dispatch<React.SetStateAction<string>>] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCopyNoteToast, setShowCopyNoteToast] = useState(false);
  const [graphViewBox, setGraphViewBox] = useState("0 0 15000 15000");
  const [sidebarView, setSidebarView] = useState(SidebarView.Main);

  // async function onClick() {
  //   let fileHandle: FileSystemFileHandle;
  //   [fileHandle] = await window.showOpenFilePicker();
  //   const file: File = await fileHandle.getFile();
  //   console.log(file);
  //   const contents: string = await file.text();
  //   setText(contents);
  // }

  async function onClickBearImport () {
    setBearImportSpinner(1);
    bearImport(graph).then((g: Graph) => {
      setGraph(g);

      setBearImportSpinner(0);
      console.log("Finished import");
    }
  );
  }

  useEffect(() => {
    //Force graph animation
    if(graph.Energy > 40){
      const timer = setTimeout(() => {setGraph({...ForceTransform(graph)});}, 40);
      return () => clearTimeout(timer);
    } else {
      //Fix all positions once everything is optimized.
      let tempGraph = fixAllNodes(graph);
      if(tempGraph !== null){
        setGraph({...tempGraph});
      }
    }
  },[graph]);

  useEffect(() => {
    if(props.identity.loggedIn === 1){
      onClickAzureDownload();
    }
  },[props.identity])

  function onClickNode(id: string) {
    if(id in graph.NodeDictionary) {
        selectNode(id);
        setSidebarView(SidebarView.NoteText);
    }
  }

  function onClickHashtag(id: string) {
    if(id in graph.TopicDictionary) {
        setFilterHashtagID(id);
        setSidebarView(SidebarView.NotesList);
    }
  }

  // function onSearchInputChange(e: any) {
  //   setSearchInput(e.target.value);
  //   setHighlightHashtag(e.target.value);
  // }

  // function onSearchButtonClick() {
  //   setFilterHashtagID(searchInput);
  // }

  function onClickNotasLogo() {
    setShowSidebar(true);
    setSidebarView(SidebarView.Main);
  }

  function onCloseCopyNoteToast() {
    setShowCopyNoteToast(false);
  }

  function onAddNodeButtonClick() {
    let id: string = uuidv4();
    if(!(id in graph.NodeDictionary) ){
      let text: string = "# Test note \n\n Enter markdown text.";
      let hashtags: string[] = [] as string[];
      let name: string = "Test note";
      let x: number = 15000;
      let y: number = 50;
      let linksFrom: Link[] = [] as Link[];
      let linksTowards: Link[] = [] as Link[];

      let newNode: Node = {ID: id, Text: text, Hashtags: hashtags, Name: name, X: x, Y: y, IsFixed: false, LinksFrom: linksFrom, LinksTowards: linksTowards};

      setGraph({
        ...graph,
        Energy: 1000,
        NodeDictionary: {
          ...graph.NodeDictionary,
          [id]: newNode
        }
      });

      selectNode(id);
      setSidebarView(SidebarView.NoteText);
    }

    //var newNode: Node = {ID: "", Text:};
    //newNode.ID = uuid();

    //Text: string,
    //Hashtags: string[]
    //LinksFrom: Link[]
    //ID: string,
    //Name: string,
    //X: number,
    //Y: number,
    //LinksTowards: Link[]
  }

  // function handlePinch(e: any) {
  //   console.log(e);
  // }

  function handleZoomIn() {

    let zoomFactor = 1.5;

    let viewBox = graphViewBox.split(" ");
    let xMin = parseFloat(viewBox[0]);
    let yMin = parseFloat(viewBox[1]);
    let xWidth = parseFloat(viewBox[2]);
    let yWidth = parseFloat(viewBox[3]);

    let xMinNew = xMin + (xWidth) * (1 - 1/zoomFactor) / 2;
    let xWidthNew = xWidth / zoomFactor;

    let yMinNew = xMin + (xWidth) * (1 - 1/zoomFactor) / 2;
    let yWidthNew = yWidth / zoomFactor;

    setGraphViewBox(xMinNew.toString()+" "+yMinNew.toString()+" "+xWidthNew.toString()+" "+yWidthNew.toString());
  }

  function handleZoomOut() {

    let zoomFactor = 0.5;

    let viewBox = graphViewBox.split(" ");
    let xMin = parseFloat(viewBox[0]);
    let yMin = parseFloat(viewBox[1]);
    let xWidth = parseFloat(viewBox[2]);
    let yWidth = parseFloat(viewBox[3]);

    let xMinNew = xMin + (xWidth) * (1 - 1/zoomFactor) / 2;
    let xWidthNew = xWidth / zoomFactor;

    let yMinNew = xMin + (xWidth) * (1 - 1/zoomFactor) / 2;
    let yWidthNew = yWidth / zoomFactor;

    setGraphViewBox(xMinNew.toString()+" "+yMinNew.toString()+" "+xWidthNew.toString()+" "+yWidthNew.toString());
  }

  function onClickAzureUpload() {
    setAzureUploadSpinner(1);
    if(props.identity.clientPrincipal.userID !== "" ){
      let uploadGraph = graph;
      uploadGraph.ExternalUserID = props.identity.clientPrincipal.userID;
      //  To test locally: http://localhost:7071/api/UploadNotasGraph
      //  External Azure function: https://notasfunctions.azurewebsites.net/api/UploadNotasGraph
      //  Internal Azure function: /api/UploadNotasGraph
      fetch('/api/UploadNotasGraph',{
        method: 'post',
        body: JSON.stringify(uploadGraph)
      })
        .then(res => res.json())
        .then((data) => {
          setAzureUploadSpinner(0);
          console.log(data);
        })
        .catch((e) => {
          console.log(e);
          setAzureUploadSpinner(0);
        });
    } else {
      //Show some error. User is not authenticated.
      setAzureUploadSpinner(0);
    }
  }

  function onClickAzureDownload() {
    setAzureDownloadSpinner(1);
    if(props.identity.clientPrincipal.userID !== "" ){
      //To test locally: http://localhost:7071/api/LoadNotasGraph
      //External Azure Function: https://notasfunctions.azurewebsites.net/api/LoadNotasGraph
      //Internal Azure Function: /api/LoadNotasGraph
      fetch('/api/LoadNotasGraph',{
        method: 'post',
        body: JSON.stringify(props.identity.clientPrincipal.userID)
      })
        .then(res => res.json())
        .then((data) => {
          console.log(data);
          setAzureDownloadSpinner(0);
          if(typeof(data) == typeof(graph)){
            //If graph is empty we should use a getting started graph!
            setGraph(data);
          }
        })
        .catch((e) => {
          //If graph is empty we should use a getting started graph!
          console.log(e);
          setAzureDownloadSpinner(0);
        });
    } else {
      //Show some error. User is not authenticated.
      setAzureDownloadSpinner(0);
    }
  }


  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Settings</Popover.Title>
      <Popover.Content>
        <ListGroup>
          <ListGroup.Item action onClick={onClickAzureDownload}>
            {showAzureDownloadSpinner === 0 &&
              <Icon width="1.5em" icon={cloudArrowDown} color="rgb(253,107,33)" />
            }
            {showAzureDownloadSpinner === 1 &&
              <Spinner className="notas-spinner" animation="border" size="sm" />
            }
             {" Cloud download"}
          </ListGroup.Item>
          <ListGroup.Item action onClick={onClickAzureUpload}>
            {showAzureUploadSpinner === 0 &&
              <Icon width="1.5em" icon={cloudArrowUp} color="rgb(253,107,33)" />
            }
            {showAzureUploadSpinner === 1 &&
              <Spinner className="notas-spinner" animation="border" size="sm" />
            }
            {" Cloud upload"}
          </ListGroup.Item>
          <ListGroup.Item action onClick={onClickBearImport}>
            {showBearImportSpinner === 0 &&
              <Icon width="1.5em" icon={downloadSimple} color="rgb(253,107,33)" />
            }
            {showBearImportSpinner === 1 &&
              <Spinner className="notas-spinner" animation="border" size="sm" />
            }
            {" Bear import"}
          </ListGroup.Item>
          <ListGroup.Item className="logout-item">
            <div className="notas-logout-container">
              <a className="logout-link" href="/.auth/logout">Logout</a>
              <div className="user-details">{props.identity.clientPrincipal?.userDetails}</div>
            </div>
          </ListGroup.Item>
        </ListGroup>
      </Popover.Content>
    </Popover>
  );

  return (
    <div className="App">
      <div className="toast-container">
        { showCopyNoteToast &&
          <Toast  onClose={onCloseCopyNoteToast} autohide={true} delay={4000}>
            <Toast.Header className="toast-header-custom">
              <strong className="mr-auto">Copied link to note</strong>
            </Toast.Header>
            <Toast.Body className="toast-body-custom">Paste link into text of another note to link both notes.</Toast.Body>
          </Toast>
        }
      </div>
      {/* <div className="App-header">
        <div className="tool-container">
          <div className="searchbar-container">
            <div className="searchbar-input-container">
              <input 
                onChange={onSearchInputChange}
                className="form-control searchbar" 
                type="text" 
                placeholder="Enter hashtag" 
                aria-label="Search" 
                value={searchInput}
              />
            </div>
            <div className="search-bar-end">
              <div className="dropdown">
                <div className="search-bar-end-icon-container" onClick={onSearchButtonClick}>
                  <Icon className="filter-logo" width="1.25em" icon={funnelIcon} color="rgb(253,107,33)"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img className="notas-logo" src={NotasLogo} alt=""/>
      </div> */}
      <div className="App-main">
          {!showSidebar &&
            <div className="notas-logo-container" onClick={onClickNotasLogo}>
              <img className="notas-logo" src={NotasLogo} alt=""/>
            </div>
          }
          <div className="zoom-in" onClick={handleZoomIn}>
            <Icon width="1.6em" icon={plusCircle} color="lightgrey" />
          </div>
          <div className="zoom-out" onClick={handleZoomOut}> 
            <Icon width="1.6em" icon={minusCircle} color="lightgrey" />
          </div>
          <div className="add-node-button-container" onClick={onAddNodeButtonClick}>
            <Icon width="1.6em" icon={plusCircle} color="rgb(253,107,33)" />
          </div>
          <div className="settings-container">
            <OverlayTrigger trigger={"click"} rootClose placement="bottom" overlay={popover} >
              <div className="download-logo-container">
                {(showBearImportSpinner === 1 || showAzureUploadSpinner === 1 || showAzureDownloadSpinner === 1) &&
                    <Spinner className="notas-spinner-large" animation="border"/>
                }
                {(showBearImportSpinner === 0 && showAzureUploadSpinner === 0 && showAzureDownloadSpinner === 0) &&
                  <Icon width="1.6em" icon={slidersIcon} color="rgb(253,107,33)" />
                }
              </div>
            </OverlayTrigger> 
          </div>
        {showSidebar &&
          <div className="App-sidebar">
            <Sidebar 
              onClickAzureUpload={onClickAzureUpload}
              setSidebarView={setSidebarView}
              sidebarView={sidebarView}
              onClickNode={onClickNode} 
              Graph={graph} 
              setCopyNoteToast={setShowCopyNoteToast} 
              setShowSidebar={setShowSidebar} 
              setGraph={setGraph} 
              SelectedNodeID={selectedNodeID} 
              HashtagDictionary={graph.TopicDictionary}  
              filterHashtagID={filterHashtagID}
              setFilterHashtagID={setFilterHashtagID}
            />
          </div>
        }
        <div id={"notas-graph"} className="App-graph">
            <NotasGraph 
              setGraphViewBox={setGraphViewBox} 
              GraphViewBox={graphViewBox} 
              Graph={graph} 
              setGraph={setGraph}
              setShowSidebar={setShowSidebar} 
              FilterHashtagID={filterHashtagID} 
              HighlightedHashtag={highlightedHashtag} 
              SelectedNodeID={selectedNodeID} 
              onClickNode={onClickNode}
              onClickHashtag={onClickHashtag}
            />
        </div>
      </div>
    </div>
  );
}

export default App;


//Attribute icons
//<div>Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
//<div>Icons made by <a href="https://www.flaticon.com/authors/becris" title="Becris">Becris</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
//"azure-functions-core-tools": "^3.0.2996",
//"hammerjs": "^2.0.8",

//Server=tcp:notasserver.database.windows.net,1433;Initial Catalog=notas;Persist Security Info=False;User ID=notasadmin;Password=FqGv4hK2Vqwo;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
//"Default": "Server=localhost,1433; Database=notas; User=sa; Password =Dockersql0705!;"
//Icons used from https://iconify.design/icon-sets/ph/

//        {
//   "route": "/*",
//   "serve": "/index.html",
//   "statusCode": 200
// },