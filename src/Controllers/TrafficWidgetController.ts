import { yAxisIncrements, yAxisMaxValues } from "../constants";
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
    private setYAxisMaxValue: React.Dispatch<React.SetStateAction<number>>;

    public constructor(
        setIntervalPositions: React.Dispatch<React.SetStateAction<Coords[]>>,
        setSelectedIntervalIndex: React.Dispatch<React.SetStateAction<number | null>>,
        setIntervalRequestPerSecond: React.Dispatch<React.SetStateAction<number>>,
        setNumberOfIntervals: React.Dispatch<React.SetStateAction<number>>,
        setSelectedTrafficPeriod: React.Dispatch<React.SetStateAction<TrafficPeriod>>,
        setWidgetWidth: React.Dispatch<React.SetStateAction<number>>,
        setWidgetHeight: React.Dispatch<React.SetStateAction<number>>,
        setIsResizingWidget: React.Dispatch<React.SetStateAction<boolean>>,
        setYAxisMaxValue: React.Dispatch<React.SetStateAction<number>>
    ){
        this.setIntervalPositions = setIntervalPositions;
        this.setSelectedIntervalIndex = setSelectedIntervalIndex;
        this.setIntervalRequestPerSecond = setIntervalRequestPerSecond;
        this.setNumberOfIntervals = setNumberOfIntervals;
        this.setSelectedTrafficPeriod = setSelectedTrafficPeriod;
        this.setWidgetWidth = setWidgetWidth;
        this.setWidgetHeight = setWidgetHeight;
        this.setIsResizingWidget = setIsResizingWidget;
        this.setYAxisMaxValue = setYAxisMaxValue;
    }


    public intervalOnMouseMoveHandler(event: React.MouseEvent<SVGSVGElement, MouseEvent>, numberOfIncrements: number, stateSelectedIntervalIndex: number | null, svgHeight: number, graphPaddingBottom: number, graphPaddingTop: number, stateYAxisMaxValue: number){

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

        const newIntervalRequestsPerSecond = this.convertToRequestPerSecond(newY, graphHeightSVGUnits, stateYAxisMaxValue);
        this.setIntervalRequestPerSecond(newIntervalRequestsPerSecond);

    }

    public intervalOnMouseDownHandler(intervalIndex: number, stateIntervalPositions: Coords[], graphHeightSVGUnits: number, stateYAxisMaxValue: number){

        const newIntervalRequestsPerSecond = this.convertToRequestPerSecond(stateIntervalPositions[intervalIndex].y, graphHeightSVGUnits, stateYAxisMaxValue);
        this.setIntervalRequestPerSecond(newIntervalRequestsPerSecond);
        this.setSelectedIntervalIndex(intervalIndex);

    }

    public deselectInterval(stateSelectedIntervalIndex?: number | null, stateIntervalRequestPerSecond?: number, stateIntervalPositions?: Coords[], graphHeightSVGUnits?: number, yAxisMaxValue?: number){

        //is interval currently selected
        if(stateSelectedIntervalIndex != null){

            if(stateIntervalRequestPerSecond === undefined || yAxisMaxValue === undefined || graphHeightSVGUnits === undefined || stateIntervalPositions === undefined){
                return;
            }

            this.rightSizeChart(stateIntervalPositions, graphHeightSVGUnits, yAxisMaxValue);

        }

        this.setSelectedIntervalIndex(null);

    }

    public numberOfIntervalsInputOnChange(value: string, stateIntervalPositions: Coords[], maxNumberOfIntervals: number, graphHeightSVGUnits: number, yAxisMaxValue: number){

        const input = Number(value);

        if(input < 0 || input > maxNumberOfIntervals){
            return;
        }

        this.setNumberOfIntervals(input);
        this.rightSizeChart(stateIntervalPositions, graphHeightSVGUnits, yAxisMaxValue);

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

    private rightSizeChart(stateIntervalPositions: Coords[], graphHeightSVGUnits: number, yAxisMaxValue: number){

        const zoomOutThreshold = 0.95; //is there a value that is 95% of the max y axis value

        const valueAboveZoomOutThreshold: Coords | undefined = stateIntervalPositions.find((value) =>{ 
            if(value.y / graphHeightSVGUnits > zoomOutThreshold){
                return value;
            }
        });

        //if so is it in top 5%
        if(valueAboveZoomOutThreshold != undefined){

            const newYAxisMaxValue = yAxisMaxValues.find((value, i) => {

                if(i - 1 === yAxisMaxValues.length){
                    return;
                }

                if(value > yAxisMaxValue && yAxisMaxValue < yAxisMaxValues[i + 1]){
                    return value
                }

            }) ?? yAxisMaxValues[yAxisMaxValues.length - 1]

            this.setYAxisMaxValue(newYAxisMaxValue);
            this.calibrateChartIntervals(yAxisMaxValue, newYAxisMaxValue, graphHeightSVGUnits, stateIntervalPositions);

        }else{

            const intervalsY: number[] = stateIntervalPositions.map((value) =>{ 
                return value.y;
            });

            intervalsY.sort((a, b) => a - b);
            const highestIntervalY: number = intervalsY[intervalsY.length - 1];

            //if all values are in the bottom 50%   
            if(highestIntervalY < graphHeightSVGUnits / 2){

                const highestNumberOfRequestsPerSecond = this.convertToRequestPerSecond(highestIntervalY, graphHeightSVGUnits, yAxisMaxValue);
                const newYAxisMaxValue = yAxisMaxValues.find((value, i) => {

                    if(i === 0){
                        return;
                    }

                    if(value > highestNumberOfRequestsPerSecond && highestNumberOfRequestsPerSecond > yAxisMaxValues[i - 1]){
                        return value;
                    }

                }) ?? yAxisMaxValues[0];

                this.setYAxisMaxValue(newYAxisMaxValue);
                this.calibrateChartIntervals(yAxisMaxValue, newYAxisMaxValue, graphHeightSVGUnits, stateIntervalPositions);
                
            }

        }

    }
    
    private calibrateChartIntervals(oldYAxisMaxValue: number, newYAxisMaxValue: number, graphHeightSVGUnits: number, stateIntervalPositions: Coords[]){

        const intervalRequestPerSecond = stateIntervalPositions.map((interval) => {
            return this.convertToRequestPerSecond(interval.y, graphHeightSVGUnits, oldYAxisMaxValue);
        });

        const newIntervalPositions = stateIntervalPositions.map((interval, i) => {

            const newY = intervalRequestPerSecond[i] != 0 ? intervalRequestPerSecond[i] / newYAxisMaxValue : 0;
            return {x:interval.x, y: newY * graphHeightSVGUnits}
        }); 

        this.setIntervalPositions(newIntervalPositions);
        
    }

    private convertToRequestPerSecond(yPos: number, graphHeightSVGUnits: number, yAxisMaxValue: number){
        return Math.round((yPos / graphHeightSVGUnits) * yAxisMaxValue);
    }



}