import type { Service } from '../types.tsx';
import '../styles/Sidebar.css';
import SidebarButton from './ServiceButton.tsx';
import type { CanvasController } from '../Controllers/CanvasController.ts';
import type { Edge, Node } from '@xyflow/react';

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
        setNodes,
        stateEdges,
        setEdges,
        setShowLoadPopup
    }
        :
    {
        selectedService: Service | null;
        setSelectedService: (service: Service | null) => void;
        stateCanvasController: CanvasController;
        stateNodes: Node[];
        setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
        stateEdges: Edge[];
        setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
        setShowLoadPopup: React.Dispatch<React.SetStateAction<boolean>>;
    }
){
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
                            onClick={() => handleSidebarButtonClick(selectedService, setSelectedService, service)}
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
                    onClick={() => handleLoadSave(setNodes, setEdges, setShowLoadPopup)}
                />

                <SidebarButton  
                    serviceName={"dawdwad"} 
                    serviceDescription={"dwadwad"} 
                    serviceImg={"save_icon.svg"} 
                    key={"dwawafgsgs"} 
                    isSelected={false}
                    onClick={() => handleSaveButtonClick(stateNodes, stateEdges)}
                />
            </div>

        </div>;
  
}

function handleSidebarButtonClick(selectedService: Service | null, setSelectedService: (service: Service | null) => void, service: Service): void{
    
    if(selectedService?.name === service.name){
        setSelectedService(null);
        return;
    }

    setSelectedService(service);

}

function handleSaveButtonClick(stateNodes: Node[], stateEdges: Edge[]): void{

    //show popup that allows you to enter save file name

    console.log(stateNodes);
    console.log(stateEdges);

    const saveName = window.prompt("Enter a name for this save:");

    console.log(saveName);

    if(saveName === "" || saveName === null || saveName === undefined){
        return;
    }

    const save = {
        nodes: stateNodes,
        edges: stateEdges
    }

    console.log(save);

    const JSONSave = JSON.stringify(save);

    localStorage.setItem(saveName!, JSONSave);
    const loadedSave = localStorage.getItem(saveName!);

    // console.log(loadedSave);

    

}

function handleLoadSave(setNodes: React.Dispatch<React.SetStateAction<Node[]>>, setEdges: React.Dispatch<React.SetStateAction<Edge[]>>, setShowLoadPopup: React.Dispatch<React.SetStateAction<boolean>>){
    
    //show pop up
    setShowLoadPopup(true);

    //show list of saves.

    for(let i = 0; i < localStorage.length; i++){

        const key = localStorage.key(i);
        console.log(key);

    }


}