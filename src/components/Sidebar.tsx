import '../styles/Sidebar.css';
import SidebarButton from './SidebarButton';

const services = [
    { name: 'EC2', description: 'Elastic Compute Cloud', img: 'serviceImages/Res_Amazon-EC2_Instance_48.svg' },
    { name: 'S3', description: 'Simple Storage Service', img: 'serviceImages/Res_Amazon-Simple-Storage-Service_S3-Standard_48.svg' },
    { name: 'Lambda', description: 'Serverless Computing Service', img: 'serviceImages/Res_AWS-Lambda_Lambda-Function_48.svg' }
]

export default function Sidebar({ selectedService, setSelectedService }: { selectedService: string | null; setSelectedService: (service: string | null) => void}){
    return <div className="sidebar">

            {
                services.map((service) => (
                    <SidebarButton 
                        serviceName={service.name} 
                        serviceDescription={service.description} 
                        serviceImg={service.img} 
                        key={service.name} 
                        isSelected={selectedService === service.name}
                        onClick={() => handleSidebarButtonClick(selectedService, setSelectedService, service.name)}
                    />
                ))
            }

        </div>;
  
}

function handleSidebarButtonClick(selectedService: string | null, setSelectedService: (service: string | null) => void, serviceName: string){

    console.log("current selected service: " + selectedService);
    console.log("clicked service: " + serviceName);

    setSelectedService(serviceName == selectedService ? null : serviceName);

    console.log("new selectedService value: " + selectedService);

}