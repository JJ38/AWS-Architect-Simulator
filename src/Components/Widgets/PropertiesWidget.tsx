import { memo, useState } from 'react';
import { PropertiesWidgetController } from '../../Controllers/PropertiesWidgetController';
import type { AppEdge, AppNode, Property } from '../../types';
import '../../styles/PropertiesWidget.css'
import type { Edge } from '@xyflow/react';


function PropertiesWidget(
    { 
        stateSelectedNodeID, 
        setSelectedNodeID, 
        stateNodes, 
        setNodes, 
        stateEdges, 
        selectedNode,
        selectedEdge 
    }
        : 
    { 
        stateSelectedNodeID: string | null, 
        setSelectedNodeID: React.Dispatch<React.SetStateAction<string | null>>, 
        stateNodes: AppNode[], 
        setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>, 
        stateEdges: Edge[],
        selectedNode: AppNode | undefined,
        selectedEdge: AppEdge | undefined
    }
){
 
    const [statePropertiesWidgetController] = useState(() => new PropertiesWidgetController(setSelectedNodeID, setNodes));


    const selectedComponent = selectedNode != undefined ? selectedNode : selectedEdge != null ? selectedEdge : null;
    const componentProperties: Record<string, Property<any>> | undefined = selectedComponent != null ? selectedComponent?.data?.properties : undefined;

    console.log(selectedComponent);
    console.log(componentProperties);

    console.log(selectedEdge);

    return(

        <div className="propertiesWidgetWrapper">

            {
                selectedNode != null &&

                    <div>
                        <p className="propertyInfo">Node ID`: {selectedNode.id}</p>
                        <p className="propertyInfo">Description: {selectedNode?.data?.service.description}</p> 
                    </div>         
            }

            {
                selectedEdge != null &&

                    <div>
                        <p className="propertyInfo">Node ID`: {selectedEdge.id}</p>
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
                            {getPropertyInput(statePropertiesWidgetController, componentProperties[inputName], inputName, selectedNode?.id == undefined ? null : selectedNode.id)}
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