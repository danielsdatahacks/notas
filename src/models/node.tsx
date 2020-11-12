import BaseNode from "./baseNode";

export default interface Node extends BaseNode {
    Text: string,
    Hashtags: string[]
    X: number,
    Y: number,
    LinksTowards: BaseNode[],
    LinksFrom: BaseNode[]
}