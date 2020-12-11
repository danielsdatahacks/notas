import React, {useState, useEffect} from 'react';
//import logo from './logo.svg';
import './Stylings/App.css';
import './Stylings/note.css';
import './Stylings/dropdown.css';
import NotasLogo from './Icons/logo512.png';
import Graph from './models/graph';
import Node from './models/node';
import NotasGraph from './Graphs/NotasGraph'
import ForceTransform from './Graphs/SpringElectrical';
import Sidebar from './Sidebar'
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
import funnelIcon from '@iconify-icons/ph/funnel';
import {bearImport} from "./Imports/BearImport";
import slidersIcon from '@iconify-icons/ph/sliders';
import Identity from './models/identity';
import Spinner from 'react-bootstrap/Spinner';


//import Hammer from 'hammerjs';
//import '../src/Stylings/bear.css'
interface Props {
  identity: Identity
}

function App(props: Props) {

  const [showAzureDownloadSpinner, setAzureDownloadSpinner]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0);
  const [showAzureUploadSpinner, setAzureUploadSpinner]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0);
  const [showBearImportSpinner, setBearImportSpinner]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0);
  const [graph, setGraph]: [Graph, React.Dispatch<React.SetStateAction<Graph>>] = useState({Energy: 0, NodeDictionary: {}, TopicDictionary: {}});
  const [selectedNode, selectNode]: [Node, React.Dispatch<React.SetStateAction<Node>>] = useState({ID: "", Name: "", Text: "", Hashtags: [] as string[], X: 0, Y: 0, LinksTowards: [] as Link[], LinksFrom: [] as Link[]});
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
    setBearImportSpinner(1);
    bearImport(graph).then((g: Graph) => {
      setGraph(g);

      setBearImportSpinner(0);
      console.log("Finished import");
    }
  );
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
    //console.log("useEffect");
    //console.log(graph);

    //Force graph animation
    if(graph.Energy > 40){
      //console.log("useEffect inside if");
      const timer = setTimeout(() => {setGraph({...ForceTransform(graph)});}, 40);
      return () => clearTimeout(timer);
    };
  },[graph]);

  function onClickNode(id: string) {
    if(id in graph.NodeDictionary) {
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

  // function handlePinch(e: any) {
  //   console.log(e);
  // }

  function onClickAzureUpload() {
    setAzureUploadSpinner(1);
    //  To test locally the need to run the azure function locally and set the correct address here:
    //  http://localhost:7071/api/UploadNotasGraph for deployment it is enough to set:
    //  /api/LoadNotasGraph  (somehow does not work...)
    //  https://loadnotasgraph.azurewebsites.net
    fetch('https://notasfunctions.azurewebsites.net/api/UploadNotasGraph',{
      method: 'post',
      body: JSON.stringify(graph)
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
  }

  function onClickAzureDownload() {
    setAzureDownloadSpinner(1);
    //To test locally: http://localhost:7071/api/LoadNotasGraph
    //For production use: 
    fetch('https://notasfunctions.azurewebsites.net/api/LoadNotasGraph',{
      method: 'post'
    })
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        setAzureDownloadSpinner(0);
        if(typeof(data) == typeof(graph)){
          setGraph(data);
        }
      })
      .catch((e) => {
        console.log(e);
        setAzureDownloadSpinner(0);
      });
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
      <div className="App-header">
        <div className="settings-container">
          <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
            <div className="download-logo-container">
              <Icon width="1.6em" icon={slidersIcon} color="rgb(253,107,33)" />
            </div>
          </OverlayTrigger> 
        </div>
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
        <img className="notas-logo" src={NotasLogo} alt=""/>
      </div>
      <div className="App-main">
        <div className="App-graph">
            <NotasGraph id={"notas-graph"} Graph={graph} FilterHashtag={filterHashtag} HighlightedHashtag={highlightedHashtag} SelectedNode={selectedNode} onClickNode={onClickNode}/>
        </div>
        <div className="App-sidebar">
          {<Sidebar SelectedNode={selectedNode} HashtagDictionary={graph.TopicDictionary}/>
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