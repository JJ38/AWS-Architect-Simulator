import type { Edge, Node } from "@xyflow/react";

export class TerraformWidgetController{

    public setShowTerraformWidget: React.Dispatch<React.SetStateAction<boolean>>;
    public setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    public setEdge: React.Dispatch<React.SetStateAction<Edge[]>>;
    public showNotification: (success: boolean, message: string) => void;

    public constructor(setShowTerraformWidget: React.Dispatch<React.SetStateAction<boolean>>, showNotification: (success: boolean, message: string) => void, setNodes: React.Dispatch<React.SetStateAction<Node[]>>, setEdges: React.Dispatch<React.SetStateAction<Edge[]>>){
        this.setShowTerraformWidget = setShowTerraformWidget;
        this.setNodes = setNodes;
        this.setEdge = setEdges;
        this.showNotification = showNotification;
    }   

    public handleCancelClick(){
        this.setShowTerraformWidget(false);
    }

    public handleUploadClick(){

    }

    public handleDownloadClick(stateNodes: Node[], stateEdges: Edge[]){
        
    }


}