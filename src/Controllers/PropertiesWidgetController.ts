export class PropertiesWidgetController{

    public showNotification: (success: boolean, message: string) => void

    public constructor(showNotification: (success: boolean, message: string) => void){
        this.showNotification = showNotification;
    }

}