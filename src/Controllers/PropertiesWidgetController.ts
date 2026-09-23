import type { AppNode, NodeProperty } from "../types";

export class PropertiesWidgetController{

    private setSelectedNode: React.Dispatch<React.SetStateAction<AppNode | null>>;

    public constructor(setSelectedNode: React.Dispatch<React.SetStateAction<AppNode | null>>){
        this.setSelectedNode = setSelectedNode;
    }

    public stringOnChange(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, nodeProperty: NodeProperty<any>, stateSelectedNode: AppNode | null, inputName: string){
        
        if(nodeProperty == undefined){
            console.log("node properties undefined");
            return;
        }

        const newNodeProperty = structuredClone(nodeProperty);
        newNodeProperty.value = event.target.value;

        const newStateSelectedNode = structuredClone(stateSelectedNode);
        newStateSelectedNode!.data.resourceData!.properties[inputName] = newNodeProperty;

        this.setSelectedNode(newStateSelectedNode);
    
    }

}