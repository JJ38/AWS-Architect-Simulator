import { useState } from 'react';
import type { Service } from '../types.ts';
import { SidebarController } from '../Controllers/SidebarController.ts';
import { useNotification } from '../Providers/NotificationProvider.tsx';
import SidebarButton from './Buttons/ServiceButton.tsx';
import '../styles/Sidebar.css';

const services: Service[] = [
    { name: 'EC2', description: 'Elastic Compute Cloud', icon: 'serviceIcons/Res_Amazon-EC2_Instance_48.svg', image: 'serviceImages/Arch_Amazon-EC2_64.svg' },
    { name: 'S3', description: 'Simple Storage Service', icon: 'serviceIcons/Res_Amazon-Simple-Storage-Service_S3-Standard_48.svg', image: 'serviceImages/Arch_Amazon-Simple-Storage-Service_64.svg' },
    { name: 'Lambda', description: 'Serverless Computing Service', icon: 'serviceIcons/Res_AWS-Lambda_Lambda-Function_48.svg', image: 'serviceImages/Arch_AWS-Lambda_64.svg' },
    { name: 'API Gateway', description: 'Serverless Computing Service', icon: 'serviceIcons/Res_Amazon-API-Gateway_Endpoint_48.svg', image: 'serviceImages/Arch_Amazon-API-Gateway_64.svg' }
]

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

