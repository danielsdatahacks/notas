import React from "react";
import Graph from "../models/graph";
import Link from "../models/link";
import Node from "../models/node";

//const graphData : Graph = {
//    Energy: 10000000,
//    NodeDictionary: {
//        "id1": {
//            ID: "id1",
//            Text: "",
//            X: 1101,
//            Y: 1101,
//            ConnectedNodes: ["id2"]
//        },
//        "id2": {
//            ID: "id2",
//            Text: "",
//            X: 1202,
//            Y: 1202,
//            ConnectedNodes: ["id3"]
//        },
//        "id3": {
//            ID: "id3",
//            Text: "",
//            X: 1003,
//            Y: 1403,
//            ConnectedNodes: []
//        },"id4": {
//            ID: "id4",
//            Text: "",
//            X: 1431,
//            Y: 1241,
//            ConnectedNodes: ["id2"]
//        },"id5": {
//            ID: "id6",
//            Text: "",
//            X: 1501,
//            Y: 1701,
//            ConnectedNodes: ["id2"]
//        },"id6": {
//            ID: "id6",
//            Text: "",
//            X: 1001,
//            Y: 1451,
//            ConnectedNodes: ["id2"]
//        },
//    },
//    Links: 
//        [
//            {  
//                StartID: "id1",
//                EndID: "id2"
//            },
//            {  
//                StartID: "id2",
//                EndID: "id3"
//            },
//            {  
//                StartID: "id4",
//                EndID: "id2"
//            },
//            {  
//                StartID: "id5",
//                EndID: "id2"
//            },
//            {  
//                StartID: "id6",
//                EndID: "id2"
//            }
//        ]
//}

interface Props {
    id: string,
    Graph: Graph,
    SelectedNode: Node, 
    HighlightedHashtag: string,
    FilterHashtag: string,
    onClickNode(id: string): void
}


//let timerID: any;

export default function NotasGraph(props: Props) {

    function onClickNode(event: any, id: string) {
        console.log("Test1" + id);
        props.onClickNode(id);
    }

    return (
        <svg
            id={props.id}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 15000 15000"
        >
            {
                Object.keys(props.Graph.TopicDictionary).map((id: string) =>
                (props.FilterHashtag === "" || props.Graph.TopicDictionary[id].Name === props.FilterHashtag) &&
                    <g id={id}>
                        <circle 
                            key={id}
                            cx={props.Graph.TopicDictionary[id].X.toString()} 
                            cy={props.Graph.TopicDictionary[id].Y.toString()}
                            r="150"
                            fill={"rgb(255,106,0)"} 
                        />
                    </g>
                )
            }
            {
                Object.keys(props.Graph.NodeDictionary).map((id1: string) =>
                    (props.FilterHashtag === "" || props.Graph.NodeDictionary[id1].Hashtags.map(function(el){return props.Graph.TopicDictionary[el].Name}).includes(props.FilterHashtag)) &&
                        props.Graph.NodeDictionary[id1].LinksTowards.map((id2: Link) =>
                            <line
                                key={id1 + id2.ID}
                                x1={props.Graph.NodeDictionary[id1].X.toString()} 
                                y1={props.Graph.NodeDictionary[id1].Y.toString()} 
                                x2={props.Graph.NodeDictionary[id2.ID].X.toString()} 
                                y2={props.Graph.NodeDictionary[id2.ID].Y.toString()} 
                                style={{stroke:"grey",strokeWidth:4}} 
                            />
                        )
                )
            }
            {
                Object.keys(props.Graph.NodeDictionary).map((id: string) =>
                    (props.FilterHashtag === "" || props.Graph.NodeDictionary[id].Hashtags.map(function(el){return props.Graph.TopicDictionary[el].Name}).includes(props.FilterHashtag)) &&
                        <g id={id}>
                            <circle 
                                onClick={(event:any) => onClickNode(event, id)}
                                key={id}
                                cx={props.Graph.NodeDictionary[id].X.toString()} 
                                cy={props.Graph.NodeDictionary[id].Y.toString()}
                                r="50" 
                                stroke={"whitesmoke"} 
                                strokeWidth="4" 
                                fill={props.Graph.NodeDictionary[id].Hashtags.map(function(el){return props.Graph.TopicDictionary[el].Name}).includes(props.HighlightedHashtag)? 
                                    (id === props.SelectedNode.ID? "red" : "rgb(255,106,0)") : (id === props.SelectedNode.ID? "red" : "grey")} 
                            />
                            <text 
                                id={id}
                                x={(props.Graph.NodeDictionary[id].X).toString()} 
                                y={(props.Graph.NodeDictionary[id].Y+90).toString()} 
                                style={{textAnchor: "middle", fontSize: "40", fill: "grey"}}
                            >
                                {props.Graph.NodeDictionary[id].Name}
                            </text>
                        </g>
                )
            }
            {
                <circle 
                    key={"center"}
                    cx={7500} 
                    cy={7500}
                    r="20" 
                    stroke="lightgrey" 
                    strokeWidth="2" 
                    fill="red" 
                />
            }
            {
                Object.keys(props.Graph.TopicDictionary).map((id: string) =>
                    (props.FilterHashtag === "" || props.Graph.TopicDictionary[id].Name === props.FilterHashtag) &&
                    <g id={id}>
                        <text 
                            id={id}
                            x={(props.Graph.TopicDictionary[id].X).toString()} 
                            y={(props.Graph.TopicDictionary[id].Y+400).toString()} 
                            style={{textAnchor: "middle", fontSize: "225"}}
                        >
                            {props.Graph.TopicDictionary[id].Name}
                        </text>
                    </g>
                )
            }
        </svg>
    );
}

/*
<line x1="400" y1="400" x2="200" y2="200" style={{stroke:"grey",strokeWidth:10}} />
                <circle cx="400" cy="400" r="40" stroke="white" strokeWidth="3" fill="grey" />
                <circle cx="200" cy="200" r="40" stroke="white" strokeWidth="3" fill="grey" />
                <circle cx="600" cy="600" r="40" stroke="white" strokeWidth="3" fill="grey" />
*/