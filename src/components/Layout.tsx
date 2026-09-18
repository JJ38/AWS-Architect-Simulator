import { useState } from 'react';
import { ReactFlowProvider, type Edge, type Node } from '@xyflow/react';
import type { Service } from '../types.ts';
import { CanvasController } from '../Controllers/CanvasController.ts';
import Sidebar from './Sidebar.tsx';
import Canvas from './Canvas.tsx';
import LoadWidget from './Widgets/LoadSaveWidget.tsx';
import NotificationProvider from '../Providers/NotificationProvider.tsx';
import '../styles/Layout.css';
import SaveWidget from './Widgets/SaveWidget.tsx';
import TerraformWidget from './Widgets/TerraformWidget.tsx';

export default function Layout() {

    const [stateCanvasController] = useState(() => new CanvasController())

    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [stateNodes, setNodes] = useState<Node[]>(stateCanvasController.model.nodes);
    const [stateEdges, setEdges] = useState<Edge[]>(stateCanvasController.model.edges);
    const [stateShowLoadWidget, setShowLoadWidget] = useState<boolean>(false);
    const [stateShowSaveWidget, setShowSaveWidget] = useState<boolean>(false);
    const [stateShowTerraformWidget, setShowTerraformWidget] = useState<boolean>(false);
    const [stateLoadedSaveName, setLoadedSaveName] = useState<string | null>(null);
    



    return (
        <NotificationProvider>
            <div className="layout">
                <Sidebar 
                    selectedService={selectedService} 
                    setSelectedService={setSelectedService}
                    setShowLoadWidget={setShowLoadWidget}
                    setShowSaveWidget={setShowSaveWidget}
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
                    stateShowTerraformWidget
                        && 
                    <TerraformWidget 
                        setShowTerraformWidget={setShowTerraformWidget}
                    />
                }
                
                {
                    stateShowLoadWidget
                        && 
                    <LoadWidget
                        setShowLoadWidget={setShowLoadWidget}
                        setEdges={setEdges}
                        setNodes={setNodes}
                        setLoadedSaveName={setLoadedSaveName}
                    />
                }

                {
                    stateShowSaveWidget
                        && 
                    <SaveWidget
                        setShowSaveWidget={setShowSaveWidget}
                        stateLoadedSaveName={stateLoadedSaveName}
                        setLoadedSaveName={setLoadedSaveName}
                        stateNodes={stateNodes}
                        stateEdges={stateEdges}
                    />
                }

            </div>
        </NotificationProvider>
    );
}

