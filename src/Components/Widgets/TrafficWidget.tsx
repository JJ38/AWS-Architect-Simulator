import { useState } from 'react';
import '../../styles/TrafficWidget.css'
import { TrafficWidgetController } from '../../Controllers/TrafficWidgetController';
import type { Coords } from '../../types';



export default function TrafficWidget(){    

    let svgWidth = 200; // internal coordinate space
    let svgHeight = 120; // internal coordinate space
    //7 days, 24 hours etc.

    const graphPaddingX = 5; // to stop svg being cutoff when rendering near the border. Artificial padding. Need to offset in svg calculations
    const graphPaddingTop = 20;
    const graphPaddingBottom = 5;

    const intervalLabelWidth = 55;
    const intervalLabelHeight = 18;
    const intervalLabelRadius = 5;

    const numberOfIncrements = svgHeight - graphPaddingTop - graphPaddingBottom; //Number of unique positions in the y axis the button can be dragged to.

    let intervals: Coords[] = Array.from({ length: 7 }, () => ({ x: 0, y: 0 }));
    let yAxisMaxValue = 100;
    let xAxisMaxValue = intervals.length;

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

                <line x1={graphPaddingX} y1={0 + graphPaddingTop} x2={graphPaddingX} y2={svgHeight - graphPaddingBottom} stroke="red"/>
                <line x1={graphPaddingX} y1={svgHeight - graphPaddingBottom} x2={svgWidth - graphPaddingX} y2={svgHeight - graphPaddingBottom} stroke="yellow"/>

                {

                    stateIntervalPositions.map((interval, i) => {

                        const intervalSpacing = (svgWidth - (graphPaddingX * 2)) / (xAxisMaxValue - 1);
                        const xCoord = intervalSpacing * i; // standard shift right from y axis + number of shifts right
                  
                        if(i != 0){
                            return <line 
                                key={`line${i}`} 
                                x1={xCoord - intervalSpacing + graphPaddingX} 
                                y1={svgHeight - graphPaddingBottom - (stateIntervalPositions[i - 1].y)} 
                                x2={xCoord + graphPaddingX} 
                                y2={svgHeight - graphPaddingBottom - interval.y} 
                                stroke="blue"
                            />
                        }
                        
                    })

                }

                {
                    
                    stateIntervalPositions.map((interval, i) => {

                        const intervalSpacing = (svgWidth - (graphPaddingX * 2)) / (xAxisMaxValue - 1);
                        const xCoord = intervalSpacing * i;
                        
                        return <circle 
                            className="intervalButton" 
                            key={`interval${i}`} 
                            cx={xCoord + graphPaddingX} 
                            cy={svgHeight - graphPaddingBottom - interval.y} 
                            r="2" 
                            stroke="orange"
                            onMouseDown={() => stateTrafficWidgetController.intervalOnMouseDownHandler(i)} 
                        />

                    })

                }

                {
                    
                    stateIntervalPositions.map((interval, i) => {

                        const intervalSpacing = (svgWidth - (graphPaddingX * 2)) / (xAxisMaxValue - 1);
                        const xCoord = intervalSpacing * i;

                        if(stateSelectedIntervalIndex === i){
                            return <g>
                                <rect className="intervalLabelContainer" x={xCoord + graphPaddingX - (intervalLabelWidth / 2)} y={svgHeight - graphPaddingBottom - interval.y - 8 - (intervalLabelHeight / 2)} width={intervalLabelWidth} height={intervalLabelHeight} rx={intervalLabelRadius} ry={intervalLabelRadius}></rect>
                                <text className="intervalLabel" x={xCoord + graphPaddingX} y={svgHeight - graphPaddingBottom - interval.y - 8} textAnchor='middle' dominantBaseline='middle'>{stateIntervalRequestPerSecond} Req/s</text>
                            </g>
                        }
                        
                    })

                }

            </svg>
        
        </div>
    );

}