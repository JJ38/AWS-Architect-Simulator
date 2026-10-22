import { useState } from 'react';
import '../../styles/TrafficWidget.css'
import { TrafficWidgetController } from '../../Controllers/TrafficWidgetController';
import type { Coords } from '../../types';



export default function TrafficWidget(){    

    let svgWidth = 200; // internal coordinate space
    let svgHeight = 120; // internal coordinate space
    //7 days, 24 hours etc.

    //Below are in svg space no in pixels
    const graphPaddingLeft = 20;
    const graphPaddingRight = 5;
    const graphPaddingTop = 20;
    const graphPaddingBottom = 5;

    const intervalLabelWidth = 55;
    const intervalLabelHeight = 18;
    const intervalLabelRadius = 5;

    const minNumberOfYAxisLabels = 2;
    const maxNumberOfYAxisLabels = 6;

    const numberOfIncrements = svgHeight - graphPaddingTop - graphPaddingBottom; //Number of unique positions in the y axis the button can be dragged to.

    let intervals: Coords[] = Array.from({ length: 7 }, () => ({ x: 0, y: 0 }));
    let yAxisMaxValue = 799;
    let xAxisMaxValue = intervals.length;

    const heightOfGraphSVGUnits = svgHeight - graphPaddingBottom - graphPaddingTop;

    const yAxisLabels: {numberOfRequests: number, fractionOfMax: number}[] = getYAxisLabels(yAxisMaxValue, minNumberOfYAxisLabels, maxNumberOfYAxisLabels);

    const [stateIntervalPositions, setIntervalPositions] = useState<Coords[]>(intervals);
    const [stateSelectedIntervalIndex, setSelectedIntervalIndex] = useState<number | null>(null);
    const [stateIntervalRequestPerSecond, setIntervalRequestPerSecond] = useState<number>(0);

    const [stateTrafficWidgetController] = useState<TrafficWidgetController>(new TrafficWidgetController(setIntervalPositions, setSelectedIntervalIndex, setIntervalRequestPerSecond));

    return (
        <div className="trafficWidgetWrapper">

            <div className="costWrapper">
                <p>Cost 100$</p>
                <p>/period</p>
            </div>

            <svg 
                className="trafficChartSVG" 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                width="100%"
                height="100%"
                onMouseMove={(event) => stateTrafficWidgetController.intervalOnMouseMoveHandler(event, numberOfIncrements, stateSelectedIntervalIndex, svgHeight, graphPaddingBottom, graphPaddingTop, yAxisMaxValue)}
                onMouseUp={() => stateTrafficWidgetController.deselectInterval()} 
                onMouseLeave={() => stateTrafficWidgetController.deselectInterval()}
                > {/* viewbox = min-x min-y width height */}
                
                <text className="yAxisLabel" x={graphPaddingLeft - 3} y={0 + graphPaddingTop} textAnchor='end' dominantBaseline='middle'>{yAxisMaxValue}</text>

                <line x1={graphPaddingLeft} y1={0 + graphPaddingTop} x2={graphPaddingLeft} y2={svgHeight - graphPaddingBottom} stroke="red"/>
                <line x1={graphPaddingLeft} y1={svgHeight - graphPaddingBottom} x2={svgWidth - graphPaddingRight} y2={svgHeight - graphPaddingBottom} stroke="yellow"/>

                {
                    yAxisLabels.map((label) => {
                        return <line x1={graphPaddingLeft} y1={svgHeight - graphPaddingBottom - (heightOfGraphSVGUnits * label.fractionOfMax)} x2={svgWidth - graphPaddingRight} y2={svgHeight - graphPaddingBottom - (heightOfGraphSVGUnits * label.fractionOfMax)} stroke="gray"/>
                    })
                }

                {
                    yAxisLabels.map((label) => {
                        return <text className="yAxisLabel" x={graphPaddingLeft - 3} y={svgHeight - graphPaddingBottom - (heightOfGraphSVGUnits * label.fractionOfMax)} textAnchor='end' dominantBaseline='middle'>{label.numberOfRequests}</text>

                    })
                }

                {

                    stateIntervalPositions.map((interval, i) => {

                        const intervalSpacing = (svgWidth - (graphPaddingLeft + graphPaddingRight)) / (xAxisMaxValue - 1);
                        const xCoord = intervalSpacing * i; // standard shift right from y axis + number of shifts right
                  
                        if(i != 0){
                            return <line 
                                key={`line${i}`} 
                                x1={xCoord - intervalSpacing + graphPaddingLeft} 
                                y1={svgHeight - graphPaddingBottom - (stateIntervalPositions[i - 1].y)} 
                                x2={xCoord + graphPaddingLeft} 
                                y2={svgHeight - graphPaddingBottom - interval.y} 
                                stroke="blue"
                            />
                        }
                        
                    })

                }

                {
                    
                    stateIntervalPositions.map((interval, i) => {

                        const intervalSpacing = (svgWidth - (graphPaddingLeft + graphPaddingRight)) / (xAxisMaxValue - 1);
                        const xCoord = intervalSpacing * i;
                        
                        return <circle 
                            className="intervalButton" 
                            key={`interval${i}`} 
                            cx={xCoord + graphPaddingLeft} 
                            cy={svgHeight - graphPaddingBottom - interval.y} 
                            r="2" 
                            stroke="orange"
                            onMouseDown={() => stateTrafficWidgetController.intervalOnMouseDownHandler(i)} 
                        />

                    })

                }

                {
                    
                    stateIntervalPositions.map((interval, i) => {

                        const intervalSpacing = (svgWidth - (graphPaddingLeft + graphPaddingRight)) / (xAxisMaxValue - 1);
                        const xCoord = intervalSpacing * i;

                        if(stateSelectedIntervalIndex === i){
                            return <g>
                                <rect className="intervalLabelContainer" x={xCoord + graphPaddingLeft - (intervalLabelWidth / 2)} y={svgHeight - graphPaddingBottom - interval.y - 8 - (intervalLabelHeight / 2)} width={intervalLabelWidth} height={intervalLabelHeight} rx={intervalLabelRadius} ry={intervalLabelRadius}></rect>
                                <text className="intervalLabel" x={xCoord + graphPaddingLeft} y={svgHeight - graphPaddingBottom - interval.y - 8} textAnchor='middle' dominantBaseline='middle'>{stateIntervalRequestPerSecond} Req/s</text>
                            </g>
                        }
                        
                    })

                }

            </svg>
        
        </div>
    );

}

function getYAxisLabels(yAxisMaxValue: number, minNumberOfYAxisLabels: number, maxNumberOfYAxisLabels: number){

    //list of acceptable increments. Loop through to find one that divides in the acceptable range of min - max y axis labels. Choose highest
    const yAxisIncrements: number[] = [1, 2, 5, 10, 20, 25, 50, 75, 100, 200, 250, 500, 750, 1000] 

    const increment: number | undefined = yAxisIncrements.find((increment: number) => {
        const numberOfIncrements = yAxisMaxValue / increment;
        if(numberOfIncrements > minNumberOfYAxisLabels && numberOfIncrements < maxNumberOfYAxisLabels){
            return increment;
        }
    }); 

    const yAxisLabels: {numberOfRequests: number, fractionOfMax: number}[] = [];


    if(increment === undefined){
        return yAxisLabels;
    }

    console.log(increment);

    const numberOfYAxisLabels: number = Math.floor(yAxisMaxValue / increment);

    for(let i = 0; i < numberOfYAxisLabels; i++){
        yAxisLabels.push({
            numberOfRequests: increment * (i + 1), 
            fractionOfMax: increment * (i + 1) / yAxisMaxValue
        });
    }

    console.log(yAxisLabels);

    return yAxisLabels;

}