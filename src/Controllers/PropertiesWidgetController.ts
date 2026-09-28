import type { AppEdge, AppNode, EdgeData, EdgeType, Property } from "../types";

export class PropertiesWidgetController{


    private setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>;
    private setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>;


    public constructor(
        setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>, 
        setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>
    ){
        this.setEdges = setEdges;
        this.setNodes = setNodes;
    }


    //make generic and pass in setter
    public stringOnChange(
        event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, 
        nodeProperty: Property<any>, 
        inputName: string, 
        stateSelectedNodeID: string | null,
    ){
        
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

    public onSelectChange(
        event: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>,
        selectedComponentData: EdgeData,
        stateSelectedEdgeID: string | null,
    ){

        if(stateSelectedEdgeID == null){
            console.log("stateSelectedEdgeID is null");
            return;
        }

        this.setEdges((edges: AppEdge[]) => edges.map((edge: AppEdge) => {

            if(edge.id !== stateSelectedEdgeID){
                return edge;
            }

            const newEdge = structuredClone(edge);

            if(newEdge.data == null){
                return newEdge;
            }

            newEdge.data.edgeType = event.target.value as EdgeType;
            return newEdge;
        }));

    }

}