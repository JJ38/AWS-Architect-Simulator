import type { AppNode, Property } from "../types";

export class PropertiesWidgetController{

    private setSelectedNodeID: React.Dispatch<React.SetStateAction<string | null>>;
    private setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>;


    public constructor(setSelectedNodeID: React.Dispatch<React.SetStateAction<string | null>>, setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>){
        this.setSelectedNodeID = setSelectedNodeID;
        this.setNodes = setNodes;
    }

    public stringOnChange(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, nodeProperty: Property<any>, inputName: string, stateSelectedNodeID: string | null){
        
        if(nodeProperty == undefined){
            console.log("node properties undefined");
            return;
        }

        if(stateSelectedNodeID == null){
            console.log("stateSelectedNodeID is null");
            return;
        }

        const newNodeProperty = structuredClone(nodeProperty);
        newNodeProperty.value = event.target.value;

        this.setNodes((nodes: AppNode[]) => nodes.map((node: AppNode) => {

            if(node.id !== stateSelectedNodeID){
                return node;
            }

            const newNode = structuredClone(node);

            if(newNode.data == null){
                return newNode;
            }

            newNode.data.properties[inputName] = newNodeProperty;
            return newNode;
        }));
    
    }

}