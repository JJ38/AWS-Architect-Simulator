import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../styles/Canvas.css'; 

const nodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];

const edges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];
 
export default function App({ selectedService, setSelectedService }: { selectedService: string | null; setSelectedService: (service: string | null) => void }) {

  const [stateNodes, setNodes] = useState(nodes);
  const [stateEdges, setEdges] = useState(edges);
 
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
        onPaneClick={() => handlePaneClick(selectedService, setSelectedService)}
      />
    </div>
  );
}

function handlePaneClick(selectedService: string | null, setSelectedService: (service: string | null) => void) {

  selectedService != null ? console.log(`Place service node ${selectedService}`) : console.log('Dont place service node');
   
}