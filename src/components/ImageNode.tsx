import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

function imageNode({ data, isConnectable }: { data: any; isConnectable: boolean }) {
    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={isConnectable}
            />
                <img src={data.img} alt={data.label} />
            <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
        </>
    );
}

export default imageNode;
