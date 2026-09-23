import type { XYPosition, Node, ViewportHelperFunctions } from "@xyflow/react";
import type { AppNode, Service } from "../types";
import { CanvasModel } from "../Models/CanvasModel.ts";
import { resourceContainer, serviceImageSize } from "../constants.ts";

export class CanvasController{

    public model: CanvasModel = new CanvasModel;

    public screenToFlowPosition: ViewportHelperFunctions['screenToFlowPosition'] | null = null;

    public constructor(){
        console.log("Created canvas controller")
    }

    private placeNode(selectedService: Service, setSelectedService: (service: Service | null) => void, stateNodes: AppNode[], setNodes: any, setGhostNodes: (nodes: AppNode[]) => void, position: XYPosition | null, setSelectedNode: (node: AppNode | null) => void): void{
        
        const nodeID = `n-${crypto.randomUUID()}`

        const newNode: Node = { 
            id: nodeID, 
            position: position ?? {x:0, y:0}, 
            data: { 
                service: selectedService,
                ghost: false,              
                resourceData: null as Record<string, any> | null
            } , 
            type: 'imageNode', 
            measured: { width: 1, height: 1 },
        };

        if(selectedService.terraformType == "resource"){   

            const resourceFactory = resourceContainer[selectedService.providerType!];
            newNode['data']['resourceData'] = resourceFactory(nodeID, selectedService);

        }

        setNodes([...stateNodes, newNode]);
        setSelectedNode(newNode as AppNode);
        setGhostNodes([]);

        setSelectedService(null);

    }

    public handlePaneClick(event: React.MouseEvent, selectedService: Service | null, setSelectedService: (service: Service | null) => void, stateNodes: AppNode[], setNodes: any, setGhostNodes: (nodes: any[]) => void, setSelectedNode: (node: AppNode | null) => void): void {

        setSelectedNode(null);

        if(selectedService == null) {
            return;
        }

        const position = this.getCanvasPosition(event);

        this.placeNode(selectedService, setSelectedService, stateNodes, setNodes, setGhostNodes, position, setSelectedNode);
    
    }

    public handlePaneMouseMove(event: React.MouseEvent, selectedService: Service | null, setGhostNodes: (nodes: any[]) => void): void{

        //when deselecting a service without placing the icon still shows

        if(selectedService == null) {
            return;
        }

        const position: XYPosition | null = this.getCanvasPosition(event);

        const newGhostNode = { id: `n-ghostNode`, position: position, data: { ghost: true, service: selectedService} , type: 'imageNode', measured: { width: 1, height: 1 }};
        setGhostNodes([newGhostNode]);
        
    }

    public handleNodeClick(event: React.MouseEvent, node: AppNode, stateSelectedNode: AppNode | null, setSelectedNode: (node: AppNode | null) => void, selectedService: Service | null, setSelectedService: (service: Service | null) => void, stateNodes: AppNode[], setNodes: any, setGhostNodes: (nodes: AppNode[]) => void): void{

        if(selectedService != null){
            const position = this.getCanvasPosition(event);
            this.placeNode(selectedService, setSelectedService, stateNodes, setNodes, setGhostNodes, position, setSelectedNode);
            return;
        }

        if(node.data !== stateSelectedNode?.data){
            setSelectedNode(node);
        }

    }

    public getCanvasPosition = (event: React.MouseEvent): XYPosition | null => {

        if(this.screenToFlowPosition == null){
            return null;
        }

        const flowPosition = this.screenToFlowPosition({ x: event.clientX, y: event.clientY});
        const position: XYPosition = { x: flowPosition.x - (serviceImageSize.width / 2), y: flowPosition.y - (serviceImageSize.height / 2)}
        return position;
    }

}