import { memo, useState } from 'react';
import { PropertiesWidgetController } from '../../Controllers/PropertiesWidgetController';
import type { AppEdge, AppNode, CodeChunk, ComponentData, Property, PropertyCategory, PropertyRecord, ResourceData } from '../../types';
import '../../styles/PropertiesWidget.css'
import type Resource from '../../Models/Resource';

function PropertiesWidget(
    { 
        stateSelectedNodeID, 
        selectedNodeData,
        stateNodes,
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
        stateNodes: AppNode[],
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

    if(selectedComponentType == "Node"){

        const resource: Resource | undefined = statePropertiesWidgetController.getSelectedResource(componentData as ResourceData);

        if(resource == undefined){
            return;
        }

        const properties = [resource.terraformProperties];

        if(resource.iamProperties != null){
            properties.push(resource.iamProperties);
        }

        selectedComponentTerraform = resource.toTerraformPreview(properties);

    }else if(selectedComponentType == "Edge"){
        
        selectedComponentTerraform = statePropertiesWidgetController.getEdgeTerraform(componentData, stateNodes);
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
                        generateUIProperties(statePropertiesWidgetController, componentProperties, "component", componentData, componentID, componentSetter)

                }

                {

                    (componentTerraformProperties != null && componentTerraformProperties != undefined) &&
                        generateUIProperties(statePropertiesWidgetController, componentTerraformProperties, "terraform", componentData, componentID, componentSetter)

                }
                
                {

                    (iamTerraformProperties != null && iamTerraformProperties != undefined) &&  
                        generateUIProperties(statePropertiesWidgetController, iamTerraformProperties, "iam", componentData, componentID, componentSetter)

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

function generateUIProperties(
    propertiesWidgetController: PropertiesWidgetController, 
    properties: Record<string, PropertyRecord>,
    propertyCategory: PropertyCategory,
    componentData: ComponentData | undefined, 
    componentID: string | null,  
    componentSetter: React.Dispatch<React.SetStateAction<any>> | null,
){


    return Object.keys(properties).map((propertyRecordPath) => {

        if(properties[propertyRecordPath] == null){
            return;
        }

        return <details  key={propertyRecordPath} className='propertyBlockWrapper'>
                    <summary className='propertyRecordSectionSummary'>{propertyRecordPath}</summary>

                    <div className='propertyRecordSectionWrapper'>
                        {
                            
                            Object.keys(properties[propertyRecordPath]).map((inputName, index) => {

                                if(properties[propertyRecordPath][inputName] == null){
                                    console.log("properties[propertyRecordPath][inputName]");
                                    return;
                                }

                                const shouldShowProperty = propertiesWidgetController.shouldShowProperty(properties[propertyRecordPath][inputName], componentData);

                                if(!shouldShowProperty){
                                    return;
                                }

                                return renderPropertyRow(
                                    inputName,
                                    properties[propertyRecordPath][inputName],
                                    propertiesWidgetController,
                                    componentData,
                                    propertyCategory,
                                    [propertyRecordPath],
                                    componentID,
                                    componentSetter,
                                    index
                                );
                            })
                        }
                    </div>
                </details>          

    })

}


function renderPropertyRow(
    inputName: string,
    property: Property<any>,
    propertiesWidgetController: PropertiesWidgetController,
    componentData: ComponentData | undefined,
    propertyCategory: PropertyCategory,
    propertyRecordPath: string[],
    componentID: string | null,
    componentSetter: React.Dispatch<React.SetStateAction<any>> | null,
    key?: number
){

    if(property.type === "tags" || property.type === "propertyArray"){

        return getPropertyInput(
            propertiesWidgetController,
            componentData,
            property,
            propertyCategory,
            propertyRecordPath,
            inputName,
            componentID,
            componentSetter,
            key
        );
    }

    return <div className='propertyInputWrapper' key={inputName}>
        <p className='propertyName'>{inputName}</p>
        {
            getPropertyInput(
                propertiesWidgetController,
                componentData,
                property,
                propertyCategory,
                propertyRecordPath,
                inputName,
                componentID,
                componentSetter,
                key
            )
        }
    </div>;
}


function getPropertyInput(
    propertiesWidgetController: PropertiesWidgetController, 
    componentData: ComponentData | undefined, 
    property: Property<any>, 
    propertyCategory: PropertyCategory,
    propertyRecordPath: string[],
    inputName: string, 
    componentID: string | null,  
    componentSetter: React.Dispatch<React.SetStateAction<any>> | null,
    key?: number
){
    if(componentSetter == null){
        console.log("componentSetter == null")
        return;
    }

    const inputType = property.type;

    switch(inputType){

        case "text":{
            const text = <p key={key}>{property.value}</p>
            return text;
        }


        case "link":{
            const text = <p key={key}>{propertiesWidgetController.getDependantProperty(property, componentData)}</p>
            return text;
        }

        case "string":{
            console.log()
            const input = <input key={key} className="propertyInput" id={`${inputName}`} type="text" name={`${inputName}`} value={property.value ?? ""} onChange={(event) => {propertiesWidgetController.keyboardInputOnChange(event, property, propertyCategory, propertyRecordPath, inputName, componentID, componentSetter)}}/>
            return input;
        }

        case "number":{

            const input = <input key={key} className="propertyInput" id={`${inputName}`} type="number" name={`${inputName}`} value={`${property.value ?? ""}`} onChange={(event) => {propertiesWidgetController.keyboardInputOnChange(event, property, propertyCategory, propertyRecordPath, inputName, componentID, componentSetter)}}/>     
            return input;
        }

        case "boolean":{
            return <input key={key} className="propertyInput" id={`${inputName}`} type="checkbox" checked={property.value ?? false} name={`${inputName}`} onChange={(event) => {propertiesWidgetController.checkBoxOnChange(event, property, propertyCategory, propertyRecordPath, inputName, componentID, componentSetter)}}/>
        }

        case "select":{

            if(property.options == undefined){
                return;
            }
            
            return <select name={`${key}`} id={`${key}`} onChange={(event) => {propertiesWidgetController.onSelectChange(event, property, propertyCategory, propertyRecordPath, inputName, componentID, componentSetter)}}>
                {property.options.map((option: string, index: number) => {
                    return <option key={key + "_" + index} value={`${option}`} selected={option == property.value}>{option}</option>
                })}
            </select>
        }

        case "edgeType":{

            if(property.options == undefined){
                return;
            }
            
            return <select name={`${key}`} id={`${key}`} onChange={(event) => {propertiesWidgetController.onSelectChange(event, property, propertyCategory, propertyRecordPath, inputName, componentID, componentSetter)}}>
                {property.options.map((option: string, index: number) => {
                    return <option key={key + "_" + index} value={`${option}`} selected={option == property.value}>{option}</option>
                })}
            </select>
        }


        case "tags":{

            if(property.value == null){
                return;
            }
            
            return <details key={inputName} className='propertyBlockWrapper'>
                <summary className='propertyRecordSectionSummary'>{inputName}</summary>
                <div className='propertyRecordSectionWrapper'>
                    {
                        Object.keys(property.value).map((key: string, index: number) => {

                            const newPropertyRecordPath = Array.from(propertyRecordPath);
                            newPropertyRecordPath.push(inputName);

                            return renderPropertyRow(
                                key,
                                property.value[key],
                                propertiesWidgetController,
                                componentData,
                                propertyCategory,
                                newPropertyRecordPath,
                                componentID,
                                componentSetter,
                                index
                            );
                        })
                    }
                </div>
            </details>;
        }

        case "json": {
            return <textarea name="" id=""></textarea>
        }

        case "propertyArray": {


            return <details key={inputName} className='propertyBlockWrapper'>
                <summary className='propertyRecordSectionSummary'>{inputName}</summary>
                <div className='propertyRecordSectionWrapper'>
                    {
                        property.value.map((value: number, index: number) => {

                            const newPropertyRecordPath = Array.from(propertyRecordPath);
                            newPropertyRecordPath.push(inputName);

                            return renderPropertyRow(
                                index.toString(),
                                property.value[index],
                                propertiesWidgetController,
                                componentData,
                                propertyCategory,
                                newPropertyRecordPath,
                                componentID,
                                componentSetter,
                                index
                            );
                        })
                    }
                </div>
            </details>;
        
        }
    }

    return <div>input</div>

}




export default memo(PropertiesWidget)