import React, {useState, useEffect} from 'react';
import Node from '../src/models/node';
import BaseNode from './models/baseNode';
import Customer from './models/Customer';
//import './Stylings/note.css';
import './Stylings/bear.css';

interface Props {
    SelectedNode: Node,
    HashtagDictionary: {[id: string]: Node}
}

function Sidebar(props: Props) {

  const [customers, setCustomers]: [Customer[], React.Dispatch<React.SetStateAction<Customer[]>>] = useState([] as Customer[]);
  const [count, setCount]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0);

  //https://nice-bay-0a8ac9503.azurestaticapps.net

  function onClickSidebar() {
    //To test locally the need to run the azure function locally and set the correct address here:
    //  http://localhost:7071/api/LoadNotasGraph for deployment it is enough to set:
    //  /api/LoadNotasGraph
    fetch('http://localhost:7071/api/LoadNotasGraph')
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        setCustomers(data);
      })
      .catch(console.log);
  }

  return (
    <div 
      onClick={onClickSidebar}
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
        {customers.map((customer: Customer) =>
            <div>{customer.PersonID + ", " + customer.FirstName + ", " + customer.LastName + ", " + customer.City + ", " + customer.Address}</div>
        )}
    </div>
  );
};

export default Sidebar;