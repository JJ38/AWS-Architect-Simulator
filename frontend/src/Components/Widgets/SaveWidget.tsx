import { useState } from 'react';
import type { Edge, Node } from '@xyflow/react';
import { useNotification } from '../../Providers/NotificationProvider';
import { SaveWidgetController } from '../../Controllers/SaveWidgetController';
import '../../styles/SaveWidget.css'
import RoundedButton from '../Buttons/RoundedButton'
import type { AppEdge, AppNode, ComponentData } from '../../types';

export default function SaveWidget({ 
    setShowSaveWidget, 
    stateLoadedSaveName, 
    setLoadedSaveName, 
    stateNodes,
    stateNodesData, 
    stateEdges,
    stateEdgesData,
    stateDeploymentSettings 
}
    : 
{
    setShowSaveWidget: React.Dispatch<React.SetStateAction<boolean>>; 
    stateLoadedSaveName: string | null; 
    setLoadedSaveName: React.Dispatch<React.SetStateAction<string | null>>; 
    stateNodes: AppNode[], 
    stateNodesData: ComponentData[],
    stateEdges: AppEdge[],
    stateEdgesData: ComponentData[],
    stateDeploymentSettings: Record<string, any>
}){

    const showNotification = useNotification();
    const [stateSelectedSave, setSelectedSave] = useState<string | null>(null);
    const [stateSaveWidgetController] = useState(() => new SaveWidgetController(setShowSaveWidget, showNotification));
    console.log(stateSelectedSave)
    return(

        <div className="saveWidgetWrapper">

            <div className="saveWidgetButtonWrapper">

                <RoundedButton
                    onClickHandler={() => stateSaveWidgetController.handleCancelClick()}
                    buttonText='Cancel' 
                    className=''               
                />
                
                {

                    stateLoadedSaveName &&

                    <RoundedButton
                        onClickHandler={() => stateSaveWidgetController.handleSaveClick(stateLoadedSaveName, stateNodes, stateNodesData, stateEdges, stateEdgesData, stateDeploymentSettings)}
                        buttonText='Save'
                        className=''
                    />

                }

                <RoundedButton
                    onClickHandler={() => stateSaveWidgetController.handleSaveAsClick(stateNodes, stateNodesData, stateEdges,stateEdgesData, stateDeploymentSettings, setLoadedSaveName)}
                    buttonText='Save As'
                    className=''
                />

            </div>

        </div>
    )

}