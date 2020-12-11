import Graph from "../models/graph";
import Link from "../models/link";

export default function ForceTransform(graph: Graph): Graph {
    let transformedGraph: Graph = graph;

    let gravityCenter: number[] = [7500,7500];

    let R: number = 300000;
    let A: number = 0.5;
    let AHashtagNode: number = 0.1;
    let RHashtags: number = 400;
    //let G: number = 1000;
    //let F: number = 0.01;
    //let convergenceEnergy: number = 1000;


    if (true){
        //initialize step size from energy
        let dt: number = 0.1;
        //if (graph.Energy < 1){
        //    dt = dt*graph.Energy;
        //}

        let fSquared: number = 0;

        //Transform hashtag nodes
        Object.keys(graph.TopicDictionary).forEach(function(i: string){
            let xi: number = graph.TopicDictionary[i]?.X;
            let yi: number = graph.TopicDictionary[i]?.Y;
            let fx: number = 0;
            let fy: number = 0;

            //Repulsive force between all hashtag nodes
            Object.keys(graph.TopicDictionary).forEach(function(j: string){
                if(j !== i){
                    let xj: number = graph.TopicDictionary[j]?.X;
                    let yj: number = graph.TopicDictionary[j]?.Y;

                    let dij: number = Math.sqrt(Math.pow(xi-xj,2) + Math.pow(yi-yj,2));

                    //To avoid infinities
                    if(dij < Math.pow(10,-3)){
                        dij = 0.5;
                    }

                    fx += -(xj-xi) * RHashtags/dij;
                    fy += -(yj-yi) * RHashtags/dij;
                }
            });

            //Gravity
            if(true){
                fx += -(xi-gravityCenter[0]);
                fy += -(yi-gravityCenter[1]);
            }

            //Attractive force between linked nodes
            graph.TopicDictionary[i].LinksTowards.forEach(function(j: Link){
                let xj: number = graph.NodeDictionary[j.ID]?.X;
                let yj: number = graph.NodeDictionary[j.ID]?.Y;

                //let dij: number = Math.sqrt(Math.pow(xi-xj,2) + Math.pow(yi-yj,2));

                fx += (xj-xi)*AHashtagNode;
                fy += (yj-yi)*AHashtagNode;
            });

            fSquared += Math.pow(fx,2) + Math.pow(fy,2);

            let newX: number = xi + dt*fx;
            let newY: number = yi + dt*fy;

            transformedGraph.TopicDictionary[i].X = newX;
            transformedGraph.TopicDictionary[i].Y = newY;
        });

        //Transform note nodes
        Object.keys(graph.NodeDictionary).forEach(function(i: string){
            let xi: number = graph.NodeDictionary[i]?.X;
            let yi: number = graph.NodeDictionary[i]?.Y;
            let fx: number = 0;
            let fy: number = 0;

            //Repulsive force between all nodes
            Object.keys(graph.NodeDictionary).forEach(function(j: string){
                if(j !== i){
                    let xj: number = graph.NodeDictionary[j]?.X;
                    let yj: number = graph.NodeDictionary[j]?.Y;

                    let dij: number = Math.sqrt(Math.pow(xi-xj,2) + Math.pow(yi-yj,2));

                    if(dij < Math.pow(10,-4)){
                        dij = 0.5;
                    }

                    fx += -(xj-xi)*R/Math.pow(dij,2);
                    fy += -(yj-yi)*R/Math.pow(dij,2);
                }
            });

            //Gravity
            if(graph.NodeDictionary[i].Hashtags.length === 0){
                fx += -(xi-gravityCenter[0]);
                fy += -(yi-gravityCenter[1]);
            } else {
                //Note feels gravity only from its hashtag nodes.
                graph.NodeDictionary[i].Hashtags.forEach(function(hashtagID: string){
                    fx += -(xi-graph.TopicDictionary[hashtagID]?.X);
                    fy += -(yi-graph.TopicDictionary[hashtagID]?.Y);
                });
            }

            //Attractive force between linked nodes
            graph.NodeDictionary[i].LinksTowards.forEach(function(j: Link){
                let xj: number = graph.NodeDictionary[j.ID]?.X;
                let yj: number = graph.NodeDictionary[j.ID]?.Y;

                //let dij: number = Math.sqrt(Math.pow(xi-xj,2) + Math.pow(yi-yj,2));

                fx += (xj-xi)*A;
                fy += (yj-yi)*A;
            });
            graph.NodeDictionary[i].LinksFrom.forEach(function(j: Link){
                let xj: number = graph.NodeDictionary[j.ID]?.X;
                let yj: number = graph.NodeDictionary[j.ID]?.Y;

                //let dij: number = Math.sqrt(Math.pow(xi-xj,2) + Math.pow(yi-yj,2));

                fx += (xj-xi)*A;
                fy += (yj-yi)*A;
            });

            fSquared += Math.pow(fx,2) + Math.pow(fy,2);

            let newX: number = xi + dt*fx;
            let newY: number = yi + dt*fy;


            //Friction
            //newX += - F * (newX - xi);
            //newY += - F * (newY - yi);


            transformedGraph.NodeDictionary[i].X = newX;
            transformedGraph.NodeDictionary[i].Y = newY;
        });

        transformedGraph.Energy = fSquared;
        //console.log(fSquared);
    }

    return transformedGraph;
};