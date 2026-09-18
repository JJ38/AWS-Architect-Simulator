import { useState } from 'react';
import { LoadSaveWidgetController } from '../../Controllers/LoadSaveWidgetController';
import { useNotification } from '../../Providers/NotificationProvider';
import type { Edge, Node } from '@xyflow/react';
import '../../styles/LoadSaveWidget.css'
import RoundedButton from '../Buttons/RoundedButton'
import SavePill from '../SavePill';

export default function LoadSavePopUp({ setShowLoadWidget, setEdges, setNodes, setLoadedSaveName }: {setShowLoadWidget: React.Dispatch<React.SetStateAction<boolean>>; setEdges: React.Dispatch<React.SetStateAction<Edge[]>>; setNodes: React.Dispatch<React.SetStateAction<Node[]>>; setLoadedSaveName: React.Dispatch<React.SetStateAction<string | null>>}){

    const showNotification = useNotification();

    const [stateSelectedSave, setSelectedSave] = useState<string | null>(null);
    const [stateLoadSaveWidgetController] = useState(() => new LoadSaveWidgetController(setShowLoadWidget, showNotification, setEdges, setNodes, setLoadedSaveName));
    console.log(stateSelectedSave)
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
                />

                <RoundedButton
                    onClickHandler={() => stateLoadSaveWidgetController.handleLoadClick(stateSelectedSave)}
                    buttonText='Load'
                />

            </div>

        </div>
    )

}