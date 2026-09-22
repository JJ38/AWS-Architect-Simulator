import type { Edge, Node } from "@xyflow/react";


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

        //create resources for nodes
        for(let i = 0; i < this.stateNodes.length; i++){
            this.generateResource(this.stateNodes[i]);
        }
        

        //identify any triggers in edges

        return true;

    }

    private generateResource(node: Node){

        console.log(node);

    }



}