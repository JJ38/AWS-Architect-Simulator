import { AnimatedSVGEdge } from "../Components/AnimatedSVGEdge";
import ImageNode from "../Components/ImageNode";

export class CanvasModel{

    public nodeTypes = {
        imageNode: ImageNode,
    };

    public edgeTypes = {
        animatedSvg: AnimatedSVGEdge,
    };
        
    public constructor(){
        console.log("Created canvas model")
    }

}