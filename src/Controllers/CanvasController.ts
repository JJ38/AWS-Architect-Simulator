import type { XYPosition, Node, ViewportHelperFunctions } from "@xyflow/react";
import type { AppNode, Service } from "../types";
import { CanvasModel } from "../Models/CanvasModel.ts";
import { serviceImageSize } from "../constants.ts";
import type Resource from "../Models/Resource.ts";

export class CanvasController{

    public model: CanvasModel = new CanvasModel;

    public screenToFlowPosition: ViewportHelperFunctions['screenToFlowPosition'] | null = null;

    public constructor(){
        console.log("Created canvas controller")
    }

    private placeNode(selectedService: Service, setSelectedService: (service: Service | null) => void, stateNodes: AppNode[], setNodes: any, setGhostNodes: (nodes: AppNode[]) => void, position: XYPosition | null): void{
        
        const nodeID = `n-${crypto.randomUUID()}`

        const newNode = { 
            id: nodeID, 
            position: position, 
            data: { 
                label: `${selectedService.description}`, 
                ghost: false, 
                img: `${selectedService.image}`,
                terraformType: selectedService.terraformType,
                resource: null as Resource | null
            } , 
            type: 'imageNode', 
            measured: { width: 1, height: 1 },
        };

        if(selectedService.terraformType == "resource"){

            if(selectedService.resource != null){

                const resourceConstructor = selectedService!.resource
                newNode['data']['resource'] = new resourceConstructor({id: nodeID, service: selectedService});

            }
        }

        setNodes([...stateNodes, newNode]);
        setGhostNodes([]);

        setSelectedService(null);

    }

    public handlePaneClick(event: React.MouseEvent, selectedService: Service | null, setSelectedService: (service: Service | null) => void, stateNodes: AppNode[], setNodes: any, setGhostNodes: (nodes: any[]) => void, setSelectedNode: (node: AppNode | null) => void): void {

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

    public handleNodeClick(event: React.MouseEvent, node: AppNode, stateSelectedNode: AppNode | null, setSelectedNode: (node: AppNode | null) => void, selectedService: Service | null, setSelectedService: (service: Service | null) => void, stateNodes: AppNode[], setNodes: any, setGhostNodes: (nodes: AppNode[]) => void): void{

        if(selectedService != null){
            const position = this.getCanvasPosition(event);
            this.placeNode(selectedService, setSelectedService, stateNodes, setNodes, setGhostNodes, position);
        }

        if(node.data !== stateSelectedNode?.data){
            setSelectedNode(node);
        }

        console.log(node);
        console.log(node?.data.resource);


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