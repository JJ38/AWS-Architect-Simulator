import type { AppEdge, AppNode, EdgeType, Property, AppComponent, PropertyCategory } from "../types";

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
        nodeProperty: Property<any>, 
        propertyCategory: PropertyCategory,
        inputName: string, 
        componentID: string | null,
        componentSetter: React.Dispatch<React.SetStateAction<any>>
    ){

        if(!this.validProperty(nodeProperty, componentID)) return;

        const newNodeProperty = structuredClone(nodeProperty);
        newNodeProperty.value = event.target.value;

        this.updateComponentProperty(newNodeProperty, propertyCategory, componentID!, inputName, componentSetter);


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

    private updateComponentProperty(newNodeProperty: Property<any>, propertyCategory: PropertyCategory, componentID: string, inputName: string, componentSetter: React.Dispatch<React.SetStateAction<any>>){
        console.log("updateComponentProperty");
        componentSetter((components: AppComponent[]) => components.map((component: AppComponent) => {

            if(component.id !== componentID){
                return component;
            }

            const newComponent = structuredClone(component);

            if(newComponent.data == null){
                return newComponent;
            }

            if(propertyCategory == "component"){

                newComponent.data.componentProperties[inputName] = newNodeProperty;

            }else if(propertyCategory == "terraform"){

                newComponent.data.terraformProperties[inputName] = newNodeProperty;

            }

            console.log(newComponent);

            return newComponent;
            
        }));

    }

    //make generic and pass in setter
    public keyboardInputOnChange(
        event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, 
        nodeProperty: Property<any>, 
        propertyCategory: PropertyCategory,
        inputName: string, 
        componentID: string | null,
        componentSetter: React.Dispatch<React.SetStateAction<any>>
    ){  

        if(!this.validProperty(nodeProperty, componentID)) return;

        const newNodeProperty = structuredClone(nodeProperty);
        newNodeProperty.value = event.target.value;

        this.updateComponentProperty(newNodeProperty, propertyCategory, componentID!, inputName, componentSetter);

    }


    public checkBoxOnChange(
        event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, 
        nodeProperty: Property<any>, 
        propertyCategory: PropertyCategory,
        inputName: string, 
        componentID: string | null,
        componentSetter: React.Dispatch<React.SetStateAction<any>>
    ){
        
        if(!this.validProperty(nodeProperty, componentID)) return;

        const newNodeProperty = structuredClone(nodeProperty);
        newNodeProperty.value = event.target.checked;

        this.updateComponentProperty(newNodeProperty, propertyCategory, componentID!, inputName, componentSetter);

    }

}