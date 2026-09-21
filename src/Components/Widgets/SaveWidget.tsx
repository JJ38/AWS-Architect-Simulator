import { useState } from 'react';
import type { Edge, Node } from '@xyflow/react';
import { useNotification } from '../../Providers/NotificationProvider';
import { SaveWidgetController } from '../../Controllers/SaveWidgetController';
import '../../styles/SaveWidget.css'
import RoundedButton from '../Buttons/RoundedButton'

export default function SavePopUp({ setShowSaveWidget, stateLoadedSaveName, setLoadedSaveName, stateNodes, stateEdges }: {setShowSaveWidget: React.Dispatch<React.SetStateAction<boolean>>; stateLoadedSaveName: string | null; setLoadedSaveName: React.Dispatch<React.SetStateAction<string | null>>; stateNodes: Node[], stateEdges: Edge[]}){

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
                />
                
                {

                    stateLoadedSaveName &&

                    <RoundedButton
                        onClickHandler={() => stateSaveWidgetController.handleSaveClick(stateLoadedSaveName, stateNodes, stateEdges)}
                        buttonText='Save'
                    />

                }

                <RoundedButton
                    onClickHandler={() => stateSaveWidgetController.handleSaveAsClick(stateNodes, stateEdges, setLoadedSaveName)}
                    buttonText='Save As'
                />

            </div>

        </div>
    )

}