import { useState } from 'react';
import { useNotification } from '../Providers/NotificationProvider';
import { SavePopUpController } from '../Controllers/SavePopUpController';
import '../styles/SavePopUp.css'
import RoundedButton from '../Components/RoundedButton'

export default function SavePopUp({ setShowSavePopup, stateLoadedSaveName }: {setShowSavePopup: React.Dispatch<React.SetStateAction<boolean>>; stateLoadedSaveName: string | null}){

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