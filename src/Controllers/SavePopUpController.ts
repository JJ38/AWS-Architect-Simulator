import type { Edge, Node } from "@xyflow/react";

export class SavePopUpController{

    private setShowSavePopup: React.Dispatch<React.SetStateAction<boolean>>;
    private showNotification: (success: boolean, message: string) => void;

    public constructor(setShowSavePopup: React.Dispatch<React.SetStateAction<boolean>>, showNotification: (success: boolean, message: string) => void){
        this.setShowSavePopup = setShowSavePopup;
        this.showNotification = showNotification;
    }

    public handleCancelClick(){
        console.log("cancel clicked");
        this.setShowSavePopup(false);
    }

    public handleSaveClick(stateLoadedSaveName: string | null, stateNodes: Node[], stateEdges: Edge[]){

        console.log(stateLoadedSaveName);
        this.save(stateLoadedSaveName, stateNodes, stateEdges);
        this.setShowSavePopup(false);

    }

    public handleSaveAsClick(stateNodes: Node[], stateEdges: Edge[]){

        const saveName = window.prompt("Enter a name for this save:");
        this.save(saveName, stateNodes, stateEdges);
        this.setShowSavePopup(false);

    }


    private save(saveName: string | null, stateNodes: Node[], stateEdges: Edge[]): void{

        if(saveName === "" || saveName === null || saveName === undefined){
            this.showNotification(false, "Error - invalid save name");
            return;
        }

        const save = {
            nodes: stateNodes,
            edges: stateEdges
        }

        try{

            const JSONSave = JSON.stringify(save);
            localStorage.setItem(saveName!, JSONSave);

        }catch (error){

            console.log(error);
            this.showNotification(false, "Error saving " + saveName);
            return;

        }

        this.showNotification(true, saveName + " saved successfully");

    }

}