import { memo, useState } from 'react';
import { PropertiesWidgetController } from '../../Controllers/PropertiesWidgetController';
import type { AppNode, NodeProperty } from '../../types';
import '../../styles/PropertiesWidget.css'
import type { Edge } from '@xyflow/react';


function PropertiesWidget(
    { 
        stateSelectedNodeID, 
        setSelectedNodeID, 
        stateNodes, 
        setNodes, 
        stateEdges, 
        selectedNode 
    }
        : 
    { 
        stateSelectedNodeID: string | null, 
        setSelectedNodeID: React.Dispatch<React.SetStateAction<string | null>>, 
        stateNodes: AppNode[], 
        setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>, 
        stateEdges: Edge[],
        selectedNode: AppNode | undefined
    }
){
 
    const [statePropertiesWidgetController] = useState(() => new PropertiesWidgetController(setSelectedNodeID, setNodes));

    const nodeProperties: Record<string, NodeProperty<any>> | undefined = selectedNode?.data.resourceData?.properties;
    
    console.log("PropertiesWidget");

    return(

        <div className="propertiesWidgetWrapper">

            {

                selectedNode != undefined ?

                    <div>
                        <p className="propertyInfo">Node ID: {selectedNode.id}</p>
                        {/* <p className="propertyInfo">Description: {selectedNode?.data.service.description}</p>  */}
                    </div>
                
                : 

                    <div className="checkboxWrapper">
                        <input type="checkbox" id="snapgridCheckbox" name="snapgridCheckbox"/>
                        <label htmlFor="snapgridCheckbox">Snap Grid</label>
                    </div>            
            
            }
            
            <div className="propertiesWrapper">

            {

                nodeProperties != null && nodeProperties != undefined? 

                    Object.keys(nodeProperties).map((inputName) => {

                        return <div className='propertyInputWrapper' key={inputName} >
                            <p className='propertyName'>{inputName}</p>
                            {getPropertyInput(statePropertiesWidgetController, nodeProperties[inputName], inputName, selectedNode?.id == undefined ? null : selectedNode.id)}
                        </div>

                    })

                :

                    <></>

            }

            </div>

        </div>
    );

}


function getPropertyInput(propertiesWidgetController: PropertiesWidgetController, nodeProperty: NodeProperty<any>, inputName: string, stateSelectedNodeID: string | null){
    
    const inputType = nodeProperty.type;

    switch(inputType){

        case "string":{

            const input = <input className="propertyInput" id={`${inputName}`} type="text" name={`${inputName}`} value={nodeProperty.value ?? ""} onChange={(event) => {propertiesWidgetController.stringOnChange(event, nodeProperty, inputName, stateSelectedNodeID)}}/>
            
            return input;
        }

        case "number":{

            const input = <input className="propertyInput" id={`${inputName}`} type="number" name={`${inputName}`} value={`${nodeProperty.value ?? ""}`}/>
            
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