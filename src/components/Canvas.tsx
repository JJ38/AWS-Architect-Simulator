import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow, type ViewportHelperFunctions } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../styles/Canvas.css'; 

const nodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];

const edges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];
 
export default function Canvas({ selectedService, setSelectedService }: { selectedService: string | null; setSelectedService: (service: string | null) => void }) {

  const [stateNodes, setNodes] = useState(nodes);
  const [stateEdges, setEdges] = useState(edges);
  const { screenToFlowPosition } = useReactFlow();
 
  const onNodesChange = useCallback((changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)), []);
  const onEdgesChange = useCallback((changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)), []);
  const onConnect = useCallback((params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), []);
 
  return (
    <div className="reactFlowWrapper">
      <ReactFlow
        nodes={stateNodes}
        edges={stateEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        onPaneClick={(event) => handlePaneClick(event, screenToFlowPosition, selectedService, setSelectedService, stateNodes, setNodes)}
        onPaneMouseMove={(event) => handlePaneMouseMove(event, screenToFlowPosition, selectedService, setSelectedService)}
      />
    </div>
  );
}

function handlePaneClick(event: React.MouseEvent, screenToFlowPosition: ViewportHelperFunctions['screenToFlowPosition'], selectedService: string | null, setSelectedService: (service: string | null) => void, stateNodes: any[], setNodes: (nodes: any[]) => void) {

  selectedService != null ? console.log(`Place service node ${selectedService}`) : console.log('Dont place service node');

  if(selectedService == null) {
    return;
  }

  const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY });
  const newNode = { id: `n${stateNodes.length + 1}`, position: flowPosition, data: { label: selectedService ?? `${selectedService} ID:${stateNodes.length + 1}` } };

  setNodes([...stateNodes, newNode]);

  setSelectedService(null);

}

function handlePaneMouseMove(event: React.MouseEvent, screenToFlowPosition: ViewportHelperFunctions['screenToFlowPosition'], selectedService: string | null, setSelectedService: (service: string | null) => void) {

  const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY });

}