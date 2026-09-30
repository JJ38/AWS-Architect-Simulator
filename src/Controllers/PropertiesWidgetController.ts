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
    

    public onSelectChange(
        event: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>,
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

    private validProperty(nodeProperty: Property<any>, stateSelectedNodeID: string | null): boolean{

        if(nodeProperty == undefined){
            console.log("node properties undefined");
            return false;
        }

        if(stateSelectedNodeID == null){
            console.log("stateSelectedNodeID is null");
            return false;
        }

        return true;

    }

    private updateNodeProperty(newNodeProperty: Property<any>, stateSelectedNodeID: string, inputName: string){

        this.setNodes((nodes: AppNode[]) => nodes.map((node: AppNode) => {

            if(node.id !== stateSelectedNodeID){
                return node;
            }

            const newNode = structuredClone(node);

            if(newNode.data == null){
                return newNode;
            }

            newNode.data.properties[inputName] = newNodeProperty;
            console.log(newNode);
            return newNode;
        }));

    }

    //make generic and pass in setter
    public nodeOnChange(
        event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, 
        nodeProperty: Property<any>, 
        inputName: string, 
        stateSelectedNodeID: string | null,
    ){  

        if(!this.validProperty(nodeProperty, stateSelectedNodeID)) return;

        const newNodeProperty = structuredClone(nodeProperty);
        newNodeProperty.value = event.target.value;

        this.updateNodeProperty(newNodeProperty, stateSelectedNodeID!, inputName);

    }

    

    public checkBoxOnChange(
        event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, 
        nodeProperty: Property<any>, 
        inputName: string, 
        stateSelectedNodeID: string | null,
    ){
        
        if(!this.validProperty(nodeProperty, stateSelectedNodeID)) return;

        const newNodeProperty = structuredClone(nodeProperty);
        newNodeProperty.value = event.target.checked;
        
        this.updateNodeProperty(newNodeProperty, stateSelectedNodeID!, inputName);

    }

}