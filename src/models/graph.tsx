import Node from "./node";
import BaseNode from "./baseNode";
//import DirectedLink from "./directedlink";

export default interface Graph {
    ExternalUserID: string,
    Energy: number,
    DeletedNodeIDs: string[],
    NodeDictionary:  {[id: string]: Node},
    TopicDictionary: {[id: string]: BaseNode}
}