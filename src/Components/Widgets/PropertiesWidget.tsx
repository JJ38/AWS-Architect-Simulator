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
        selectedNodeData,
        setNodes, 
        stateSelectedEdgeID,
        selectedEdgeData, 
        setEdges,
        title
    }
        : 
    { 
        stateSelectedNodeID: string | null,
        stateSelectedService: Service | null | undefined, 
        selectedNodeData: ComponentData | undefined,
        setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>, 
        stateSelectedEdgeID: string | null,
        selectedEdgeData: ComponentData | undefined,
        setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>,
        title: string
    }
){
 
    const [statePropertiesWidgetController] = useState(() => new PropertiesWidgetController(setNodes, setEdges));

    const selectedComponentType: string | null = stateSelectedNodeID != undefined ? "Node" : stateSelectedEdgeID != null ? "Edge" : null

    const componentID: string | null = selectedComponentType == "Node" ? stateSelectedNodeID : selectedComponentType == "Edge" ? stateSelectedEdgeID : null;
    const componentData = selectedComponentType == "Node"? selectedNodeData : selectedComponentType == "Edge" ? selectedEdgeData : undefined;
    const componentSetter: React.Dispatch<React.SetStateAction<any>> | null = selectedComponentType == "Node" ? setNodes : selectedComponentType == "Edge" ? setEdges : null;
    
    const componentProperties: Record<string, PropertyRecord> | undefined = componentData != null ? componentData?.componentProperties : undefined;
    const componentTerraformProperties: Record<string, PropertyRecord> | undefined = componentData != null ? componentData?.terraformProperties : undefined;
    const iamTerraformProperties: Record<string, PropertyRecord> | undefined = componentData != null ? componentData?.iamProperties : undefined;
   
    let selectedComponentTerraform: CodeChunk[] | undefined;
    console.log("PropertiesWidget");
  
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
        
        // selectedComponentTerraform = statePropertiesWidgetController.getEdgeTerraform(componentData);
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

                    (componentProperties != null && componentProperties != undefined) &&
                        InputsRenderer(statePropertiesWidgetController, componentProperties, "component", componentData, componentID, componentSetter)

                }

                {

                    (componentTerraformProperties != null && componentTerraformProperties != undefined) &&
                        InputsRenderer(statePropertiesWidgetController, componentTerraformProperties, "terraform", componentData, componentID, componentSetter)

                }
                
                {

                    (iamTerraformProperties != null && iamTerraformProperties != undefined) &&  
                        InputsRenderer(statePropertiesWidgetController, iamTerraformProperties, "iam", componentData, componentID, componentSetter)

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