import React from "react";
import Graph from "../models/graph";
import Link from "../models/link";
import Hammer from "react-hammerjs";
import { DragMode } from "../models/dragMode";

interface Props {
    Graph: Graph,
    GraphViewBox: string,
    SelectedNodeID: string, 
    HighlightedHashtag: string,
    FilterHashtagID: string,
    onClickNode(id: string): void,
    onClickHashtag(id: string): void,
    setGraphViewBox: React.Dispatch<React.SetStateAction<string>>,
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>,
    setGraph: React.Dispatch<React.SetStateAction<Graph>>
}

//Variables for graph navigation
let isDragging: boolean = false;
let dragMode: DragMode = DragMode.Graph;
let id: string = "";
let xStart: number = 0;
let yStart: number = 0;
let xWidth: number = 0;
let yWidth: number = 0;

export default function NotasGraph(props: Props) {

    //The svg of the graph is always scaled so that the whole width is shown!
    let svgWidth = document?.getElementById("notas-graph")?.offsetWidth;

    //Note: There is a bug in hammer js. The target of the pan start event is not always correct. Therefore we use the mouseDown event on the svg to initialize the dragging.
    function handlePanStart(e: any) {

        //The svg of the graph is always scaled so that the whole width is shown!
        svgWidth = document?.getElementById("notas-graph")?.offsetWidth;

        if(e.target.id[0] === "h"){
            let hashtagID: string = e.target.id.slice(1, e.target.id.length);
            if(hashtagID in props.Graph.TopicDictionary){
                //Initialize drag of the node
                dragMode = DragMode.Hashtag;
                id = hashtagID;
                let viewBox = props.GraphViewBox.split(" ");
                xStart = props.Graph.TopicDictionary[hashtagID].X; //Initial x position
                yStart = props.Graph.TopicDictionary[hashtagID].Y; //Initial y position
                xWidth = parseFloat(viewBox[2]);
                yWidth = parseFloat(viewBox[3]);
            }
        } 
        else if(e.target.id[0] === "n"){
            let noteID: string = e.target.id.slice(1, e.target.id.length);
            if(noteID in props.Graph.NodeDictionary){
                //Initialize drag of the node
                dragMode = DragMode.Note;
                id = noteID;
                let viewBox = props.GraphViewBox.split(" ");
                xStart = props.Graph.NodeDictionary[noteID].X; //Initial x position
                yStart = props.Graph.NodeDictionary[noteID].Y; //Initial y position
                xWidth = parseFloat(viewBox[2]);
                yWidth = parseFloat(viewBox[3]);
            }
        } else {
            //Initialize drag of the whole graph
            dragMode = DragMode.Graph;
            id = "";
            let viewBox = props.GraphViewBox.split(" ");
            xStart = parseFloat(viewBox[0]); //Initial xMin
            yStart = parseFloat(viewBox[1]); //Initial yMin
            xWidth = parseFloat(viewBox[2]);
            yWidth = parseFloat(viewBox[3]);
        }
    }

    function handlePan(e: any) {

        //Decide whether whole graph, node or hashtag is moved
        if(dragMode === DragMode.Note) {
            if(id in props.Graph.NodeDictionary){
                
                //Change position of the node
                if(svgWidth !== undefined) {
                    let newX = xStart + xWidth * e.deltaX / svgWidth;
                    let newY = yStart + xWidth * e.deltaY / svgWidth;
                
                    props.setGraph({
                        ...props.Graph,
                        NodeDictionary: {
                            ...props.Graph.NodeDictionary,
                            [id]: {
                                ...props.Graph.NodeDictionary[id],
                                X: newX,
                                Y: newY,
                                IsFixed: true
                            }
                        }
                    });
                }
            }
        } else if (dragMode === DragMode.Hashtag) {

            if(id in props.Graph.TopicDictionary){
                //Change position of the node
                if(svgWidth !== undefined) {
                    let newX = xStart + xWidth * e.deltaX / svgWidth;
                    let newY = yStart + xWidth * e.deltaY / svgWidth;
                
                    props.setGraph({
                        ...props.Graph,
                        TopicDictionary: {
                            ...props.Graph.TopicDictionary,
                            [id]: {
                                ...props.Graph.TopicDictionary[id],
                                X: newX,
                                Y: newY,
                                IsFixed: true
                            }
                        }
                    });
                }
            }

        } else if(dragMode === DragMode.Graph) {
            if(svgWidth !== undefined) {
                let xMin = xStart - xWidth * e.deltaX / svgWidth;
                let yMin = yStart - xWidth * e.deltaY / svgWidth;
                props.setGraphViewBox(xMin.toString()+" "+yMin.toString()+" "+xWidth.toString()+" "+yWidth.toString());
            }
        }
    }

    return (
    <Hammer
        onPan={handlePan}
        >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={props.GraphViewBox}
            onMouseDown={handlePanStart}
            onTouchStart={handlePanStart}
        >
            {
                Object.keys(props.Graph.TopicDictionary).map((id: string) =>
                    <g id={"h" + id} key={"hg1" + id}>
                        <circle 
                            id={"h" + id}
                            onClick={() => props.onClickHashtag(id)}
                            key={"hc" + id}
                            cx={props.Graph.TopicDictionary[id].X.toString()} 
                            cy={props.Graph.TopicDictionary[id].Y.toString()}
                            r="100"
                            fill={(props.FilterHashtagID === "" || props.Graph.TopicDictionary[id].ID === props.FilterHashtagID)? "rgba(255,106,0,1)" : "rgba(255,106,0,0.2)"} 
                        />
                    </g>
                )
            }
            {
                Object.keys(props.Graph.NodeDictionary).map((id1: string) =>
                        props.Graph.NodeDictionary[id1].LinksTowards.map((id2: Link) =>
                            <line
                                key={"l" + id1 + id2.ID}
                                x1={props.Graph.NodeDictionary[id1].X.toString()} 
                                y1={props.Graph.NodeDictionary[id1].Y.toString()} 
                                x2={props.Graph.NodeDictionary[id2.ID].X.toString()} 
                                y2={props.Graph.NodeDictionary[id2.ID].Y.toString()} 
                                style={{stroke:(props.FilterHashtagID === "" || props.Graph.NodeDictionary[id1].Hashtags.includes(props.FilterHashtagID))? "rgb(128,128,128)" : "rgba(128,128,128,0.2)",strokeWidth:4}} 
                            />
                        )
                )
            }
            {
                Object.keys(props.Graph.NodeDictionary).map((id: string) =>
                        <g id={"n" + id} key={"ng" + id}>
                            <circle 
                                id={"n" + id}
                                onClick={() => props.onClickNode(id)}
                                key={"cn" + id}
                                cx={props.Graph.NodeDictionary[id].X.toString()} 
                                cy={props.Graph.NodeDictionary[id].Y.toString()}
                                r="50" 
                                stroke={"white"} 
                                strokeWidth="4" 
                                fill={(props.FilterHashtagID === "" || props.Graph.NodeDictionary[id].Hashtags.includes(props.FilterHashtagID))? (id === props.SelectedNodeID? "red" : "rgb(128,128,128)") : (id === props.SelectedNodeID? "red" : "rgba(128,128,128,0.2)")}
                            />
                            <text 
                                key={"tn" + id}
                                x={(props.Graph.NodeDictionary[id].X).toString()} 
                                y={(props.Graph.NodeDictionary[id].Y+110).toString()} 
                                style={{textAnchor: "middle", fontSize: "60", fill: (props.FilterHashtagID === "" || props.Graph.NodeDictionary[id].Hashtags.includes(props.FilterHashtagID))? "rgb(128,128,128)" : (id === props.SelectedNodeID? "rgb(128,128,128)" : "rgba(128,128,128,0.2)")}}
                            >
                                {props.Graph.NodeDictionary[id].Name}
                            </text>
                        </g>
                )
            }
            {/* {
                <circle 
                    key={"center"}
                    cx={7500} 
                    cy={7500}
                    r="20" 
                    stroke="lightgrey" 
                    strokeWidth="2" 
                    fill="red" 
                />
            } */}
            {
                Object.keys(props.Graph.TopicDictionary).map((id: string) =>
                    <g key={"hg2" + id}>
                        <text 
                            key={"ht" + id}
                            x={(props.Graph.TopicDictionary[id].X).toString()} 
                            y={(props.Graph.TopicDictionary[id].Y+200).toString()} 
                            style={{textAnchor: "middle", fontSize: "100", fill: (props.FilterHashtagID === "" || props.Graph.TopicDictionary[id].ID === props.FilterHashtagID)? "rgb(128,128,128)" : "rgba(128,128,128,0.2)"}}

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
