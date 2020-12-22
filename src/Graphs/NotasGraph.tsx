import React from "react";
import Graph from "../models/graph";
import Link from "../models/link";
import Hammer from "react-hammerjs";

interface Props {
    id: string,
    Graph: Graph,
    GraphViewBox: string,
    SelectedNodeID: string, 
    HighlightedHashtag: string,
    FilterHashtag: string,
    onClickNode(id: string): void,
    setGraphViewBox: React.Dispatch<React.SetStateAction<string>>,
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>,
}

//Variables for graph navigation
let isDragging: boolean = false;
let firstXMin: number = 0;
let firstYMin: number = 0;
let xWidth: number = 0;
let yWidth: number = 0;
let panFactor = 15;



export default function NotasGraph(props: Props) {

    function onClickNode(event: any, id: string) {
        console.log("Test1" + id);
        props.onClickNode(id);
        props.setShowSidebar(true);
    }

    function handlePan(e: any) {
        console.log(e);
        if(!isDragging){
            isDragging = true;
            let viewBox = props.GraphViewBox.split(" ");
            firstXMin = parseFloat(viewBox[0]);
            firstYMin = parseFloat(viewBox[1]);
            xWidth = parseFloat(viewBox[2]);
            yWidth = parseFloat(viewBox[3]);
        }

        //Todo: compute the pan factor somehow.
        let xMin = firstXMin - panFactor * e.deltaX;
        let yMin = firstYMin - panFactor * e.deltaY;

        props.setGraphViewBox(xMin.toString()+" "+yMin.toString()+" "+xWidth.toString()+" "+yWidth.toString());

        if(e.isFinal){
            isDragging = false;
        }
    }

    return (
    <Hammer
        onPan={handlePan}
        >
        <svg
            id={props.id}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={props.GraphViewBox}
        >
            {
                Object.keys(props.Graph.TopicDictionary).map((id: string) =>
                (props.FilterHashtag === "" || props.Graph.TopicDictionary[id].Name === props.FilterHashtag) &&
                    <g key={"hg1" + id}>
                        <circle 
                            key={"hc" + id}
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
                                key={"l" + id1 + id2.ID}
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
                        <g key={"ng" + id}>
                            <circle 
                                onClick={(event:any) => onClickNode(event, id)}
                                key={"cn" + id}
                                cx={props.Graph.NodeDictionary[id].X.toString()} 
                                cy={props.Graph.NodeDictionary[id].Y.toString()}
                                r="50" 
                                stroke={"whitesmoke"} 
                                strokeWidth="4" 
                                fill={props.Graph.NodeDictionary[id].Hashtags.map(function(el){return props.Graph.TopicDictionary[el].Name}).includes(props.HighlightedHashtag)? 
                                    (id === props.SelectedNodeID? "red" : "rgb(255,106,0)") : (id === props.SelectedNodeID? "red" : "grey")} 
                            />
                            <text 
                                key={"tn" + id}
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
                    <g key={"hg2" + id}>
                        <text 
                            key={"ht" + id}
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
    </Hammer>
    );
}
