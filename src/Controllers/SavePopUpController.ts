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

    public handleSaveClick(stateLoadedSaveName: string | null){

        //show popup that allows you to enter save file name

        console.log(stateLoadedSaveName);

        // const save = {
        //     nodes: stateNodes,
        //     edges: stateEdges
        // }

        // const JSONSave = JSON.stringify(save);
        // localStorage.setItem(saveName!, JSONSave);

        // this.showNotification(true, "Notification after hook refactor");

    }

    public handleSaveAsClick(){

        
    }


}