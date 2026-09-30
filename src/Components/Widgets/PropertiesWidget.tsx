import { memo, useState } from 'react';
import { PropertiesWidgetController } from '../../Controllers/PropertiesWidgetController';
import type { AppEdge, AppNode, CodeChunk, ComponentData, EdgeData, Property, ResourceNodeData } from '../../types';
import '../../styles/PropertiesWidget.css'


function PropertiesWidget(
    { 
        stateSelectedNodeID, 
        selectedNodeData,
        setNodes, 
        stateSelectedEdgeID,
        selectedEdgeData, 
        setEdges,
        selectedResourceTerraform,
        title
    }
        : 
    { 
        stateSelectedNodeID: string | null, 
        selectedNodeData: ResourceNodeData | undefined,
        setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>, 
        stateSelectedEdgeID: string | null,
        selectedEdgeData: EdgeData | undefined,
        setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>,
        selectedResourceTerraform: CodeChunk[] | undefined,
        title: string
    }
){
 
    const [statePropertiesWidgetController] = useState(() => new PropertiesWidgetController(setNodes, setEdges));

    const selectedComponentData = selectedNodeData != undefined ? selectedNodeData : selectedEdgeData != null ? selectedEdgeData : null;
    const componentProperties: Record<string, Property<any>> | undefined = selectedComponentData != null ? selectedComponentData?.properties : undefined;

    return(

        <div className="propertiesWidgetWrapper">

            {
                selectedNodeData != null &&

                    <div>
                        <p className='propertyInfo'>{title}</p>
                        {/* <p className="propertyInfo">Node ID`: {stateSelectedNodeID}</p>
                        <p className="propertyInfo">Description: {selectedNodeData?.service.description}</p>  */}
                    </div>         
            }

            {
                selectedEdgeData != null &&

                    <div>
                        <p className='propertyInfo'>{title}</p>                       
                    </div>
            }

            {
                selectedComponentData == undefined &&

                <div className="checkboxWrapper">
                    <input type="checkbox" id="snapgridCheckbox" name="snapgridCheckbox"/>
                    <label htmlFor="snapgridCheckbox">Snap Grid</label>
                </div> 
            }

            
            <div className="propertiesWrapper">

            {

                componentProperties != null && componentProperties != undefined? 

                    Object.keys(componentProperties).map((inputName) => {
                        
                        return <div className='propertyInputWrapper' key={inputName} >
                            <p className='propertyName'>{inputName}</p>
                            {getPropertyInput(statePropertiesWidgetController, selectedComponentData, componentProperties[inputName], inputName, stateSelectedNodeID, stateSelectedEdgeID)}
                        </div>

                    })

                :

                    <></>

            }

           

            </div>

             {
                
                selectedNodeData && 

                <div className='terraformSnippetWrapper'>
                    <pre>
                        <code className='terraformCode'>
                            {
                                selectedResourceTerraform?.map((codeChunk: CodeChunk, index: number) => {
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


function getPropertyInput(propertiesWidgetController: PropertiesWidgetController, selectedComponentData: ComponentData | null, property: Property<any>, inputName: string, stateSelectedNodeID: string | null,  stateSelectedEdgeID: string | null){
    
    const inputType = property.type;

    switch(inputType){

        case "string":{

            const input = <input className="propertyInput" id={`${inputName}`} type="text" name={`${inputName}`} value={property.value ?? ""} onChange={(event) => {propertiesWidgetController.nodeOnChange(event, property, inputName, stateSelectedNodeID)}}/>
            
            return input;
        }

        case "number":{

            const input = <input className="propertyInput" id={`${inputName}`} type="number" name={`${inputName}`} value={`${property.value ?? ""}`} onChange={(event) => {propertiesWidgetController.nodeOnChange(event, property, inputName, stateSelectedNodeID)}}/>
            
            return input;
        }

        case "boolean":{
            return <input className="propertyInput" id={`${inputName}`} type="checkbox" checked={property.value ?? false} name={`${inputName}`} onChange={(event) => {console.log("checkbox toggled"); propertiesWidgetController.checkBoxOnChange(event, property, inputName, stateSelectedNodeID)}}/>
        }

        case "select":{

            const edgeData = selectedComponentData as EdgeData;
            
            return <select name="edgeType" id="select_edge_type" onChange={(event) => {propertiesWidgetController.onSelectChange(event, stateSelectedEdgeID)}}>
                {property.value.map((option: string) => {
                    return <option value={`${option}`} selected={option == edgeData.edgeType}>{option}</option>
                })}
            </select>
        }

        case "tags":{
            return <textarea className="propertyInput" id={`${inputName}`} name={`${inputName}`}/>
        }
    }

    return <div>input</div>

}




export default memo(PropertiesWidget)