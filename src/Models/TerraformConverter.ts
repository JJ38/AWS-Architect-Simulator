import type { AppEdge, AppNode, CodeChunk } from "../types";
import type { ResourceStatics } from "./Resource";
import { resourceContainer } from "../constants";


export class TerraformConverter{

    private stateNodes: AppNode[];
    private stateEdges: AppEdge[];
    public terraform: string = "";


    public constructor({ stateNodes, stateEdges }: { stateNodes: AppNode[], stateEdges: AppEdge[]}){
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

        this.terraform = "";

        for(let i = 0; i < this.stateNodes.length; i++){

            const resource: ResourceStatics = resourceContainer[this.stateNodes[i].data.service.providerType!];
            const resourceInstance = new resource(this.stateNodes[i].data);
            this.terraform += resourceInstance.toTerraform();

        }

        return true;

    }

}