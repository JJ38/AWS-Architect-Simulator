import type { AppEdge, AppNode, EdgeType, Property, AppComponent } from "../types";

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

    private validProperty(nodeProperty: Property<any>, componentID: string | null): boolean{

        if(nodeProperty == undefined){
            console.log("node properties undefined");
            return false;
        }

        if(componentID == null){
            console.log("componentID is null");
            return false;
        }

        return true;

    }

    private updateComponentProperty(newNodeProperty: Property<any>, componentID: string, inputName: string, componentSetter: React.Dispatch<React.SetStateAction<any>>){

        componentSetter((components: AppComponent[]) => components.map((component: AppComponent) => {

            if(component.id !== componentID){
                return component;
            }

            const newComponent = structuredClone(component);

            if(newComponent.data == null){
                return newComponent;
            }

            newComponent.data.properties[inputName] = newNodeProperty;
            return newComponent;
            
        }));

    }

    //make generic and pass in setter
    public keyboardInputOnChange(
        event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, 
        nodeProperty: Property<any>, 
        inputName: string, 
        componentID: string | null,
        componentSetter: React.Dispatch<React.SetStateAction<any>>
    ){  

        if(!this.validProperty(nodeProperty, componentID)) return;

        const newNodeProperty = structuredClone(nodeProperty);
        newNodeProperty.value = event.target.value;

        this.updateComponentProperty(newNodeProperty, componentID!, inputName, componentSetter);

    }


    public checkBoxOnChange(
        event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, 
        nodeProperty: Property<any>, 
        inputName: string, 
        componentID: string | null,
        componentSetter: React.Dispatch<React.SetStateAction<any>>
    ){
        
        if(!this.validProperty(nodeProperty, componentID)) return;

        const newNodeProperty = structuredClone(nodeProperty);
        newNodeProperty.value = event.target.checked;

        this.updateComponentProperty(newNodeProperty, componentID!, inputName, componentSetter);

    }

}