import { useState } from 'react';
import '../../styles/TrafficWidget.css'
import { TrafficWidgetController } from '../../Controllers/TrafficWidgetController';
import type { Coords } from '../../types';



export default function TrafficWidget(){    

    let trafficChartWidth = 200; // pixels
    let trafficChartHeight = 100; // pixels
    //7 days, 24 hours etc.


    const graphOffsetX = 5; // to stop svg being cutoff when rendering near the border. Artificial padding. Need to offset in svg calculations
    const graphOffsetY = 5;

    const yValue = 50;

    let intervals: Coords[] = Array.from({ length: 7 }, () => ({ x: 0, y: 0 }));
    let yAxisMaxValue = 100;
    let xAxisMaxValue = intervals.length;

    const [stateIntervalPositions, setIntervalPositions] = useState<Coords[]>(intervals);
    const [stateTrafficWidgetController] = useState<TrafficWidgetController>(new TrafficWidgetController(setIntervalPositions));

    return (
        <div className="trafficWidgetWrapper">

            <div className="costWrapper">
                <p>Cost 100$</p>
                <p>/period</p>
            </div>

            <svg 
                className="trafficChartSVG" 
                viewBox={`0 0 ${trafficChartWidth} ${trafficChartHeight}`} 
                width="100%"
                height="100%"
                onMouseMove={(event) => stateTrafficWidgetController.intervalOnMouseMoveHandler(event, trafficChartHeight, graphOffsetY)}
                onMouseUp={() => stateTrafficWidgetController.deselectInterval()}
                onMouseLeave={() => stateTrafficWidgetController.deselectInterval()}
                > {/* viewbox = min-x min-y width height */}

                <line x1={graphOffsetX} y1={0 + graphOffsetY} x2={graphOffsetX} y2={trafficChartHeight - graphOffsetY} stroke="red"/>
                <line x1={graphOffsetX} y1={trafficChartHeight - graphOffsetY} x2={trafficChartWidth - graphOffsetX} y2={trafficChartHeight - graphOffsetY} stroke="yellow"/>

                {
                    
                    stateIntervalPositions.map((interval, i) => {

                        const intervalSpacing = (trafficChartWidth - (graphOffsetX * 2)) / (xAxisMaxValue - 1);
                        const xCoord = intervalSpacing * i; // standard shift right from y axis + number of shifts right
                      
                        return <circle 
                            className="intervalButton" 
                            key={`interval${i}`} 
                            cx={xCoord + graphOffsetX} 
                            cy={trafficChartHeight - graphOffsetY - interval.y} 
                            r="2" 
                            stroke="orange"
                            onMouseDown={() => stateTrafficWidgetController.intervalOnMouseDownHandler(i)} 
                        />

                    })

                }

                {

                    stateIntervalPositions.map((interval, i) => {

                        const intervalSpacing = (trafficChartWidth - (graphOffsetX * 2)) / (xAxisMaxValue - 1);
                        const xCoord = intervalSpacing * i; // standard shift right from y axis + number of shifts right
                  
                        if(i != 0){
                            return <line 
                                key={`line${i}`} 
                                x1={xCoord - intervalSpacing + graphOffsetX} 
                                y1={trafficChartHeight - graphOffsetY - (stateIntervalPositions[i - 1].y)} 
                                x2={xCoord + graphOffsetX} 
                                y2={trafficChartHeight - graphOffsetY - interval.y} 
                                stroke="blue"
                            />
                        }
                        
                    })

                }

            </svg>
        
        </div>
    );

}