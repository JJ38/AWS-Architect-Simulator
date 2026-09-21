import type { XYPosition, Node, ViewportHelperFunctions } from "@xyflow/react";
import type { Service } from "../types";
import { CanvasModel } from "../Models/CanvasModel.ts";
import { serviceImageSize } from "../constants.ts";

export class CanvasController{

    public model: CanvasModel = new CanvasModel;

    public screenToFlowPosition: ViewportHelperFunctions['screenToFlowPosition'] | null = null;

    public constructor(){
        console.log("Created canvas controller")
    }

    private placeNode(selectedService: Service, setSelectedService: (service: Service | null) => void, stateNodes: any[], setNodes: any, setGhostNodes: (nodes: any[]) => void, position: XYPosition | null): void{

        const nodeID = crypto.randomUUID()
        const newNode = { 
            id: `n-${nodeID}`, position: position, 
            data: { 
                label: `n-${nodeID}`, 
                ghost: false, 
                img: `${selectedService.image}`} , 
            type: 'imageNode', 
            measured: { width: 1, height: 1 }
        };

        setNodes([...stateNodes, newNode]);
        setGhostNodes([]);

        setSelectedService(null);

    }

    public handlePaneClick(event: React.MouseEvent, selectedService: Service | null, setSelectedService: (service: Service | null) => void, stateNodes: any[], setNodes: any, setGhostNodes: (nodes: any[]) => void, setSelectedNode: (node: Node | null) => void): void {

        setSelectedNode(null);

        if(selectedService == null) {
            return;
        }

        const position = this.getCanvasPosition(event);

        this.placeNode(selectedService, setSelectedService, stateNodes, setNodes, setGhostNodes, position);
    
    }

    public handlePaneMouseMove(event: React.MouseEvent, selectedService: Service | null, setGhostNodes: (nodes: any[]) => void): void{

        //when deselecting a service without placing the icon still shows

        if(selectedService == null) {
            return;
        }

        const position: XYPosition | null = this.getCanvasPosition(event);

        const newGhostNode = { id: `n-ghostNode`, position: position, data: { label: `n-ghostNode`, ghost: true, img: `${selectedService.image}`} , type: 'imageNode', measured: { width: 1, height: 1 }};
        setGhostNodes([newGhostNode]);
        
    }

    public handleNodeClick(event: React.MouseEvent, node: Node, stateSelectedNode : Node | null, setSelectedNode: (node: Node | null) => void, selectedService: Service | null, setSelectedService: (service: Service | null) => void, stateNodes: any[], setNodes: any, setGhostNodes: (nodes: any[]) => void): void{

        if(selectedService != null){
            const position = this.getCanvasPosition(event);
            this.placeNode(selectedService, setSelectedService, stateNodes, setNodes, setGhostNodes, position);
        }

        if(node.data !== stateSelectedNode?.data){
            setSelectedNode(node);
        }else{
            setSelectedNode(null);
            return;
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