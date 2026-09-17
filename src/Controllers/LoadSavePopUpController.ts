import type { Edge, Node } from "@xyflow/react";
import { LoadSavePopUpModel } from "../Models/LoadSavePopUpModel";

export class LoadSavePopUpController{

    public model = new LoadSavePopUpModel();
    private setShowLoadPopUp: React.Dispatch<React.SetStateAction<boolean>> | null = null;
    private showNotification: (success: boolean, message: string) => void;
    private setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
    private setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    private setLoadedSaveName: React.Dispatch<React.SetStateAction<string | null>>;


    public constructor(setShowLoadPopup: React.Dispatch<React.SetStateAction<boolean>>, showNotification: (success: boolean, message: string) => void, setEdges: React.Dispatch<React.SetStateAction<Edge[]>>, setNodes: React.Dispatch<React.SetStateAction<Node[]>>, setLoadedSaveName: React.Dispatch<React.SetStateAction<string | null>>){
        this.setShowLoadPopUp = setShowLoadPopup;
        this.showNotification = showNotification;
        this.setEdges = setEdges;
        this.setNodes = setNodes;
        this.setLoadedSaveName = setLoadedSaveName;
        console.log("LoadSavePopUpController");
    }

    public handleCancelClick (){

        if(this.setShowLoadPopUp == null){
            return;
        }

        this.setShowLoadPopUp(false);
    }

    public handleLoadClick (stateSelectedSave: string | null){

        if(this.setShowLoadPopUp == null){
            return;
        }

        if(stateSelectedSave == null){ 
            this.showNotification(false, "Select a save to load it")
            return;
        }

        const saveString: string | null = localStorage.getItem(stateSelectedSave);
        
        if(saveString == null){
            this.showNotification(false, "Unable to locate save to load")
            return;
        }

        let saveJSON;

        try{

            saveJSON = JSON.parse(saveString);

        }catch(e){

            this.showNotification(false, "Error loading save"); 
            return;

        }

        const edges = saveJSON['edges'];
        const nodes = saveJSON['nodes'];

        console.log(edges);
        console.log(nodes);

        this.setEdges(edges);
        this.setNodes(nodes);

        this.setLoadedSaveName(stateSelectedSave);
    
        this.setShowLoadPopUp(false);

    }

    public handleSavePillClick (){

        if(this.setShowLoadPopUp == null){
            return;
        }

        this.setShowLoadPopUp(false);

    }

   

}