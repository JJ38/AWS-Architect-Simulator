import { memo, useState } from 'react';
import { PropertiesWidgetController } from '../../Controllers/PropertiesWidgetController';
import type { AppEdge, AppNode, EdgeData, Property, ResourceNodeData } from '../../types';
import '../../styles/PropertiesWidget.css'


function PropertiesWidget(
    { 
        stateSelectedNodeID, 
        setSelectedNodeID, 
        selectedNodeData,
        setNodes, 
        stateSelectedEdgeID,
        selectedEdgeData, 
        setEdges,
    }
        : 
    { 
        stateSelectedNodeID: string | null, 
        setSelectedNodeID: React.Dispatch<React.SetStateAction<string | null>>, 
        selectedNodeData: ResourceNodeData | undefined,
        setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>, 
        stateSelectedEdgeID: string | null,
        selectedEdgeData: EdgeData | undefined,
        setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>, 
    }
){
 
    const [statePropertiesWidgetController] = useState(() => new PropertiesWidgetController(setNodes, setEdges));


    const selectedComponent = selectedNodeData != undefined ? selectedNodeData : selectedEdgeData != null ? selectedEdgeData : null;
    const componentProperties: Record<string, Property<any>> | undefined = selectedComponent != null ? selectedComponent?.properties : undefined;

    console.log(selectedComponent);
    console.log(componentProperties);


    return(

        <div className="propertiesWidgetWrapper">

            {
                selectedNodeData != null &&

                    <div>
                        <p className="propertyInfo">Node ID`: {stateSelectedNodeID}</p>
                        <p className="propertyInfo">Description: {selectedNodeData?.service.description}</p> 
                    </div>         
            }

            {
                selectedEdgeData != null &&

                    <div>
                        <p className="propertyInfo">Node ID`: {stateSelectedEdgeID}</p>
                    </div>
            }

            {

                selectedComponent == undefined &&

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
                            {getPropertyInput(statePropertiesWidgetController, componentProperties[inputName], inputName, stateSelectedNodeID)}
                        </div>

                    })

                :

                    <></>

            }

            </div>

        </div>
    );

}


function getPropertyInput(propertiesWidgetController: PropertiesWidgetController, Property: Property<any>, inputName: string, stateSelectedNodeID: string | null){
    
    const inputType = Property.type;

    switch(inputType){

        case "string":{

            const input = <input className="propertyInput" id={`${inputName}`} type="text" name={`${inputName}`} value={Property.value ?? ""} onChange={(event) => {propertiesWidgetController.stringOnChange(event, Property, inputName, stateSelectedNodeID)}}/>
            
            return input;
        }

        case "number":{

            const input = <input className="propertyInput" id={`${inputName}`} type="number" name={`${inputName}`} value={`${Property.value ?? ""}`}/>
            
            return input;
        }

        case "boolean":
            return <input className="propertyInput" id={`${inputName}`} type="checkbox" name={`${inputName}`}/>

         case "tags":
            return <textarea className="propertyInput" id={`${inputName}`} name={`${inputName}`}/>

    }

    return <div>input</div>

}




export default memo(PropertiesWidget)