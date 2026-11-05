import { type XYPosition, type Node, type ViewportHelperFunctions, type Edge, addEdge } from "@xyflow/react";
import type { AppEdge, AppNode, ComponentData, EdgeData, EdgeType, ResourceData, Service } from "../types";
import { resourceContainer, serviceImageSize } from "../constants.ts";
import type Resource from "../Models/Resource.ts";
import type { ResourceStatics } from "../Models/Resource.ts";
import { IamFactory } from "../Models/IamFactory.ts";


export class CanvasController{

    private showNotification: (success: boolean, message: string) => void
    private screenToFlowPosition: ViewportHelperFunctions['screenToFlowPosition'];
    private setGhostNodes: React.Dispatch<React.SetStateAction<AppNode[]>>;
    private setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>; 
    private setNodesData: React.Dispatch<React.SetStateAction<ComponentData[]>>; 
    private setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>; 
    private setEdgesData: React.Dispatch<React.SetStateAction<ComponentData[]>>; 
    private setSelectedNodeID: React.Dispatch<React.SetStateAction<string | null>>;
    private setSelectedEdgeID: React.Dispatch<React.SetStateAction<string | null>>;
    private setSelectedService: React.Dispatch<React.SetStateAction<Service | null>>;
    private setShowTrafficWidget: React.Dispatch<React.SetStateAction<boolean>>;
     

    public constructor(
        showNotification: (success: boolean, message: string) => void,
        screenToFlowPosition: ViewportHelperFunctions['screenToFlowPosition'], 
        setGhostNodes: React.Dispatch<React.SetStateAction<AppNode[]>>,
        setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>, 
        setNodesData: React.Dispatch<React.SetStateAction<ComponentData[]>>, 
        setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>, 
        setEdgesData: React.Dispatch<React.SetStateAction<ComponentData[]>>, 
        setSelectedNodeID: React.Dispatch<React.SetStateAction<string | null>>,
        setSelectedEdgeID: React.Dispatch<React.SetStateAction<string | null>>,
        setSelectedService: React.Dispatch<React.SetStateAction<Service | null>>,
        setShowTrafficWidget: React.Dispatch<React.SetStateAction<boolean>>
    ){
        this.showNotification = showNotification;
        this.screenToFlowPosition = screenToFlowPosition;
        this.setGhostNodes = setGhostNodes;
        this.setNodes = setNodes;
        this.setNodesData = setNodesData;
        this.setEdges = setEdges;
        this.setEdgesData = setEdgesData;
        this.setSelectedNodeID = setSelectedNodeID;
        this.setSelectedEdgeID = setSelectedEdgeID;
        this.setSelectedService = setSelectedService;
        this.setShowTrafficWidget = setShowTrafficWidget;
    }

    private placeNode(selectedService: Service, position: XYPosition | null): void{
        
        const nodeID = `n-${crypto.randomUUID()}`

        const newNode: Node = { 
            id: nodeID, 
            data: {
                service: selectedService,
                showTraffic: false,
                highlighted: false
            },
            position: position ?? {x:0, y:0}, 
            type: 'imageNode', //imageNode, trafficNode 
            measured: { width: 1, height: 1 },
        };

        if(selectedService.terraformType == "resource"){   
            
            const resourceFactory: ResourceStatics = resourceContainer[selectedService.name!];
            const data = resourceFactory.createData(nodeID);

            this.setNodesData((stateNodesData: ComponentData[]) => [...stateNodesData, data as ComponentData]);
            this.setNodes((stateNodes: AppNode[]) => [...stateNodes, newNode as AppNode]);

        }
 
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

        const newGhostNode: AppNode = { 
            id: `n-ghostNode`, 
            position: position, 
            data: { 
                service: selectedService,
                highlighted: false,
                showTraffic: false
            } , 
            type: 'imageNode', 
            measured: { width: 1, height: 1 }
        } as AppNode;
        this.setGhostNodes([newGhostNode]);
        
    }

