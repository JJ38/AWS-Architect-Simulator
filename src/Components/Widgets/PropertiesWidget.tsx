import { memo, useState } from 'react';
import { PropertiesWidgetController } from '../../Controllers/PropertiesWidgetController';
import type { AppEdge, AppNode, CodeChunk, ComponentData, EdgeData, Property, PropertyCategory, PropertyRecord, ResourceData } from '../../types';
import '../../styles/PropertiesWidget.css'


function PropertiesWidget(
    { 
        stateSelectedNodeID, 
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
        selectedNodeData: ComponentData | undefined,
        setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>, 
        stateSelectedEdgeID: string | null,
        selectedEdgeData: ComponentData | undefined,
        setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>,
        title: string
    }
){
 
    const [statePropertiesWidgetController] = useState(() => new PropertiesWidgetController(setNodes, setEdges));

    const componentID: string | null = stateSelectedNodeID != undefined ? stateSelectedNodeID : stateSelectedEdgeID != null ? stateSelectedEdgeID : null;
    const componentData = stateSelectedNodeID != undefined ? selectedNodeData : stateSelectedEdgeID != null ? selectedEdgeData : undefined;
    const componentSetter: React.Dispatch<React.SetStateAction<any>> | null = stateSelectedNodeID != undefined ? setNodes : selectedEdgeData != null ? setEdges : null;
    const componentProperties: Record<string, PropertyRecord> | undefined = componentData != null ? componentData?.componentProperties : undefined;
    const componentTerraformProperties: Record<string, PropertyRecord> | undefined = componentData != null ? componentData?.terraformProperties : undefined;

    const selectedResourceTerraform: CodeChunk[] | undefined = statePropertiesWidgetController.getSelectedResource(selectedNodeData as ResourceData)?.toTerraformPreview();
    

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

                    Object.keys(componentProperties).map((propertyRecordName) => {


                        return  <details  key={propertyRecordName} className='propertyBlockWrapper'>
                                    <summary className='propertyRecordSectionSummary'>{propertyRecordName}</summary>

                                    <div className='propertyRecordSectionWrapper'>

                                        {

                                            Object.keys(componentProperties[propertyRecordName]).map((inputName) => {

                                                return <div className='propertyInputWrapper' key={inputName}>
                                                    <p className='propertyName'>{inputName}</p>
                                                    {
                                                        getPropertyInput(
                                                            statePropertiesWidgetController, 
                                                            componentData, 
                                                            componentProperties[propertyRecordName][inputName],
                                                            "component", 
                                                            propertyRecordName,
                                                            inputName, 
                                                            componentID,
                                                            componentSetter
                                                        )
                                                    }

                                                </div>
                                            })
                                        }
                                    </div>
                                </details>
                    
                    })

            }

            {

                (componentTerraformProperties != null && componentTerraformProperties != undefined) &&

                    Object.keys(componentTerraformProperties).map((propertyRecordName) => {
                        
                        return <details  key={propertyRecordName} className='propertyBlockWrapper'>
                                    <summary className='propertyRecordSectionSummary'>{propertyRecordName}</summary>

                                    <div className='propertyRecordSectionWrapper'>
                                        {

                                            Object.keys(componentTerraformProperties[propertyRecordName]).map((inputName) => {

                                                // need to check here if the property is a tags type and change class. 

                                                const shouldShowProperty = statePropertiesWidgetController.shouldShowProperty(componentTerraformProperties[propertyRecordName][inputName], componentData);
                                                
                                                if(!shouldShowProperty){
                                                    return;
                                                }

                                                return <div className='propertyInputWrapper' key={inputName}>
                                                    <p className='propertyName'>{inputName}</p>
                                                    {
                                                        getPropertyInput(
                                                            statePropertiesWidgetController, 
                                                            componentData, 
                                                            componentTerraformProperties[propertyRecordName][inputName],
                                                            "terraform", 
                                                            propertyRecordName,
                                                            inputName, 
                                                            componentID,
                                                            componentSetter
                                                        )
                                                    }

                                                </div>
                                            })
                                        }
                                    </div>
                                </details>          

                    })

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


function getPropertyInput(
    propertiesWidgetController: PropertiesWidgetController, 
    componentData: ComponentData | undefined, 
    property: Property<any>, 
    propertyCategory: PropertyCategory,
    propertyRecordName: string,
    inputName: string, 
    componentID: string | null,  
    componentSetter: React.Dispatch<React.SetStateAction<any>> | null,
    key?: number
){
    if(componentSetter == null){
        return;
    }

    const inputType = property.type;

    switch(inputType){

        case "string":{

            const input = <input key={key} className="propertyInput" id={`${inputName}`} type="text" name={`${inputName}`} value={property.value ?? ""} onChange={(event) => {propertiesWidgetController.keyboardInputOnChange(event, property, propertyCategory, propertyRecordName, inputName, componentID, componentSetter)}}/>
            
            return input;
        }

        case "number":{

            const input = <input key={key} className="propertyInput" id={`${inputName}`} type="number" name={`${inputName}`} value={`${property.value ?? ""}`} onChange={(event) => {propertiesWidgetController.keyboardInputOnChange(event, property, propertyCategory, propertyRecordName, inputName, componentID, componentSetter)}}/>
            
            return input;
        }

        case "boolean":{
            return <input key={key} className="propertyInput" id={`${inputName}`} type="checkbox" checked={property.value ?? false} name={`${inputName}`} onChange={(event) => {propertiesWidgetController.checkBoxOnChange(event, property, propertyCategory, propertyRecordName, inputName, componentID, componentSetter)}}/>
        }

        case "select":{

            if(property.options == undefined){
                return;
            }
            
            return <select name="edgeType" id="select_edge_type" onChange={(event) => {propertiesWidgetController.onSelectChange(event, property, propertyCategory, propertyRecordName, inputName, componentID, componentSetter)}}>
                {property.options.map((option: string) => {
                    return <option value={`${option}`} selected={option == property.value}>{option}</option>
                })}
            </select>
        }

        case "tags":{

            if(property.value == null){
                return;
            }

            return Object.keys(property.value).map((tagKey: string, index: number) => {

                console.log(property.value[tagKey]);

                return  <div><br></br>
                        <div className='propertyInputWrapper' key={tagKey}>
                            <p className='propertyName'>{tagKey}</p>
                                {
                                    getPropertyInput(
                                        propertiesWidgetController, 
                                        componentData, 
                                        property.value[tagKey],
                                        propertyCategory, 
                                        propertyRecordName,
                                        tagKey, 
                                        componentID,
                                        componentSetter,
                                        index
                                    )
                                }
                    
                        </div>
                    </div>
                });
        }
    }

    return <div>input</div>

}




export default memo(PropertiesWidget)