import Node from "./node";
//import DirectedLink from "./directedlink";

export default interface Graph {
    Energy: number,
    NodeDictionary:  {[id: string]: Node}
}