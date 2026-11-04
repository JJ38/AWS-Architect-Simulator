import { Handle, Position } from '@xyflow/react';
import '../../styles/ImageNode.css';

function imageNode({ data, isConnectable }: { data: any; isConnectable: boolean }) {
    return (
        <>
        
            <div className="imageNodeOuter">
                <Handle
                    type="target"
                    position={Position.Left}
                    onConnect={(params) => console.log('handle onConnect', params)}
                    isConnectable={isConnectable}
                />
                    <img className={`imageNodeWrapper ${data.isSelected ? "selectedNode" : "imageNode"}`} src={data.service?.image} alt={data.service?.description} />

                <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
            </div>
            {
                data.showTraffic &&
                <div className="trafficNodeLabel">{data.service?.name}</div>
            }

        </>
    );
}

export default imageNode;
