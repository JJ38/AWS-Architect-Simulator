import { memo, useState } from 'react';
import { PropertiesWidgetController } from '../../Controllers/PropertiesWidgetController';
import type { AppEdge, AppNode, CodeChunk, ComponentData, EdgeData, Property, PropertyCategory, PropertyRecord } from '../../types';
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
        selectedNodeData: ComponentData | undefined,
        setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>, 
        stateSelectedEdgeID: string | null,
        selectedEdgeData: ComponentData | undefined,
        setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>,
        selectedResourceTerraform: CodeChunk[] | undefined,
        title: string
    }
){
 
    const [statePropertiesWidgetController] = useState(() => new PropertiesWidgetController(setNodes, setEdges));

    const componentID: string | null = stateSelectedNodeID != undefined ? stateSelectedNodeID : stateSelectedEdgeID != null ? stateSelectedEdgeID : null;
    const componentData = stateSelectedNodeID != undefined ? selectedNodeData : stateSelectedEdgeID != null ? selectedEdgeData : undefined;
    const componentSetter: React.Dispatch<React.SetStateAction<any>> | null = stateSelectedNodeID != undefined ? setNodes : selectedEdgeData != null ? setEdges : null;
    const componentProperties: Record<string, PropertyRecord> | undefined = componentData != null ? componentData?.componentProperties : undefined;
    const componentTerraformProperties: Record<string, PropertyRecord> | undefined = componentData != null ? componentData?.terraformProperties : undefined;

    console.log(selectedResourceTerraform);

    return(

        <div className="propertiesWidgetWrapper">

            {
                selectedNodeData != null &&

                    <div>
                        <p className='propertyInfo'>{title}</p>
                    </div>         
            }

            {
                selectedEdgeData != null &&

                    <div>
                        <p className='propertyInfo'>{title}</p>                       
                    </div>
            }

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


                        return <div key={propertyRecordName} className='propertyBlockWrapper'>
                            <p>{propertyRecordName}</p>

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
                    
                    })

            }

            {

                (componentTerraformProperties != null && componentTerraformProperties != undefined) &&

                    Object.keys(componentTerraformProperties).map((propertyRecordName) => {
                        

                        console.log(propertyRecordName);

                        return <div key={propertyRecordName} className='propertyBlockWrapper'>
                            <p>{propertyRecordName}</p>

                                {

                                    Object.keys(componentTerraformProperties[propertyRecordName]).map((inputName) => {

                                        console.log(inputName);

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
    componentSetter: React.Dispatch<React.SetStateAction<any>> | null
){
    if(componentSetter == null){
        return;
    }
    
    const inputType = property.type;
    console.log(property);

    switch(inputType){

        case "string":{

            const input = <input className="propertyInput" id={`${inputName}`} type="text" name={`${inputName}`} value={property.value ?? ""} onChange={(event) => {propertiesWidgetController.keyboardInputOnChange(event, property, propertyCategory, propertyRecordName, inputName, componentID, componentSetter)}}/>
            
            return input;
        }

        case "number":{

            const input = <input className="propertyInput" id={`${inputName}`} type="number" name={`${inputName}`} value={`${property.value ?? ""}`} onChange={(event) => {propertiesWidgetController.keyboardInputOnChange(event, property, propertyCategory, propertyRecordName, inputName, componentID, componentSetter)}}/>
            
            return input;
        }

        case "boolean":{
            return <input className="propertyInput" id={`${inputName}`} type="checkbox" checked={property.value ?? false} name={`${inputName}`} onChange={(event) => {console.log("checkbox toggled"); propertiesWidgetController.checkBoxOnChange(event, property, propertyCategory, propertyRecordName, inputName, componentID, componentSetter)}}/>
        }

        case "select":{

            const edgeData = componentData as EdgeData;

            if(property.options == undefined){
                return;
            }
            
            return <select name="edgeType" id="select_edge_type" onChange={(event) => {propertiesWidgetController.onSelectChange(event, property, propertyCategory, propertyRecordName, inputName, componentID, componentSetter)}}>
                {property.options.map((option: string) => {
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