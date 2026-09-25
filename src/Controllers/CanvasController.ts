import type { XYPosition, Node, ViewportHelperFunctions, Edge } from "@xyflow/react";
import type { AppEdge, AppNode, Service } from "../types";
import { CanvasModel } from "../Models/CanvasModel.ts";
import { resourceContainer, serviceImageSize } from "../constants.ts";

export class CanvasController{

    public model: CanvasModel = new CanvasModel;

    private screenToFlowPosition: ViewportHelperFunctions['screenToFlowPosition'];
    private setGhostNodes: React.Dispatch<React.SetStateAction<AppNode[]>>;
    private setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>; 
    private setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>; 
    private setSelectedNodeID: React.Dispatch<React.SetStateAction<string | null>>
    private setSelectedEdgeID: React.Dispatch<React.SetStateAction<string | null>>
    private setSelectedService: React.Dispatch<React.SetStateAction<Service | null>>
     

    public constructor(
        screenToFlowPosition: ViewportHelperFunctions['screenToFlowPosition'], 
        setGhostNodes: React.Dispatch<React.SetStateAction<AppNode[]>>,
        setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>, 
        setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>, 
        setSelectedNodeID: React.Dispatch<React.SetStateAction<string | null>>,
        setSelectedEdgeID: React.Dispatch<React.SetStateAction<string | null>>,
        setSelectedService: React.Dispatch<React.SetStateAction<Service | null>>
    ){
        this.screenToFlowPosition = screenToFlowPosition;
        this.setGhostNodes = setGhostNodes;
        this.setNodes = setNodes;
        this.setEdges = setEdges;
        this.setSelectedNodeID = setSelectedNodeID;
        this.setSelectedEdgeID = setSelectedEdgeID;
        this.setSelectedService = setSelectedService;
    }

    private placeNode(selectedService: Service, position: XYPosition | null): void{
        
        const nodeID = `n-${crypto.randomUUID()}`

        const newNode: Node = { 
            id: nodeID, 
            position: position ?? {x:0, y:0}, 
            data: {        
                properties: null
            },
            type: 'imageNode', 
            measured: { width: 1, height: 1 },
        };

        if(selectedService.terraformType == "resource"){   
            const resourceFactory = resourceContainer[selectedService.providerType!];
            newNode['data'] = resourceFactory(nodeID, selectedService);
        }

        this.setNodes((stateNodes: AppNode[]) => [...stateNodes, newNode as AppNode]);
 
        this.setSelectedNodeID(nodeID);
        this.setGhostNodes([]);

        this.setSelectedService(null);

    }

    public handlePaneClick(event: React.MouseEvent, selectedService: Service | null, stateNodes: AppNode[]): void {

        this.setSelectedNodeID(null);

        if(selectedService == null) {
            return;
        }

        const position = this.getCanvasPosition(event);

        this.placeNode(selectedService, position);
    
    }

    public handlePaneMouseMove(event: React.MouseEvent, selectedService: Service | null): void{

        //when deselecting a service without placing the icon still shows

        if(selectedService == null) {
            return;
        }

        const position: XYPosition | null = this.getCanvasPosition(event);

        const newGhostNode: AppNode = { id: `n-ghostNode`, position: position, data: { ghost: true, service: selectedService} , type: 'imageNode', measured: { width: 1, height: 1 }} as AppNode;
        this.setGhostNodes([newGhostNode]);
        
    }

    public handleNodeClick(event: React.MouseEvent, node: AppNode, stateSelectedService: Service | null, stateSelectedNodeID: string | null): void{

        console.log("node clicked");

        if(stateSelectedService != null){
            const position = this.getCanvasPosition(event);
            this.placeNode(stateSelectedService, position);
            return;
        }

        if(node.id !== stateSelectedNodeID){
            this.setSelectedNodeID(node.id);
        }

    }

    public getCanvasPosition = (event: React.MouseEvent<Element, MouseEvent>): XYPosition | null => {

        if(this.screenToFlowPosition == null){
            return null;
        }

        const flowPosition = this.screenToFlowPosition({ x: event.clientX, y: event.clientY});
        const position: XYPosition = { x: flowPosition.x - (serviceImageSize.width / 2), y: flowPosition.y - (serviceImageSize.height / 2)}
        return position;
    }

    public handleEdgeClick(edge: Edge, stateSelectedEdgeID: string | null){

        console.log(edge);
     
        if(edge.id !== stateSelectedEdgeID){
            this.setSelectedEdgeID(edge.id);
        }

    }
}