import { useState } from 'react';
import { LoadSavePopUpController } from '../Controllers/LoadSaveWidgetController';
import '../styles/LoadSaveWidget.css'
import RoundedButton from './RoundedButton'

export default function LoadSavePopUp({ setShowLoadPopup }: {setShowLoadPopup: React.Dispatch<React.SetStateAction<boolean>>}){
    
    const [stateLoadSavePopUpController] = useState(() => new LoadSavePopUpController(setShowLoadPopup));

    return(
        <div className="popupWrapper">
            ejfiesjifoo
            <div className="loadSavePopupButtonWrapper">

                <RoundedButton
                    onClickHandler={stateLoadSavePopUpController.handleCancelClick}
                    buttonText='Cancel'
                />

                <RoundedButton
                    onClickHandler={stateLoadSavePopUpController.handleSaveClick}
                    buttonText='Save'
                />

            </div>

        </div>
    )

}