    public handleNodeClick(event: React.MouseEvent, node: AppNode, stateSelectedService: Service | null, stateSelectedNodeID: string | null): void{

        if(stateSelectedService != null){
            const position = this.getCanvasPosition(event);
            this.placeNode(stateSelectedService, position);
            return;
        }

        if(node.id !== stateSelectedNodeID){
            this.setSelectedNodeID(node.id);
            this.setSelectedEdgeID(null);
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

    public handleEdgeClick(edge: Edge, stateSelectedEdgeID: string | null){;

        if(edge.id !== stateSelectedEdgeID){
            this.setSelectedEdgeID(edge.id);
            this.setSelectedNodeID(null);
        }

    }

    public onConnect(params: any, stateNodes: AppNode[], stateNodesData: ComponentData[]){

        const sourceID = params.source;
        const targetID = params.target;
    
        const sourceNode = stateNodes.find((node: AppNode) => node.id == sourceID);
        const targetNode = stateNodes.find((node: AppNode) => node.id == targetID);

        const sourceNodeData = stateNodesData.find((data: ComponentData) => data.id == sourceID);
        const targetNodeData = stateNodesData.find((data: ComponentData) => data.id == targetID);

        if(sourceNodeData === undefined || targetNodeData === undefined){
            return;
        }

        if(sourceNode == undefined || targetNode == undefined){
            return;
        }
        
        const sourceServiceName = sourceNode?.data.service.name;
        const targetServiceName = targetNode?.data.service.name;
    
        if(sourceServiceName == null || targetServiceName == null){
            return;
        }

        const sourceResource = resourceContainer[sourceServiceName!];
        const targetResource = resourceContainer[targetServiceName!];
    
        const sourceEdgeTypes = sourceResource.sourceTypes;
        const targetEdgeTypes = targetResource.targetTypes;
    
        const validEdgeTypes = sourceEdgeTypes.filter((edgeType: EdgeType) => targetEdgeTypes.includes(edgeType));

        if(validEdgeTypes.length == 0){
            this.showNotification(false, "Invalid connection");
            return;
        }

        const defaultEdge = validEdgeTypes[0] ?? "";

        let callerInstance: Resource;
        let receiverInstance: Resource;
        let callerName: string;
        let receiverName: string;
        let callerID: string;
        let receiverID: string;

        
        if(defaultEdge == "Poll"){

            callerInstance = new targetResource(targetNode.data.service, targetNodeData);
            receiverInstance = new sourceResource(sourceNode.data.service, sourceNodeData);
            callerName = targetServiceName;
            receiverName = sourceServiceName;
            callerID = targetNode.id;
            receiverID = sourceNode.id;

        }else{

            callerInstance = new sourceResource(sourceNode.data.service, sourceNodeData);
            receiverInstance = new targetResource(targetNode.data.service, targetNodeData);
            callerName = sourceServiceName;
            receiverName = targetServiceName;
            callerID = sourceNode.id;
            receiverID= targetNode.id;

        }

        const edgeData: ComponentData = {
            id: "xy-edge__" + sourceNodeData.id + "-" + targetNodeData.id,
            metaData:{
                "callerName": callerName,
                "receiverName": receiverName,
            },
            simulationProperties: {
                "simulation_settings": {
                    "request_multiplier": {value: 1, type: "number"},
                }
            },
            componentProperties:{
                
            },
            iamProperties:{
                "aws_iam_policy": IamFactory.makeIamPolicy("aws_iam_policy", sourceServiceName)
            },
            terraformProperties:{},
            
            resources:{
                callerID: callerID,
                receiverID: receiverID
            }
        };

        params['type'] = "standardEdge";
        params['data'] = {
            "behaviour": {
                "edgeType": { value: defaultEdge, type: "edgeType", options: validEdgeTypes },
            }
        } //this is the data based to the edge. data param in standardEdge.tsx

        this.setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
        this.setEdgesData((edgesData) => [...edgesData, edgeData]);
    
    }

    public getPropertiesWidgetTitle(selectedNodeData: ResourceData | undefined, selectedNodeID: string | undefined, stateNodes: AppNode[], selectedEdge: AppEdge | undefined): string{

        let title = "";

        if(selectedNodeData != undefined){
            title += selectedNodeData.service.description;
            title += ": ";
            title += selectedNodeID;
        }

        if(selectedEdge != undefined){

            const sourceNode = stateNodes.find((node) => node.id === selectedEdge?.source);
            const targetNode = stateNodes.find((node) => node.id === selectedEdge?.target);
            
            const sourceNodeDescription = sourceNode?.data.service.description;
            const targetNodeDescription = targetNode?.data.service.description;

            title += sourceNodeDescription;
            title += " -> ";
            title += targetNodeDescription;

        }

        return title;
    }

    public handleTrafficWidhgetClick(): void{
        this.setShowTrafficWidget((show) => !show);
    }

    //runs every time a new node is selected
    public updateNodeData(selectedNodeData: ComponentData | undefined, stateNodesData: ComponentData[], stateEdges: AppEdge[], stateEdgesData: ComponentData[]): void{

        const isTrafficInputNode = selectedNodeData?.simulationProperties?.simulation_settings?.is_input_service?.value

        //if canvas selected
        if(selectedNodeData?.id === undefined){
            this.setShowTrafficWidget(false);
            this.resetNodeData();
            return;
        }

        let traversalRecord: Record<string, any[]> = {nodes: [selectedNodeData], edges: []};
        traversalRecord = this.traverseNodes(selectedNodeData?.id, stateNodesData, stateEdges, traversalRecord);

        const traversedNodesIDs: string[] = traversalRecord.nodes.map((node: AppNode) => node.id);
        const traversedEdgesIDs: string[] = traversalRecord.edges.map((edge: ComponentData) => edge.id);

        if(isTrafficInputNode){
    
            this.setShowTrafficWidget(true);

            this.setNodes((stateNodes: AppNode[]) => stateNodes.map((node: AppNode) => {
            
                const newNode = structuredClone(node);

                if(traversedNodesIDs.includes(node.id)){
                    newNode.data.highlighted = true;
                    newNode.data.showTraffic = true;
                }else{
                    newNode.data.highlighted = false;
                    newNode.data.showTraffic = false;
                }

                return newNode;

            }));

        }else if(!isTrafficInputNode){

            this.setShowTrafficWidget(false);
            this.resetNodeData();

        }

    }

    private resetNodeData(){

        this.setNodes((stateNodes: AppNode[]) => stateNodes.map((node: AppNode) => {
            
            const newNode = structuredClone(node);

            newNode.data.highlighted = false;
            newNode.data.showTraffic = false;
    
            return newNode;

        }));
    }

    private traverseNodes(nextNodeID: string, stateNodesData: ComponentData[], stateEdges: AppEdge[], traversalRecord: Record<string, any[]>): Record<string, any[]>{

        const nextEdges: AppEdge[] = stateEdges.filter((edge: AppEdge) => edge.source == nextNodeID);

        if(nextEdges.length === 0){
            return traversalRecord;
        }

        for(let i = 0; i < nextEdges.length; i++){

            const nextNode: ComponentData | null = stateNodesData.find((node: ComponentData) => nextEdges[i].target == node.id) ?? null;

            traversalRecord = {
                edges: [...traversalRecord.edges, nextEdges[i]],
                nodes: [...traversalRecord.nodes, nextNode]
            }

            if(nextNode == null){
                return traversalRecord;
            }

            traversalRecord = this.traverseNodes(nextNode.id, stateNodesData, stateEdges, traversalRecord);

        }

        return traversalRecord;

    }


     // console.log(i);

            // const nextNode: ComponentData | null = stateNodesData.find((node: ComponentData) => nextEdges[i].target == node.id) ?? null;

            // traversalRecord = {
            //     edges: [...traversalRecord.edges, nextEdges[i]],
            //     nodes: [...traversalRecord.nodes, nextNode]
            // }

            // console.log(traversalRecord);

            // //shouldnt ever happen. No nice handling of this case
            // if(nextNode == null){
            //     return traversalRecord;
            // }

            // return this.traverseNodes(nextNode.id, stateNodesData, stateEdges, traversalRecord);

}