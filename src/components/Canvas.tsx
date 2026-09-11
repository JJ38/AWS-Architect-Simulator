import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow, type ViewportHelperFunctions } from '@xyflow/react';
import type { Service } from '../types.tsx';
import '@xyflow/react/dist/style.css';
import '../styles/Canvas.css'; 
import ImageNode from './ImageNode';

const nodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
  { id: 'n3', position: { x: 0, y: 200 }, data: { label: 'Node 3', img: 'serviceImages/Arch_Amazon-EC2_64.svg' }, type: 'imageNode' },
];

let nodeIdCounter = nodes.length; // Counter for generating unique node IDs


const ghostNodes: { id: string; position: { x: number; y: number; }; data: { label: string; img: string }, type: string }[] = [];

const edges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

 
export default function Canvas({ selectedService, setSelectedService }: { selectedService: Service | null; setSelectedService: (service: Service | null) => void }) {

  const [stateNodes, setNodes] = useState(nodes);
  const [stateGhostNodes, setGhostNodes] = useState(ghostNodes);
  const [stateEdges, setEdges] = useState(edges);
  const { screenToFlowPosition } = useReactFlow();
 
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
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        onPaneClick={(event) => handlePaneClick(event, screenToFlowPosition, selectedService, setSelectedService, stateNodes, setNodes, setGhostNodes)}
        onPaneMouseMove={(event) => handlePaneMouseMove(event, screenToFlowPosition, selectedService, setGhostNodes )}
      />
    </div>
  );
}

function handlePaneClick(event: React.MouseEvent, screenToFlowPosition: ViewportHelperFunctions['screenToFlowPosition'], selectedService: Service | null, setSelectedService: (service: Service | null) => void, stateNodes: any[], setNodes: (nodes: any[]) => void, setGhostNodes: (nodes: any[]) => void) {

  if(selectedService == null) {
    return;
  }

  const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY });
  const newNode = { id: `n${nodeIdCounter}`, position: flowPosition, data: { label: `n${nodeIdCounter}`, img: `${selectedService.image}`} , type: 'imageNode', measured: { width: 300, height: 72 } };

  setNodes([...stateNodes, newNode]);
  setGhostNodes([]);

  setSelectedService(null);

}

function handlePaneMouseMove(event: React.MouseEvent, screenToFlowPosition: ViewportHelperFunctions['screenToFlowPosition'], selectedService: Service | null, setGhostNodes: (nodes: any[]) => void){

  if(selectedService == null) {
    return;
  }

  const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY });
  nodeIdCounter++;

  const newGhostNode = { id: `n${nodeIdCounter}`, position: flowPosition, data: { label: `n${nodeIdCounter}`, img: `${selectedService.image}`} , type: 'imageNode', measured: { width: 300, height: 72 } };
  setGhostNodes([newGhostNode]);
  
}