import type { AppNode, NodeProperty } from "../types";

export class PropertiesWidgetController{

    private setSelectedNodeID: React.Dispatch<React.SetStateAction<string | null>>;
    private setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>;


    public constructor(setSelectedNodeID: React.Dispatch<React.SetStateAction<string | null>>, setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>){
        this.setSelectedNodeID = setSelectedNodeID;
        this.setNodes = setNodes;
    }

    public stringOnChange(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, nodeProperty: NodeProperty<any>, inputName: string, stateSelectedNodeID: string | null){
        
        if(nodeProperty == undefined){
            console.log("node properties undefined");
            return;
        }

        if(stateSelectedNodeID == null){
            console.log("stateSelectedNodeID is null");
            return;
        }
 // const newStateSelectedNode = structuredClone(selectedNode);
        // newStateSelectedNode!.data.resourceData!.properties[inputName] = newNodeProperty;

        // console.log(newStateSelectedNode)

        // this.setNodes(nodes => nodes.map(
        //     node => node.id === newStateSelectedNode!.id ? newStateSelectedNode! : node
        // ))
        // const selectedNode = {}


        const newNodeProperty = structuredClone(nodeProperty);
        newNodeProperty.value = event.target.value;

       
    
    }

}