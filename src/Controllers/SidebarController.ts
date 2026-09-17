import type { Service } from "../types";

export class SidebarController{

    private setShowLoadPopup: React.Dispatch<React.SetStateAction<boolean>>;
    private setShowSavePopup: React.Dispatch<React.SetStateAction<boolean>>;
    private setSelectedService: React.Dispatch<React.SetStateAction<Service | null>>;
    private selectedService: Service | null;
    private showNotification: (success: boolean, message: string) => void;

    public constructor(setShowLoadPopup: React.Dispatch<React.SetStateAction<boolean>>, setShowSavePopup: React.Dispatch<React.SetStateAction<boolean>>, selectedService: Service | null, setSelectedService: React.Dispatch<React.SetStateAction<Service | null>>, showNotification: (success: boolean, message: string) => void){
        this.setShowLoadPopup = setShowLoadPopup;
        this.setShowSavePopup = setShowSavePopup;
        this.setSelectedService = setSelectedService;
        this.selectedService = selectedService;
        this.showNotification = showNotification;
    }

  
    public handleSaveButtonClick(): void{

        this.setShowSavePopup(true);
    
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