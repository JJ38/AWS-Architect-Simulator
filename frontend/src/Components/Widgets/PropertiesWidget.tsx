import { memo, useState } from 'react';
import { PropertiesWidgetController } from '../../Controllers/PropertiesWidgetController';
import type { AppEdge, AppNode, CodeChunk, ComponentData, PropertyRecord, ResourceData, Service } from '../../types';
import '../../styles/PropertiesWidget.css'
import type Resource from '../../Models/Resource';
import { InputsRenderer } from '../Helpers/InputsRenderer.tsx'

function PropertiesWidget(
    { 
        stateSelectedNodeID, 
        stateSelectedService,
        selectedNode,
        selectedNodeData,
        setNodes,
        setNodesData, 
        stateSelectedEdgeID,
        selectedEdge,
        selectedEdgeData, 
        setEdges,
        setEdgesData,
        title
    }
        : 
    { 
        stateSelectedNodeID: string | null,
        stateSelectedService: Service | null | undefined, 
        selectedNode: AppNode | undefined,
        selectedNodeData: ComponentData | undefined,
        setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>, 
        setNodesData: React.Dispatch<React.SetStateAction<ComponentData[]>>,
        stateSelectedEdgeID: string | null,
        selectedEdge: AppEdge | undefined,
        selectedEdgeData: ComponentData | undefined,
        setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>,
        setEdgesData: React.Dispatch<React.SetStateAction<ComponentData[]>>,
        title: string
    }
){

    const [statePropertiesWidgetController] = useState(() => new PropertiesWidgetController(setEdges, setEdgesData, setNodes, setNodesData));

    const selectedComponentType: string | null = stateSelectedNodeID != undefined ? "Node" : stateSelectedEdgeID != null ? "Edge" : null

    const componentID: string | null = selectedComponentType == "Node" ? stateSelectedNodeID : selectedComponentType == "Edge" ? stateSelectedEdgeID : null;
    const componentData = selectedComponentType == "Node"? selectedNodeData : selectedComponentType == "Edge" ? selectedEdgeData : undefined;

    const selectedComponent = selectedNode !== undefined ? selectedNode : selectedEdge !== undefined ? selectedEdge : undefined;

    const simulationProperties: Record<string, PropertyRecord> | undefined = componentData != null ? componentData?.simulationProperties : undefined;
    const componentProperties: Record<string, PropertyRecord> | undefined = componentData != null ? componentData?.componentProperties : undefined; //This is data that lives directly on the node or edge through the framewrok
    const componentTerraformProperties: Record<string, PropertyRecord> | undefined = componentData != null ? componentData?.terraformProperties : undefined;
    const iamTerraformProperties: Record<string, PropertyRecord> | undefined = componentData != null ? componentData?.iamProperties : undefined;
   
    let selectedComponentTerraform: CodeChunk[] | undefined;
  
    if(selectedComponentType == "Node"){

        const resource: Resource | undefined = statePropertiesWidgetController.getSelectedResource(componentData, stateSelectedService);

        if(resource == undefined){
            return;
        }

        const properties = [resource.terraformProperties];

        if(resource.iamProperties != null){
            properties.push(resource.iamProperties);
        }

        selectedComponentTerraform = resource.toTerraformPreview(properties);

    }else if(selectedComponentType == "Edge"){
        selectedComponentTerraform = statePropertiesWidgetController.getEdgeTerraform(componentData);
    }
    
    return(

        <div className="propertiesWidgetWrapper">

            <p className='propertyInfo'>{title}</p>
                        
            {
                componentData == undefined &&

                <div className="checkboxWrapper">
                    <input type="checkbox" id="snapgridCheckbox" name="snapgridCheckbox"/>
                    <label htmlFor="snapgridCheckbox">Snap Grid</label>
                </div> 
            }
            
            <div className="propertiesWrapper">

                {

                    (simulationProperties != null && simulationProperties != undefined) &&
                        InputsRenderer(statePropertiesWidgetController, simulationProperties, "simulation", componentData, componentID, statePropertiesWidgetController.getComponentSetter(selectedComponentType, "simulation"))

                }

                {

                    (componentProperties != null && componentProperties != undefined && stateSelectedEdgeID != null) &&
                        InputsRenderer(statePropertiesWidgetController, selectedComponent?.data as Record<string, PropertyRecord>, "component", componentData, componentID, statePropertiesWidgetController.getComponentSetter(selectedComponentType, "component"))

                }

                {

                    (componentTerraformProperties != null && componentTerraformProperties != undefined) &&
                        InputsRenderer(statePropertiesWidgetController, componentTerraformProperties, "terraform", componentData, componentID, statePropertiesWidgetController.getComponentSetter(selectedComponentType, "terraform"))

                }
                
                {

                    (iamTerraformProperties != null && iamTerraformProperties != undefined) &&  
                        InputsRenderer(statePropertiesWidgetController, iamTerraformProperties, "iam", componentData, componentID, statePropertiesWidgetController.getComponentSetter(selectedComponentType, "iam"))

                }

            </div>

             {

                <div className='terraformSnippetWrapper'>
                    <pre>
                        <code className='terraformCode'>
                            {
                                selectedComponentTerraform?.map((codeChunk: CodeChunk, index: number) => {
                                    return <span key={index} className={codeChunk.className}>{codeChunk.value}</span>
                                })
                            }
                        </code>
                    </pre>
                </div>

            }

        </div>
    );

}

export default memo(PropertiesWidget)