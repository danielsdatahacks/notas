import React, { Component } from "react";
import BaseNode from "../models/baseNode";
import Graph from "../models/graph";
//import ForceTransform from "./SpringElectrical";

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


interface State  {
    Graph: Graph
}

interface Props {
    Graph: Graph
}

//let timerID: any;

export default class NotasGraph extends Component<Props, State> {

    constructor(props: any) {
        super(props);
        this.state = {
          Graph: this.props.Graph,
        };
      }

    //componentDidMount() {
    //    //console.log(this.state.Graph.NodeDictionary[0]);
    //    //console.log(Object.keys(this.state.Graph.NodeDictionary).length === 0);
    //    if(Object.keys(this.state.Graph.NodeDictionary).length !== 0){
    //        timerID = setInterval(
    //            () => Object.keys(this.state.Graph.NodeDictionary).length !==0 ? this.forceTrandsform() : {},
    //            100
    //        );
    //    }
    //}
    //
    //componentWillUnmount() {
    //    clearInterval(timerID);
    //}

    // useEffect(() => {

    // })

    // useEffect(() => {
    //     this.setState((state) => ({
    //         Graph: {
    //             ...ForceTransform(state.Graph)
    //         }
    //     }))
    // });

    // forceTrandsform = () => {
    //     this.setState((state) => ({
    //         Graph: {
    //             ...ForceTransform(state.Graph)
    //         }
    //     }))
    // }

    render() {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 3000 3000"
            >
                {
                    Object.keys(this.state.Graph.NodeDictionary).map((id1: string) =>
                        this.state.Graph.NodeDictionary[id1].LinksTowards.map((id2: BaseNode) =>
                            <line
                                key={id1 + id2}
                                x1={this.state.Graph.NodeDictionary[id1].X.toString()} 
                                y1={this.state.Graph.NodeDictionary[id1].Y.toString()} 
                                x2={this.state.Graph.NodeDictionary[id2.ID].X.toString()} 
                                y2={this.state.Graph.NodeDictionary[id2.ID].Y.toString()} 
                                style={{stroke:"grey",strokeWidth:2}} 
                            />
                        )
                    )
                }
                {
                    Object.keys(this.state.Graph.NodeDictionary).map((id: string) =>
                        <circle 
                            key={id}
                            cx={this.state.Graph.NodeDictionary[id].X.toString()} 
                            cy={this.state.Graph.NodeDictionary[id].Y.toString()}
                            r="20" 
                            stroke="lightgrey" 
                            strokeWidth="2" 
                            fill="grey" 
                        />
                    )
                }
                {
                        <circle 
                            key={"center"}
                            cx={1500} 
                            cy={800}
                            r="10" 
                            stroke="lightgrey" 
                            strokeWidth="2" 
                            fill="red" 
                        />
                }
            </svg>
        );
      }
}

/*
<line x1="400" y1="400" x2="200" y2="200" style={{stroke:"grey",strokeWidth:10}} />
                <circle cx="400" cy="400" r="40" stroke="white" strokeWidth="3" fill="grey" />
                <circle cx="200" cy="200" r="40" stroke="white" strokeWidth="3" fill="grey" />
                <circle cx="600" cy="600" r="40" stroke="white" strokeWidth="3" fill="grey" />
*/