import Node from "./node";
import BaseNode from "./baseNode";
//import DirectedLink from "./directedlink";

export default interface Graph {
    Energy: number,
    NodeDictionary:  {[id: string]: Node},
    TopicDictionary: {[id: string]: BaseNode}
}