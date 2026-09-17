import { useState } from 'react';
import type { Edge, Node } from '@xyflow/react';
import type { Service } from '../types.ts';
import type { CanvasController } from '../Controllers/CanvasController.ts';
import { SidebarController } from '../Controllers/SidebarController.ts';
import { useNotification } from '../Providers/NotificationProvider.tsx';
import SidebarButton from './ServiceButton.tsx';
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
        stateCanvasController,
        stateNodes,
        stateEdges,
        setShowLoadPopup,
        setShowSavePopup
    }
        :
    {
        selectedService: Service | null;
        setSelectedService: React.Dispatch<React.SetStateAction<Service | null>>;
        stateCanvasController: CanvasController;
        stateNodes: Node[];
        stateEdges: Edge[];
        setShowLoadPopup: React.Dispatch<React.SetStateAction<boolean>>;
        setShowSavePopup: React.Dispatch<React.SetStateAction<boolean>>;
    }
){

    const showNotification = useNotification();
    const [stateSidebarController] = useState(() => new SidebarController(setShowLoadPopup, setShowSavePopup, selectedService, setSelectedService, showNotification));


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
                    serviceName={"Djkawdwad"} 
                    serviceDescription={"dwadwad"} 
                    serviceImg={"load_icon.svg"} 
                    key={"dwadawd"} 
                    isSelected={false}
                    onClick={() => stateSidebarController.handleLoadClick()}
                />

                <SidebarButton  
                    serviceName={"dawdwad"} 
                    serviceDescription={"dwadwad"} 
                    serviceImg={"save_icon.svg"} 
                    key={"dwawafgsgs"} 
                    isSelected={false}
                    onClick={() => stateSidebarController.handleSaveButtonClick()}
                />
            </div>

        </div>;
  
}

