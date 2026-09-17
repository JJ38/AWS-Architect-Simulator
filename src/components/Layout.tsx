import { useState } from 'react';
import { ReactFlowProvider, type Edge, type Node } from '@xyflow/react';
import type { Service } from '../types.ts';
import { CanvasController } from '../Controllers/CanvasController.ts';
import Sidebar from './Sidebar.tsx';
import Canvas from './Canvas.tsx';
import LoadSavePopUp from './LoadSavePopUp.tsx';
import NotificationProvider from '../Providers/NotificationProvider.tsx';
import '../styles/Layout.css';

export default function Layout() {

    const [stateCanvasController] = useState(() => new CanvasController())

    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [stateNodes, setNodes] = useState<Node[]>(stateCanvasController.model.nodes);
    const [stateEdges, setEdges] = useState<Edge[]>(stateCanvasController.model.edges);
    const [stateShowLoadPopup, setShowLoadPopup] = useState<boolean>(false);

    return (
        <NotificationProvider>
            <div className="layout">
                <Sidebar 
                    selectedService={selectedService} 
                    setSelectedService={setSelectedService}
                    stateCanvasController={stateCanvasController} 
                    stateNodes={stateNodes}
                    setNodes={setNodes}
                    stateEdges={stateEdges}
                    setEdges={setEdges}
                    setShowLoadPopup={setShowLoadPopup}
                />
                <ReactFlowProvider>
                    <Canvas 
                        selectedService={selectedService} 
                        setSelectedService={setSelectedService}
                        stateCanvasController={stateCanvasController} 
                        stateNodes={stateNodes}
                        setNodes={setNodes}
                        stateEdges={stateEdges}
                        setEdges={setEdges}
                    />
                </ReactFlowProvider>
                
                {
                    stateShowLoadPopup && <LoadSavePopUp setShowLoadPopup={setShowLoadPopup}></LoadSavePopUp>
                }

            </div>
        </NotificationProvider>
    );
}

