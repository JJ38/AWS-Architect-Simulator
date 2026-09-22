import { useState } from 'react';
import { PropertiesWidgetController } from '../../Controllers/PropertiesWidgetController';
import type { Edge, Node } from '@xyflow/react';
import type { AppNode, Service } from '../../types';
import '../../styles/PropertiesWidget.css'

export default function PropertiesWidget({ stateSelectedNode, stateSelectedService }: { stateSelectedNode: AppNode | null, stateSelectedService: Service | null }){


    //Expected, and worth fixing before you build the form. Dragging any node updates stateNodes in Layout.tsx every frame → cascades down through Canvas → PropertiesWidget, even though the props PropertiesWidget actually reads (stateSelectedNode, stateSelectedService) haven't changed — this is entry 14 in react-concepts.md, the default "parent re-renders, every descendant re-renders" cascade.

    // Good news: stateSelectedNode is a separate state var, only updated on click, so its reference stays stable through a drag even if you're dragging the selected node itself. That means React.memo is a clean, complete fix here, not a partial one:

    // export default memo(function PropertiesWidget({ stateSelectedNode, stateSelectedService }: {...}) {
    //   ...
    // });

    // Worth adding now, before the form exists — a form re-mounting every drag frame would be a real bug (lost focus/cursor position on any input being typed into), not just wasted work.

    const [statePropertiesWidgetController] = useState(() => new PropertiesWidgetController());

    const label: any = stateSelectedNode?.['data']['label'];

    // const nodeProperties = stateSelectedNode?.data.resource.properties;
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


            {/* {

                Object.keys(nodeProperties).map((key) => {

                    return <div>
                        <p>{key}</p>
                        <p>{nodeProperties[key]}</p>
                    </div>

                })

            } */}


        </div>
    );

}