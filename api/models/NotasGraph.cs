using System.Collections.Generic;

namespace NotasGraph
{
    public class Graph
    {
        public string ExternalUserID {get; set;}

        public decimal Energy { get; set; }

        public Dictionary<string, Node> NodeDictionary { get; set; }

        public Dictionary<string, BaseNode> TopicDictionary { get; set; }
    }

    public class Link {
        //Start node ID or end node ID of the link depending
        //on the usage.
        public string ID {get; set;}
        public string Name {get; set;}
    }


    public class BaseNode {
        public string ID {get; set;}
        public string Name {get; set;}
        public decimal X {get; set;}
        public decimal Y {get; set;}
        public List<Link> LinksTowards {get; set;}
    }

    public class Node: BaseNode{
        public string Text {get; set;}
        public List<string> Hashtags {get; set;} //List of hashtag IDs
        public List<Link> LinksFrom {get; set;}
    }

    enum Type{
        Note=0,
        Hashtag=1
    }
    
}