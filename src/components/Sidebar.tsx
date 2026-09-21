import { useState } from 'react';
import type { Service } from '../types.ts';
import { SidebarController } from '../Controllers/SidebarController.ts';
import { useNotification } from '../Providers/NotificationProvider.tsx';
import { services } from '../constants.ts';
import SidebarButton from './Buttons/ServiceButton.tsx';
import '../styles/Sidebar.css';


export default function Sidebar(
    {
        selectedService,
        setSelectedService,
        setShowLoadWidget,
        setShowSaveWidget,
        setShowTerraformWidget
    }
        :
    {
        selectedService: Service | null;
        setSelectedService: React.Dispatch<React.SetStateAction<Service | null>>;
        setShowLoadWidget: React.Dispatch<React.SetStateAction<boolean>>;
        setShowSaveWidget: React.Dispatch<React.SetStateAction<boolean>>;
        setShowTerraformWidget: React.Dispatch<React.SetStateAction<boolean>>;
    }
){

    const showNotification = useNotification();
    const [stateSidebarController] = useState(() => new SidebarController(setShowLoadWidget, setShowSaveWidget, selectedService, setSelectedService, setShowTerraformWidget, showNotification));


    return <div className="sidebar">
            <div>

                {
                    services.map((service) => (
                        <SidebarButton 
                            serviceName={service.name} 
                            serviceDescription={service.description} 
                            serviceImg={service.icon} 
                            key={service.name} 
                            isSelected={selectedService?.name === service.name}
                            onClick={() => stateSidebarController.handleSidebarButtonClick(service)}
                        />
                    ))
                }

            </div>


            <div>
                <SidebarButton  
                    serviceName={"Terraform"} 
                    serviceDescription={"Convert to terraform"} 
                    serviceImg={"terraform_wired.svg"} 
                    key={"Terraform"} 
                    isSelected={false}
                    onClick={() => stateSidebarController.handleTerraformClick()}
                />

                <SidebarButton  
                    serviceName={"Load"} 
                    serviceDescription={"Load"} 
                    serviceImg={"load_icon.svg"} 
                    key={"Load"} 
                    isSelected={false}
                    onClick={() => stateSidebarController.handleLoadClick()}
                />

                <SidebarButton  
                    serviceName={"Save"} 
                    serviceDescription={"Save"} 
                    serviceImg={"save_icon.svg"} 
                    key={"Save"} 
                    isSelected={false}
                    onClick={() => stateSidebarController.handleSaveButtonClick()}
                />
            </div>

        </div>;
  
}

