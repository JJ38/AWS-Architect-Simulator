import type { Edge, Node } from "@xyflow/react";
import type { Service } from "../types";

export class SidebarController{

    private setShowLoadPopup: React.Dispatch<React.SetStateAction<boolean>>;
    private setSelectedService: React.Dispatch<React.SetStateAction<Service | null>>;
    private selectedService: Service | null;


    public constructor(setShowLoadPopup: React.Dispatch<React.SetStateAction<boolean>>, selectedService: Service | null, setSelectedService: React.Dispatch<React.SetStateAction<Service | null>>){
        this.setShowLoadPopup = setShowLoadPopup;
        this.setSelectedService = setSelectedService;
        this.selectedService = selectedService;
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


    public handleSidebarButtonClick(service: Service): void{

        if(this.setSelectedService == null){
            return;
        }
    
        if(this.selectedService?.name === service.name){
            this.setSelectedService(null);
            return;
        }

        this.setSelectedService(service);

    }


}