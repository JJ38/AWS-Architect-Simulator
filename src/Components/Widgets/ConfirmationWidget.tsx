import { useState } from 'react';
import { ConfirmationWidgetController } from '../../Controllers/ConfirmationWidgetController';
import { useNotification } from '../../Providers/NotificationProvider';
import '../../styles/ConfirmationWidget.css'
import RoundedButton from '../Buttons/RoundedButton'

export default function ConfirmationWidget({ message }: { message: string }){

    const showNotification = useNotification();

    const [stateConfirmationWidgetController] = useState<ConfirmationWidgetController>(() => new ConfirmationWidgetController());


    return(

        <div className="saveWidgetWrapper">

            <p className="confirmationWidgetMessage">{message}</p>

            <div className="saveWidgetButtonWrapper">

                <RoundedButton
                    onClickHandler={() => stateConfirmationWidgetController.handleYesClick()}
                    buttonText='Yes'
                />
                
               <RoundedButton
                    onClickHandler={() => stateConfirmationWidgetController.handleNoClick()}
                    buttonText='No'
                />

            </div>

        </div>
    )

}