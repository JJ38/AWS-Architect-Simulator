import { useState } from 'react';
import { LoadSaveWidgetController } from '../../Controllers/LoadSaveWidgetController';
import { useNotification } from '../../Providers/NotificationProvider';
import '../../styles/LoadSaveWidget.css'
import RoundedButton from '../Buttons/RoundedButton'
import SavePill from '../SavePill';
import { useConfirmation } from '../../Providers/ConfirmationProvider';
import type { AppEdge, AppNode, ComponentData } from '../../types';

export default function LoadWidget(
    { 
        setShowLoadWidget, 
        setEdges, 
        setEdgesData,
        setNodes,
        setNodesData,
        setDeploymentSettings, 
        setLoadedSaveName 
    }
        : 
    {
        setShowLoadWidget: React.Dispatch<React.SetStateAction<boolean>>; 
        setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>; 
        setEdgesData: React.Dispatch<React.SetStateAction<ComponentData[]>>; 
        setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>;
        setNodesData: React.Dispatch<React.SetStateAction<ComponentData[]>>; 
        setDeploymentSettings: React.Dispatch<React.SetStateAction<Record<string,any>>>; 
        setLoadedSaveName: React.Dispatch<React.SetStateAction<string | null>>
    }){

    const showNotification = useNotification();
    const showConfirmation = useConfirmation();

    const [stateSelectedSave, setSelectedSave] = useState<string | null>(null);
    const [stateLoadSaveWidgetController] = useState(() => new LoadSaveWidgetController(setShowLoadWidget, showNotification, showConfirmation, setEdges, setEdgesData, setNodes, setNodesData, setLoadedSaveName));

    return(

        <div className="loadSaveWidgetWrapper">

            <div className='savePillsWrapper'>

                {
                    stateLoadSaveWidgetController.model.saveKeys.map((key) => (
                        <SavePill
                            saveName={key}
                            isSelected={stateSelectedSave === key}
                            onClickHandler={() => setSelectedSave(key)}
                            key={key} 
                        />
                    ))
            
                }

            </div>

            <div className="loadSaveWidgetButtonWrapper">

                <RoundedButton
                    onClickHandler={() => stateLoadSaveWidgetController.handleCancelClick()}
                    buttonText='Cancel'
                    className=''
                />

                <RoundedButton
                    onClickHandler={() => stateLoadSaveWidgetController.handleDeleteClick(stateSelectedSave)}
                    buttonText='Delete'
                    className=''
                />

                <RoundedButton
                    onClickHandler={() => stateLoadSaveWidgetController.handleLoadClick(stateSelectedSave)}
                    buttonText='Load'
                    className=''
                />

            </div>

        </div>
    )

}