import { useState } from "react";
import { TerraformWidgetController } from "../../Controllers/TerraformWidgetController";
import { useNotification } from "../../Providers/NotificationProvider";
import type { Edge, Node } from "@xyflow/react";
import RoundedButton from "../Buttons/RoundedButton";



export default function TerraformWidget({ setShowTerraformWidget, stateNodes, setNodes, stateEdges, setEdges }: { setShowTerraformWidget: React.Dispatch<React.SetStateAction<boolean>>, stateNodes: Node[] , setNodes: React.Dispatch<React.SetStateAction<Node[]>>, stateEdges: Edge[], setEdges: React.Dispatch<React.SetStateAction<Edge[]>> }){

    const showNotification = useNotification();
    const [stateTerraformWidgetController] = useState(() => new TerraformWidgetController(setShowTerraformWidget, showNotification, setNodes, setEdges));
    
    return(
         <div className="saveWidgetWrapper">
        
            <div className="saveWidgetButtonWrapper">

                <RoundedButton
                    onClickHandler={() => stateTerraformWidgetController.handleCancelClick()}
                    buttonText='Cancel'
                />
                
                <RoundedButton
                    onClickHandler={() => stateTerraformWidgetController.handleUploadClick()}
                    buttonText='Upload'
                />

                <RoundedButton
                    onClickHandler={() => stateTerraformWidgetController.handleDownloadClick(stateNodes, stateEdges)}
                    buttonText='Download'
                />

            </div>

        </div>
    );

}