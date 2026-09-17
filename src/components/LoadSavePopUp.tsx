import { useState } from 'react';
import { LoadSavePopUpController } from '../Controllers/LoadSavePopUpController';
import '../styles/LoadSavePopUp.css'
import RoundedButton from '../Components/RoundedButton'
import SavePill from './SavePill';

export default function LoadSavePopUp({ setShowLoadPopup }: {setShowLoadPopup: React.Dispatch<React.SetStateAction<boolean>>}){
    
    const [stateLoadSavePopUpController] = useState(() => new LoadSavePopUpController(setShowLoadPopup));
    const [stateSelectedSave, setSelectedSave] = useState<string | null>(null);

    console.log("stateSelectedSave: " + stateSelectedSave)
    console.log(stateLoadSavePopUpController.model.saveKeys)

    return(

        <div className="popupWrapper">

            {
                stateLoadSavePopUpController.model.saveKeys.map((key) => (
                    <SavePill
                        saveName={key}
                        isSelected={stateSelectedSave === key}
                        onClickHandler={() => setSelectedSave(key)}
                        key={key} 
                    />
                ))
        
            }

            <div className="loadSavePopupButtonWrapper">

                <RoundedButton
                    onClickHandler={() => stateLoadSavePopUpController.handleCancelClick()}
                    buttonText='Cancel'
                />

                <RoundedButton
                    onClickHandler={() => stateLoadSavePopUpController.handleLoadClick()}
                    buttonText='Load'
                />

            </div>

        </div>
    )

}