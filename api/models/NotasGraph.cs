using System.Collections.Generic;

namespace NotasGraph
{
    public class Graph
    {
        public decimal Energy { get; set; }

        public Dictionary<string, Node> NodeDictionary { get; set; }

        public Dictionary<string, Node> TopicDictionary { get; set; }
    }

    public class BaseNode {
        public string ID {get; set;}
        public string Name {get; set;}
    }

    public class Node: BaseNode{
        public string Text {get; set;}
        public List<string> Hashtags {get; set;} //List of hashtag IDs
        public decimal X {get; set;}
        public decimal Y {get; set;}
        public List<BaseNode> LinksTowards {get; set;}
        public List<BaseNode> LinksFrom {get; set;}
    }
    
}