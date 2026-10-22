import type { Coords, TrafficPeriod } from "../types";


export class TrafficWidgetController{

    private setIntervalPositions: React.Dispatch<React.SetStateAction<Coords[]>>;
    private setSelectedIntervalIndex: React.Dispatch<React.SetStateAction<number | null>>;
    private setIntervalRequestPerSecond: React.Dispatch<React.SetStateAction<number>>;
    private setNumberOfIntervals: React.Dispatch<React.SetStateAction<number>>;
    private setSelectedTrafficPeriod: React.Dispatch<React.SetStateAction<TrafficPeriod>>;
    private setWidgetWidth: React.Dispatch<React.SetStateAction<number>>;
    private setWidgetHeight: React.Dispatch<React.SetStateAction<number>>;
    private setIsResizingWidget: React.Dispatch<React.SetStateAction<boolean>>;

    public constructor(
        setIntervalPositions: React.Dispatch<React.SetStateAction<Coords[]>>,
        setSelectedIntervalIndex: React.Dispatch<React.SetStateAction<number | null>>,
        setIntervalRequestPerSecond: React.Dispatch<React.SetStateAction<number>>,
        setNumberOfIntervals: React.Dispatch<React.SetStateAction<number>>,
        setSelectedTrafficPeriod: React.Dispatch<React.SetStateAction<TrafficPeriod>>,
        setWidgetWidth: React.Dispatch<React.SetStateAction<number>>,
        setWidgetHeight: React.Dispatch<React.SetStateAction<number>>,
        setIsResizingWidget: React.Dispatch<React.SetStateAction<boolean>>
    ){
        this.setIntervalPositions = setIntervalPositions;
        this.setSelectedIntervalIndex = setSelectedIntervalIndex;
        this.setIntervalRequestPerSecond = setIntervalRequestPerSecond;
        this.setNumberOfIntervals = setNumberOfIntervals;
        this.setSelectedTrafficPeriod = setSelectedTrafficPeriod;
        this.setWidgetWidth = setWidgetWidth;
        this.setWidgetHeight = setWidgetHeight;
        this.setIsResizingWidget = setIsResizingWidget;
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

    public numberOfIntervalsInputOnChange(value: string, stateIntervalPositions: Coords[]){

        const input = Number(value);

        if(input < 0 || input > 31){
            return;
        }

        this.setNumberOfIntervals(input);
    
        if(input > stateIntervalPositions.length){

            const numberOfCoordsToAdd = input - stateIntervalPositions.length;

            this.setIntervalPositions((stateIntervalPositions) => {
                const newIntervalPositions = stateIntervalPositions.concat(Array.from({ length: numberOfCoordsToAdd }, () => ({ x: 0, y: 0 })));
                return newIntervalPositions;
            });

            return;
        }

        if(input < stateIntervalPositions.length){

            const numberOfCoordsToRemove = stateIntervalPositions.length - input;

            this.setIntervalPositions((stateIntervalPositions) => {

                const newIntervalPositions = Array.from({ length: stateIntervalPositions.length - numberOfCoordsToRemove }, () => ({ x: 0, y: 0 }));
                newIntervalPositions.map((interval, i) => {
                    interval.x = stateIntervalPositions[i].x;
                    interval.y = stateIntervalPositions[i].y;
                });

                return newIntervalPositions;
            });

            return;
        }

    }

    public periodButtonOnClick(trafficPeriod: TrafficPeriod){

        console.log(trafficPeriod);
        this.setSelectedTrafficPeriod(trafficPeriod);

    }

    public resizeHandleOnMouseDown(){
        this.setIsResizingWidget(true);
    }

    public resizeHandleOnMouseMove(event: MouseEvent, minWidgetWidth: number, minWidgetHeight: number){

        // The handle sits at the corner opposite the wrapper's fixed (right/bottom-anchored)
        // corner, so dragging left/up grows the box - subtract the mouse's movement instead of adding it.
        this.setWidgetWidth((width) => Math.max(minWidgetWidth, width - event.movementX));
        this.setWidgetHeight((height) => Math.max(minWidgetHeight, height - event.movementY));

    }

    public resizeHandleOnMouseUp(){
        this.setIsResizingWidget(false);
    }

}