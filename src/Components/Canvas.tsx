import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow, type Edge } from '@xyflow/react';
import type { AppNode, Service } from '../types.ts';
import { CanvasController } from '../Controllers/CanvasController.ts';
import '@xyflow/react/dist/style.css';
import '../styles/Canvas.css'; 
import PropertiesWidget from './Widgets/PropertiesWidget.tsx';

export default function Canvas(
  {
    stateSelectedService,
    setSelectedService,
    stateNodes,
    setNodes,
    stateEdges,
    setEdges
  }
    :
  {
    stateSelectedService: Service | null;
    setSelectedService: React.Dispatch<React.SetStateAction<Service | null>>;
    stateNodes: AppNode[];
    setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>;
    stateEdges: Edge[];
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  }
){


  const [stateGhostNodes, setGhostNodes] = useState<AppNode[]>([]);
  const [stateSelectedNodeID, setSelectedNodeID] = useState<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();


  const [stateCanvasController] = useState(() => new CanvasController(screenToFlowPosition, setGhostNodes, setNodes, setSelectedNodeID, setSelectedService))

  const selectedNode = stateNodes.find((node: AppNode) => node.id == stateSelectedNodeID);
   
  const onNodesChange = useCallback((changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)), []);
  const onEdgesChange = useCallback((changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)), []);
  const onConnect = useCallback((params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), []);

  const nodesWithSelection = stateNodes.map((node) => ({
    ...node,
    data: { ...node.data, isSelected: node.id === stateSelectedNodeID }
  }));

  useEffect(() => {
    
    function handleKeyDown(event: KeyboardEvent){

      if(event.key !== "Delete") {
        return;
      }

      if(stateSelectedNodeID == null){
        return;
      }

      setNodes((nodes: AppNode[]) => nodes.filter((node: AppNode) => node.id != stateSelectedNodeID));

    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)

  }, [stateSelectedNodeID, setNodes]);

  return (
    <div className="reactFlowWrapper">
      <ReactFlow
        nodes={[...nodesWithSelection, ...stateGhostNodes]}
        edges={stateEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(event, node) => stateCanvasController.handleNodeClick(event, node, stateSelectedNodeID, stateSelectedService, stateNodes)}
        onConnect={onConnect}
        nodeTypes={stateCanvasController.model.nodeTypes}
        edgeTypes={stateCanvasController.model.edgeTypes}
        fitView
        onPaneClick={(event) => stateCanvasController.handlePaneClick(event, stateSelectedService, stateNodes)}
        onPaneMouseMove={(event) => stateCanvasController.handlePaneMouseMove(event, stateSelectedService)}
        snapGrid={[20,20]}
        colorMode='system'
        elementsSelectable={false}
      />
      <PropertiesWidget 
        stateSelectedNodeID={stateSelectedNodeID} 
        setSelectedNodeID={setSelectedNodeID} 
        stateNodes={stateNodes}
        setNodes={setNodes}
        stateEdges={stateEdges}
        selectedNode={selectedNode}
      >
      </PropertiesWidget>
    </div>
  );
}

