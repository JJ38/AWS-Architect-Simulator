import { LoadSaveWidgetModel } from "../Models/LoadSaveWidgetModel";
import type { AppEdge, AppNode, ComponentData } from "../types";

export class LoadSaveWidgetController{

    public model = new LoadSaveWidgetModel();
    private setShowLoadWidget: React.Dispatch<React.SetStateAction<boolean>> | null = null;
    private showNotification: (success: boolean, message: string) => void;
    private showConfirmation: () => void;
    private setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>;
    private setEdgesData: React.Dispatch<React.SetStateAction<ComponentData[]>>;
    private setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>;
    private setNodesData: React.Dispatch<React.SetStateAction<ComponentData[]>>;
    private setLoadedSaveName: React.Dispatch<React.SetStateAction<string | null>>;


    public constructor(
        setShowLoadWidget: React.Dispatch<React.SetStateAction<boolean>>, 
        showNotification: (success: boolean, message: string) => void,
        showConfirmation: () => void, 
        setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>,
        setEdgesData: React.Dispatch<React.SetStateAction<ComponentData[]>>,
        setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>, 
        setNodesData: React.Dispatch<React.SetStateAction<ComponentData[]>>,
        setLoadedSaveName: React.Dispatch<React.SetStateAction<string | null>>
    ){
        this.setShowLoadWidget = setShowLoadWidget;
        this.showNotification = showNotification;
        this.showConfirmation = showConfirmation;
        this.setEdges = setEdges;
        this.setEdgesData = setEdgesData;
        this.setNodes = setNodes;
        this.setNodesData = setNodesData;
        this.setLoadedSaveName = setLoadedSaveName;
        console.log("LoadSavePopUpController");
    }

    public handleCancelClick (){

        if(this.setShowLoadWidget == null){
            return;
        }

        this.setShowLoadWidget(false);
    }

    public handleDeleteClick (stateSelectedSave: string | null){

        if(stateSelectedSave == null){ 
            this.showNotification(false, "Select a save to delete it")
            return;
        }

        this.showConfirmation();
    }

    public handleLoadClick (stateSelectedSave: string | null){

        if(this.setShowLoadWidget == null){
            return;
        }

        if(stateSelectedSave == null){ 
            this.showNotification(false, "Select a save to load it");
            return;
        }

        const saveString: string | null = localStorage.getItem(stateSelectedSave);
        
        if(saveString == null){
            this.showNotification(false, "Unable to locate save to load")
            return;
        }

        let edges;
        let nodes;
        let edgesData;
        let nodesData;

        try{

            const saveJSON = JSON.parse(saveString);
            edges = saveJSON['edges'];
            nodes = saveJSON['nodes'];
            edgesData = saveJSON['edgesData'];
            nodesData = saveJSON['nodesData'];

            if(edges == undefined || nodes == undefined || edgesData == undefined || nodesData == undefined){
                this.showNotification(false, "Error - save corrupted");
                return;
            }


            for(let i = 0; i < nodes.length; i++){

                if(nodes[i].data.terraformType == "resource"){

              
                }
            }

        }catch(error){

            console.log(error);
            this.showNotification(false, "Error - failed to load save"); 
            return;

        }

        

        this.setEdges(edges);
        this.setNodes(nodes);
        this.setEdgesData(edgesData);
        this.setNodesData(nodesData);

        this.setLoadedSaveName(stateSelectedSave);
    
        this.setShowLoadWidget(false);

    }

    public handleSaveClick (){

        if(this.setShowLoadWidget == null){
            return;
        }

        this.setShowLoadWidget(false);

    }

   

}