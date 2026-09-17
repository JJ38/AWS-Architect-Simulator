import { LoadSavePopUpModel } from "../Models/LoadSavePopUpModel";

export class LoadSavePopUpController{

    public model = new LoadSavePopUpModel();
    private setShowLoadPopUp: React.Dispatch<React.SetStateAction<boolean>> | null = null;

    public constructor(setShowLoadPopup: React.Dispatch<React.SetStateAction<boolean>>){
        this.setShowLoadPopUp = setShowLoadPopup;
    }

    public handleCancelClick (){
        console.log(this.setShowLoadPopUp);

        if(this.setShowLoadPopUp == null){
            return;
        }

        this.setShowLoadPopUp(false);
    }

    public handleLoadClick (){
        console.log("Load click from controller");

        if(this.setShowLoadPopUp == null){
            return;
        }

        this.setShowLoadPopUp(false);

    }

    public handleSavePillClick (){

        if(this.setShowLoadPopUp == null){
            return;
        }

        this.setShowLoadPopUp(false);

    }

   

}