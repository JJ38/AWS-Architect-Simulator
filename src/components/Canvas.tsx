import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow, type Node } from '@xyflow/react';
import type { Service } from '../types.tsx';
import { CanvasController } from '../Controllers/CanvasController.ts';
import '@xyflow/react/dist/style.css';
import '../styles/Canvas.css'; 
import ImageNode from './ImageNode';

// const canvasController = new CanvasController();  

export default function Canvas({ selectedService, setSelectedService }: { selectedService: Service | null; setSelectedService: (service: Service | null) => void }) {

  const [stateCanvasController] = useState(() => new CanvasController())
  const [stateNodes, setNodes] = useState(stateCanvasController.model.nodes);
  const [stateGhostNodes, setGhostNodes] = useState(stateCanvasController.model.ghostNodes);
  const [stateEdges, setEdges] = useState(stateCanvasController.model.edges);
  const [stateSelectedNode, setSelectedNode] = useState<Node | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  stateCanvasController.screenToFlowPosition = screenToFlowPosition
 
  const onNodesChange = useCallback((changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)), []);
  const onEdgesChange = useCallback((changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)), []);
  const onConnect = useCallback((params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), []);

  const nodeTypes = {
    imageNode: ImageNode,
  };

  return (
    <div className="reactFlowWrapper">
      <ReactFlow
        nodes={[...stateNodes, ...stateGhostNodes]}
        edges={stateEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(event, node) => stateCanvasController.handleNodeClick(event, node, stateSelectedNode, setSelectedNode, selectedService, setSelectedService, stateNodes, setNodes, setGhostNodes)}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        onPaneClick={(event) => stateCanvasController.handlePaneClick(event, selectedService, setSelectedService, stateNodes, setNodes, setGhostNodes, setSelectedNode)}
        onPaneMouseMove={(event) => stateCanvasController.handlePaneMouseMove(event, selectedService, setGhostNodes)}
        deleteKeyCode={["Delete"]}
      />
    </div>
  );
}

