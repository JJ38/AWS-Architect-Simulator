import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow, type Node, type Edge } from '@xyflow/react';
import type { AppNode, Service } from '../types.ts';
import { CanvasController } from '../Controllers/CanvasController.ts';
import '@xyflow/react/dist/style.css';
import '../styles/Canvas.css'; 
import PropertiesWidget from './Widgets/PropertiesWidget.tsx';

export default function Canvas(
  {
    stateSelectedService,
    setSelectedService,
    stateCanvasController,
    stateNodes,
    setNodes,
    stateEdges,
    setEdges
  }
    :
  {
    stateSelectedService: Service | null;
    setSelectedService: (service: Service | null) => void;
    stateCanvasController: CanvasController;
    stateNodes: AppNode[];
    setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>;
    stateEdges: Edge[];
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  }
){

  const [stateGhostNodes, setGhostNodes] = useState<AppNode[]>([]);
  const [stateSelectedNode, setSelectedNode] = useState<AppNode | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  stateCanvasController.screenToFlowPosition = screenToFlowPosition
 
  const onNodesChange = useCallback((changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)), []);
  const onEdgesChange = useCallback((changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)), []);
  const onConnect = useCallback(() => (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), []);

  return (
    <div className="reactFlowWrapper">
      <ReactFlow
        nodes={[...stateNodes, ...stateGhostNodes]}
        edges={stateEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(event, node) => stateCanvasController.handleNodeClick(event, node, stateSelectedNode, setSelectedNode, stateSelectedService, setSelectedService, stateNodes, setNodes, setGhostNodes)}
        onConnect={onConnect}
        nodeTypes={stateCanvasController.model.nodeTypes}
        edgeTypes={stateCanvasController.model.edgeTypes}
        fitView
        onPaneClick={(event) => stateCanvasController.handlePaneClick(event, stateSelectedService, setSelectedService, stateNodes, setNodes, setGhostNodes, setSelectedNode)}
        onPaneMouseMove={(event) => stateCanvasController.handlePaneMouseMove(event, stateSelectedService, setGhostNodes)}
        deleteKeyCode={["Delete"]}
        snapGrid={[20,20]}
        colorMode='system'
      />
      <PropertiesWidget 
        stateSelectedNode={stateSelectedNode} 
        setSelectedNode={setSelectedNode} 
        setNodes={setNodes}
        stateEdges={stateEdges}
      >
      </PropertiesWidget>
    </div>
  );
}

