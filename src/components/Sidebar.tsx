import type { Service } from '../types.tsx';
import '../styles/Sidebar.css';
import SidebarButton from './SidebarButton';

const services: Service[] = [
    { name: 'EC2', description: 'Elastic Compute Cloud', icon: 'serviceIcons/Res_Amazon-EC2_Instance_48.svg', image: 'serviceImages/Arch_Amazon-EC2_64.svg' },
    { name: 'S3', description: 'Simple Storage Service', icon: 'serviceIcons/Res_Amazon-Simple-Storage-Service_S3-Standard_48.svg', image: 'serviceImages/Arch_Amazon-Simple-Storage-Service_64.svg' },
    { name: 'Lambda', description: 'Serverless Computing Service', icon: 'serviceIcons/Res_AWS-Lambda_Lambda-Function_48.svg', image: 'serviceImages/Arch_AWS-Lambda_64.svg' }
]

export default function Sidebar({ selectedService, setSelectedService }: { selectedService: Service | null; setSelectedService: (service: Service | null) => void}){
    return <div className="sidebar">

            {
                services.map((service) => (
                    <SidebarButton 
                        serviceName={service.name} 
                        serviceDescription={service.description} 
                        serviceImg={service.icon} 
                        key={service.name} 
                        isSelected={selectedService?.name === service.name}
                        onClick={() => handleSidebarButtonClick(selectedService, setSelectedService, service)}
                    />
                ))
            }

        </div>;
  
}

function handleSidebarButtonClick(selectedService: Service | null, setSelectedService: (service: Service | null) => void, service: Service){
    
    if(selectedService?.name === service.name){
        setSelectedService(null);
        return;
    }

    setSelectedService(service);

}