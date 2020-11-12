import BaseNode from "../models/baseNode";
import Graph from "../models/graph";

export default function ForceTransform(graph: Graph): Graph {
    let transformedGraph: Graph = graph;

    let gravityCenter: number[] = [7500,7500];

    let R: number = 80;
    let A: number = 0.5;
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

        Object.keys(graph.NodeDictionary).forEach(function(i: string){
            let xi: number = graph.NodeDictionary[i].X;
            let yi: number = graph.NodeDictionary[i].Y;
            let fx: number = 0;
            let fy: number = 0;

            //Repulsive force between all nodes
            Object.keys(graph.NodeDictionary).forEach(function(j: string){
                if(j !== i){
                    let xj: number = graph.NodeDictionary[j].X;
                    let yj: number = graph.NodeDictionary[j].Y;

                    let dij: number = Math.sqrt(Math.pow(xi-xj,2) + Math.pow(yi-yj,2));

                    if(dij < Math.pow(10,-3)){
                        dij = 0.5;
                    }

                    fx += -(xj-xi)*R/dij;
                    fy += -(yj-yi)*R/dij;
                }
            });

            //Gravity
            //let di: number = Math.sqrt(Math.pow(xi-1500,2) + Math.pow(yi-500,2));
            if(true){
                fx += -(xi-gravityCenter[0]);
                fy += -(yi-gravityCenter[1]);
            }
            //else{
            //    fx += -(xi-1500)*G/Math.pow(di,2);
            //    fy += -(yi-1000)*G/Math.pow(di,2);
            //}

            //Attractive force between linked nodes
            graph.NodeDictionary[i].LinksTowards.forEach(function(j: BaseNode){
                let xj: number = graph.NodeDictionary[j.ID].X;
                let yj: number = graph.NodeDictionary[j.ID].Y;

                //let dij: number = Math.sqrt(Math.pow(xi-xj,2) + Math.pow(yi-yj,2));

                fx += (xj-xi)*A;
                fy += (yj-yi)*A;
            });
            graph.NodeDictionary[i].LinksFrom.forEach(function(j: BaseNode){
                let xj: number = graph.NodeDictionary[j.ID].X;
                let yj: number = graph.NodeDictionary[j.ID].Y;

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