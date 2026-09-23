import { memo, useState } from 'react';
import { PropertiesWidgetController } from '../../Controllers/PropertiesWidgetController';
import type { AppNode, NodeProperty } from '../../types';
import '../../styles/PropertiesWidget.css'


function PropertiesWidget({ stateSelectedNode }: { stateSelectedNode: AppNode | null }){

    const [statePropertiesWidgetController] = useState(() => new PropertiesWidgetController());

    const label: any = stateSelectedNode?.['data']['label'];

    const nodeProperties: Record<string, NodeProperty<any>> | undefined = stateSelectedNode?.data.resource?.properties;
    console.log(stateSelectedNode?.data.resource?.properties);
    //get data for selected node from stateNodes
    return(

        <div className="propertiesWidgetWrapper">

            {

                stateSelectedNode != null ?

                    <div>
                        <p className="propertyInfo">Node ID: {stateSelectedNode?.id}</p>
                        <p className="propertyInfo">Label: {label}</p> 
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
                            {getPropertyInput(nodeProperties[inputName], inputName)}
                        </div>

                    })

                :

                    <></>

            }

            </div>


        </div>
    );

}


function getPropertyInput(nodeProperty: NodeProperty<any>, inputName: string){
    console.log(nodeProperty)
    const inputType = nodeProperty.type;

    switch(inputType){

        case "string":
            return <input className="propertyInput" id={`${inputName}`} type="text" name={`${inputName}`}/>

        case "boolean":
            return <input className="propertyInput" id={`${inputName}`} type="checkbox" name={`${inputName}`}/>

         case "tags":
            return <textarea className="propertyInput" id={`${inputName}`} name={`${inputName}`}/>

    }

    return <div>input</div>

}

export default memo(PropertiesWidget)