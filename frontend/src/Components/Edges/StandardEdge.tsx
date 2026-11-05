import { BaseEdge, getSmoothStepPath, Position } from '@xyflow/react';
import '../../styles/StandardEdge.css';
import type { EdgeData, EdgeType } from '../../types';

// EdgeType values (e.g. "Request/Response") aren't valid as raw CSS class tokens,
// so map each to its own class suffix rather than interpolating the value directly.
const edgeTypeClassName: Record<EdgeType, string> = {
  "Request/Response": "requestResponse",
  "Event": "event",
  "Poll": "poll",
};


//deconstruct to get types and animation working
export function StandardEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: {
  id: string,
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  sourcePosition: Position,
  targetPosition: Position,
  data: EdgeData | undefined,
}) {
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
      <BaseEdge id={`${id}-pulse`} path={edgePath} interactionWidth={0} className={`standardEdge-pulse standardEdge-${data?.behaviour.edgeType.value ? edgeTypeClassName[data.behaviour.edgeType.value] : ""}`}/>
    </>
  );
}