import type { Edge, Node } from "@xyflow/react";
import type Resource from "./Resource";


export class TerraformConverter{

    private stateNodes: Node[];
    private stateEdges: Edge[];


    public constructor({ stateNodes, stateEdges }: { stateNodes: Node[], stateEdges: Edge[]}){
        this.stateNodes = stateNodes;
        this.stateEdges = stateEdges;
    }    

    public validateDiagram(): boolean{

        //check if each node has required info
        for(let i = 0; i < this.stateNodes.length; i++){
            // const resource = this.stateNodes[i].resource;
        }
        

        return true;

    }

    public diagramToTerraform(): boolean{


        let resourceTerraform = "";

        //create resources for nodes
        for(let i = 0; i < this.stateNodes.length; i++){
            const resource = this.stateNodes[i].data.resource as Resource;

            console.log(typeof resource);
            console.log(resource.constructor.name);

            console.log(resource.id);
            console.log(resource.service);
            console.log(resource.toTerraform());
        }
        

        //identify any triggers in edges

        return true;

    }

}