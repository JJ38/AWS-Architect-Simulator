import type { Coords } from "../types";


export class TrafficWidgetController{

    private intervalIndex: number | null = null;
    private setIntervalPositions: React.Dispatch<React.SetStateAction<Coords[]>>;

    public constructor(setIntervalPositions: React.Dispatch<React.SetStateAction<Coords[]>>){
        this.setIntervalPositions = setIntervalPositions;
    }


    //TODO change this to be a handler on the svg not the button.
    public intervalOnMouseMoveHandler(event: React.MouseEvent<SVGSVGElement, MouseEvent>, chartHeight: number, graphOffsetY: number){

        console.log("mouse move")
        if(this.intervalIndex === null){
            return;
        }
        

        this.setIntervalPositions((stateIntervalPositions) => {

            const index: number | null = this.intervalIndex;

            if(index === null){ // needs to be checked again due to potential race condition
                console.log("index === null");
                return stateIntervalPositions;
            }

            const oldCoords: Coords = stateIntervalPositions[index];
            let newY = oldCoords.y + (event.nativeEvent.movementY * -1);

            if(newY < 0){
                newY = 0;
            }

            if(newY > (chartHeight - (graphOffsetY * 2))){
                newY = chartHeight - (graphOffsetY * 2);
            }

            const newCoords: Coords = {x: oldCoords.x, y: newY};
            return stateIntervalPositions.map((coord, i) => i === index? newCoords : coord);

        });


    }

    public intervalOnMouseDownHandler(intervalIndex: number){
        this.intervalIndex = intervalIndex;

        console.log("mouse out")
        this.intervalIndex = intervalIndex;

    }

    public deselectInterval(){

        console.log("deselectInterval")
        this.intervalIndex = null;

    }



}