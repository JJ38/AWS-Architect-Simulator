import { AnimatedSVGEdge } from "../Components/AnimatedSVGEdge";
import ImageNode from "../Components/ImageNode";

export class CanvasModel{

    public nodes = [
    //   { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
    //   { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
    //   { id: 'n3', position: { x: 0, y: 200 }, data: { label: 'Node 3', img: 'serviceImages/Arch_Amazon-EC2_64.svg' }, type: 'imageNode' },
    ];

    public edges = [
        // {}
        // { id: 'n1-n2', source: 'n1', target: 'n2', type: 'animatedSvg' }
    ];

    public nodeTypes = {
        imageNode: ImageNode,
    };

    public edgeTypes = {
        animatedSvg: AnimatedSVGEdge,
    };
    
    public ghostNodes: { id: string; position: { x: number; y: number; }; data: { label: string; img: string }, type: string }[] = [];
    
    public constructor(){
        console.log("Created canvas model")
    }

}