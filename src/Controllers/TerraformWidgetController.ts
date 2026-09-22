import type { Edge, Node } from "@xyflow/react";
import { TerraformConverter } from "../Models/TerraformConverter.ts";

export class TerraformWidgetController{

    public setShowTerraformWidget: React.Dispatch<React.SetStateAction<boolean>>;
    public setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    public setEdge: React.Dispatch<React.SetStateAction<Edge[]>>;
    public showNotification: (success: boolean, message: string) => void;
    public setShowDownloadTerraformForm: React.Dispatch<React.SetStateAction<boolean>>

    public constructor(setShowTerraformWidget: React.Dispatch<React.SetStateAction<boolean>>, showNotification: (success: boolean, message: string) => void, setNodes: React.Dispatch<React.SetStateAction<Node[]>>, setEdges: React.Dispatch<React.SetStateAction<Edge[]>>, setShowDownloadTerraformForm: React.Dispatch<React.SetStateAction<boolean>>){
        this.setShowTerraformWidget = setShowTerraformWidget;
        this.setNodes = setNodes;
        this.setEdge = setEdges;
        this.showNotification = showNotification;
        this.setShowDownloadTerraformForm = setShowDownloadTerraformForm;
    }   

    public handleCancelClick(){
        this.setShowTerraformWidget(false);
    }

    public handleUploadClick(){ 

    }

    public handleDownloadClick(stateNodes: Node[]){


        if(stateNodes.length == 0){
            this.showNotification(false, "Add a service to convert it to terraform");
            return;    
        }

        //Get provider and backend state store info from user
        this.setShowDownloadTerraformForm(true);
        
    }

    public handleConvertToTerraform(stateNodes: Node[], stateEdges: Edge[]){

        //create resource of each node.
        const terraformConverter = new TerraformConverter({stateNodes: stateNodes, stateEdges: stateEdges});

        const validDiagram = terraformConverter.validateDiagram();

        if(!validDiagram){
            this.showNotification(false, "Error - invalid diagram");
            return;
        }

        const successfulConversion = terraformConverter.diagramToTerraform();

        if(!successfulConversion){
            this.showNotification(false, "Error - conversion failed");
            return;
        } 

        this.showNotification(true, "Successfully converted to terraform");

        
    }

    public handleCancelDownloadClick(){
        this.setShowDownloadTerraformForm(false);
    }


}