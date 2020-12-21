import BaseNode from "./baseNode";

export default interface NodeHashtags {
    HashtagDict: {[id: string]: BaseNode},
    Hashtags: string[]
}