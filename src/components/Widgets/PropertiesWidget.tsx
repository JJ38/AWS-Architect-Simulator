import { useState } from "react";
import { useNotification } from "../../Providers/NotificationProvider";
import { PropertiesWidgetController } from "../../Controllers/PropertiesWidgetController";

export default function PropertiesWidget(){

    const showNotification = useNotification();
    const [stateSaveWidgetController] = useState(() => new PropertiesWidgetController(showNotification));

    return(
        
        <div className="propertiesWidgetWrapper">

            <div className="propertiesWidgetButtonWrapper">

               

            </div>

        </div>

    );

}