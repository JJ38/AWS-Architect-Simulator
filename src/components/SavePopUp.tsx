import { useState } from 'react';
import type { Edge, Node } from '@xyflow/react';
import { useNotification } from '../Providers/NotificationProvider';
import { SavePopUpController } from '../Controllers/SavePopUpController';
import '../styles/SavePopUp.css'
import RoundedButton from '../Components/RoundedButton'

export default function SavePopUp({ setShowSavePopup, stateLoadedSaveName, setLoadedSaveName, stateNodes, stateEdges }: {setShowSavePopup: React.Dispatch<React.SetStateAction<boolean>>; stateLoadedSaveName: string | null; setLoadedSaveName: React.Dispatch<React.SetStateAction<string | null>>; stateNodes: Node[], stateEdges: Edge[]}){

    const showNotification = useNotification();
    const [stateSelectedSave, setSelectedSave] = useState<string | null>(null);
    const [stateSavePopUpController] = useState(() => new SavePopUpController(setShowSavePopup, showNotification));
    console.log(stateSelectedSave)
    return(

        <div className="savePopupWrapper">

            <div className="savePopupButtonWrapper">

                <RoundedButton
                    onClickHandler={() => stateSavePopUpController.handleCancelClick()}
                    buttonText='Cancel'
                />
                
                {

                    stateLoadedSaveName &&

                    <RoundedButton
                        onClickHandler={() => stateSavePopUpController.handleSaveClick(stateLoadedSaveName, stateNodes, stateEdges)}
                        buttonText='Save'
                    />

                }

                <RoundedButton
                    onClickHandler={() => stateSavePopUpController.handleSaveAsClick(stateNodes, stateEdges, setLoadedSaveName)}
                    buttonText='Save As'
                />

            </div>

        </div>
    )

}