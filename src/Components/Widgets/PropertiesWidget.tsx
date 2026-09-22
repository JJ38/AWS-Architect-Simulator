import { useState } from 'react';
import { PropertiesWidgetController } from '../../Controllers/PropertiesWidgetController';
import type { Edge, Node } from '@xyflow/react';
import type { Service } from '../../types';
import '../../styles/PropertiesWidget.css'

export default function PropertiesWidget({ stateSelectedNode, stateSelectedService }: { stateSelectedNode: Node | null, stateSelectedService: Service | null, stateNodes: Node[], stateEdges: Edge[]}){

    const [statePropertiesWidgetController] = useState(() => new PropertiesWidgetController());

    const label: any = stateSelectedNode?.['data']['label'];

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
            
        </div>
    );

}