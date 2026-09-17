import type { Edge, Node } from "@xyflow/react";

export class SidebarController{

    private setShowLoadPopup: React.Dispatch<React.SetStateAction<boolean>> | null = null;


    public constructor(setShowLoadPopup: React.Dispatch<React.SetStateAction<boolean>>){
        this.setShowLoadPopup = setShowLoadPopup;
    }


  
    public handleSaveButtonClick(stateNodes: Node[], stateEdges: Edge[]): void{

        //show popup that allows you to enter save file name

        const saveName = window.prompt("Enter a name for this save:");

        if(saveName === "" || saveName === null || saveName === undefined){
            return;
        }

        const save = {
            nodes: stateNodes,
            edges: stateEdges
        }

        console.log(save);

        const JSONSave = JSON.stringify(save);

        localStorage.setItem(saveName!, JSONSave);
        const loadedSave = localStorage.getItem(saveName!);

        console.log(loadedSave);
    
    }

    public handleLoadClick(){

        if(this.setShowLoadPopup == null){
            return;
        }
        
        this.setShowLoadPopup(true);
        
    }

}