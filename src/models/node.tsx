import BaseNode from "./baseNode";
import Link from "./link";

export default interface Node extends BaseNode {
    Text: string,
    Hashtags: string[]
    LinksFrom: Link[]
}