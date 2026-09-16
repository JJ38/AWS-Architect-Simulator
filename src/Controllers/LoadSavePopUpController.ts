export class LoadSavePopUpController{

    setShowLoadPopUp: React.Dispatch<React.SetStateAction<boolean>> | null = null;

    public handleCancelClick (){
        // console.log("cancel click from controller");
        // this.setShowLoadPopUp?(false);
    }

    public handleSaveClick (){
        console.log("save click from controller")
    }

    public constructor(setShowLoadPopup: React.Dispatch<React.SetStateAction<boolean>>){
        this.setShowLoadPopUp
    }


}