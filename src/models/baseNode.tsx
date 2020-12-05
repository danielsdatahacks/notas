import Link from "./link";

export default interface BaseNode {
    ID: string,
    Name: string,
    X: number,
    Y: number,
    LinksTowards: Link[]
}