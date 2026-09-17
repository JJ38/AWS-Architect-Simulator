import { useState } from 'react';
import { useNotification } from '../Providers/NotificationProvider';
import '../styles/LoadSavePopUp.css'
import RoundedButton from '../Components/RoundedButton'
import SavePill from './SavePill';
import { SavePopUpController } from '../Controllers/SavePopUpController';

export default function SavePopUp({ setShowSavePopup, stateLoadedSaveName }: {setShowSavePopup: React.Dispatch<React.SetStateAction<boolean>>; stateLoadedSaveName: string | null}){

    const showNotification = useNotification();
    const [stateSelectedSave, setSelectedSave] = useState<string | null>(null);
    const [stateSavePopUpController] = useState(() => new SavePopUpController(setShowSavePopup, showNotification));
    console.log(stateSelectedSave)
    return(

        <div className="popupWrapper">

            {/* <div className='savePillsWrapper'>

                {
                    stateSavePopUpController.model.saveKeys.map((key) => (
                        <SavePill
                            saveName={key}
                            isSelected={stateSelectedSave === key}
                            onClickHandler={() => setSelectedSave(key)}
                            key={key} 
                        />
                    ))
            
                }

            </div> */}

            <div className="loadSavePopupButtonWrapper">

                <RoundedButton
                    onClickHandler={() => stateSavePopUpController.handleCancelClick()}
                    buttonText='Cancel'
                />
                
                {

                    stateLoadedSaveName &&

                    <RoundedButton
                        onClickHandler={() => stateSavePopUpController.handleSaveClick(stateLoadedSaveName)}
                        buttonText='Save'
                    />

                }

                <RoundedButton
                    onClickHandler={() => stateSavePopUpController.handleSaveAsClick()}
                    buttonText='Save As'
                />

            </div>

        </div>
    )

}