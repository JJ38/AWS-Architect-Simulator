import type { AppNode, NodeProperty } from "../types";

export class PropertiesWidgetController{

    private setSelectedNode: React.Dispatch<React.SetStateAction<AppNode | null>>;
    private setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>;


    public constructor(setSelectedNode: React.Dispatch<React.SetStateAction<AppNode | null>>, setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>){
        this.setSelectedNode = setSelectedNode;
        this.setNodes = setNodes;
    }

    public stringOnChange(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, nodeProperty: NodeProperty<any>, inputName: string, stateSelectedNode: AppNode | null, stateNodes: AppNode[]){
        
        if(nodeProperty == undefined){
            console.log("node properties undefined");
            return;
        }

         if(stateSelectedNode == null){
            console.log("stateSelectedNode is null");
            return;
        }


        const newNodeProperty = structuredClone(nodeProperty);
        newNodeProperty.value = event.target.value;

        const newStateSelectedNode = structuredClone(stateSelectedNode);
        newStateSelectedNode!.data.resourceData!.properties[inputName] = newNodeProperty;

        console.log(newStateSelectedNode)

        this.setNodes(nodes => nodes.map(
            node => node.id === newStateSelectedNode!.id ? newStateSelectedNode! : node
        ))

        this.setSelectedNode(newStateSelectedNode);
    
    }

}