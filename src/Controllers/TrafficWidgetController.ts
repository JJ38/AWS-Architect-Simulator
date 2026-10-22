import type { Coords } from "../types";


export class TrafficWidgetController{

    private setIntervalPositions: React.Dispatch<React.SetStateAction<Coords[]>>;
    private setSelectedIntervalIndex: React.Dispatch<React.SetStateAction<number | null>>

    public constructor(setIntervalPositions: React.Dispatch<React.SetStateAction<Coords[]>>, setSelectedIntervalIndex: React.Dispatch<React.SetStateAction<number | null>>){
        this.setIntervalPositions = setIntervalPositions;
        this.setSelectedIntervalIndex = setSelectedIntervalIndex;
    }


    public intervalOnMouseMoveHandler(event: React.MouseEvent<SVGSVGElement, MouseEvent>, numberOfIncrements: number, stateSelectedIntervalIndex: number | null){

        if(stateSelectedIntervalIndex === null){
            return;
        }

        this.setIntervalPositions((stateIntervalPositions) => {

            const index: number | null = stateSelectedIntervalIndex;

            if(index === null){ // needs to be checked again due to potential race condition
                console.log("index === null");
                return stateIntervalPositions;
            }

            const oldCoords: Coords = stateIntervalPositions[index];
            let newY = oldCoords.y + (event.nativeEvent.movementY * -1);

            if(newY < 0){
                newY = 0;
            }

            if(newY > numberOfIncrements){
                newY = numberOfIncrements;
            }

            const newCoords: Coords = {x: oldCoords.x, y: newY};
            return stateIntervalPositions.map((coord, i) => i === index? newCoords : coord);

        });


    }

    public intervalOnMouseDownHandler(intervalIndex: number){

        console.log("mouse out")
        this.setSelectedIntervalIndex(intervalIndex);

    }

    public deselectInterval(){

        console.log("deselectInterval")
        this.setSelectedIntervalIndex(null);

    }



}