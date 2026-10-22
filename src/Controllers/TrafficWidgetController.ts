import type { Coords } from "../types";


export class TrafficWidgetController{

    private setIntervalPositions: React.Dispatch<React.SetStateAction<Coords[]>>;
    private setSelectedIntervalIndex: React.Dispatch<React.SetStateAction<number | null>>
    private setIntervalRequestPerSecond: React.Dispatch<React.SetStateAction<number>>

    public constructor(setIntervalPositions: React.Dispatch<React.SetStateAction<Coords[]>>, setSelectedIntervalIndex: React.Dispatch<React.SetStateAction<number | null>>, setIntervalRequestPerSecond: React.Dispatch<React.SetStateAction<number>>){
        this.setIntervalPositions = setIntervalPositions;
        this.setSelectedIntervalIndex = setSelectedIntervalIndex;
        this.setIntervalRequestPerSecond = setIntervalRequestPerSecond;
    }


    public intervalOnMouseMoveHandler(event: React.MouseEvent<SVGSVGElement, MouseEvent>, numberOfIncrements: number, stateSelectedIntervalIndex: number | null, svgHeight: number, graphPaddingBottom: number, graphPaddingTop: number, yAxisMaxValue: number){

        if(stateSelectedIntervalIndex === null){
            return;
        }

       
        const svgRect = event.currentTarget.getBoundingClientRect();
        const mouseYInPixels = event.clientY - svgRect.top;
        const mouseYInSVGUnits = mouseYInPixels * (svgHeight / svgRect.height);

        const graphHeightSVGUnits = svgHeight - graphPaddingBottom - graphPaddingTop;

        let newY = svgHeight - graphPaddingBottom - mouseYInSVGUnits;

        if(newY < 0){
            newY = 0;
        }

        if(newY > numberOfIncrements){
            newY = numberOfIncrements;
        }

        this.setIntervalPositions((stateIntervalPositions) => {

            const oldCoords: Coords = stateIntervalPositions[stateSelectedIntervalIndex];
            const newCoords: Coords = {x: oldCoords.x, y: newY};
            return stateIntervalPositions.map((coord, i) => i === stateSelectedIntervalIndex ? newCoords : coord);

        });

        const intervalFractionOfMaxRequests = newY / graphHeightSVGUnits;
        const newIntervalRequestsPerSecond =  Math.round(intervalFractionOfMaxRequests * yAxisMaxValue)

        this.setIntervalRequestPerSecond(newIntervalRequestsPerSecond);


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