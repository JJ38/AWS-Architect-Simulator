import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@xyflow/react';
import '../../styles/StandardEdge.css';
 
export function StandardEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
 
  return (
    <>
      <BaseEdge id={id} path={edgePath} className={`standardEdge`}/>
      <BaseEdge id={`${id}-pulse`} path={edgePath} interactionWidth={0} className={`standardEdge-pulse  standardEdge-${data?.edgeType}`}/>
    </>
  );
}