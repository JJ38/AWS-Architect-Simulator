import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import '../../styles/TrafficWidget.css'
import { TrafficWidgetController } from '../../Controllers/TrafficWidgetController';
import type { Coords, TrafficPeriod } from '../../types';
import RoundedButton from '../Buttons/RoundedButton';



export default function TrafficWidget(){    

    const svgRef = useRef<SVGSVGElement>(null);

    // viewBox tracks the svg's actual rendered pixel size (via ResizeObserver) instead of a
    // fixed 200x120, so growing the widget adds more drawing room instead of scaling the grid up.
    const [svgWidth, setSvgWidth] = useState<number>(200);
    const [svgHeight, setSvgHeight] = useState<number>(120);

   
    let intervals: Coords[] = Array.from({ length: 24 }, () => ({ x: 0, y: 0 }));
    let yAxisMaxValue = 200;
    let xAxisMaxValue = intervals.length;

    //Below are in svg space no in pixels
    const graphPaddingLeft = 5 + (5 * (yAxisMaxValue.toString().length));
    const graphPaddingRight = 5;
    const graphPaddingTop = 20;
    const graphPaddingBottom = 5;

    const intervalLabelWidth = 55;
    const intervalLabelHeight = 18;
    const intervalLabelRadius = 5;

    const minNumberOfYAxisLabels = 2;
    const maxNumberOfYAxisLabels = 6;

    const minWidgetWidth = 200; // matches .trafficWidgetWrapper's CSS min-width
    const minWidgetHeight = 100; // matches .trafficWidgetWrapper's CSS min-height

    const numberOfIncrements = svgHeight - graphPaddingTop - graphPaddingBottom; //Number of unique positions in the y axis the button can be dragged to.
    
    const heightOfGraphSVGUnits = svgHeight - graphPaddingBottom - graphPaddingTop;

    const yAxisLabels: {numberOfRequests: number, fractionOfMax: number}[] = getYAxisLabels(yAxisMaxValue, minNumberOfYAxisLabels, maxNumberOfYAxisLabels);

    const [stateIntervalPositions, setIntervalPositions] = useState<Coords[]>(intervals);
    const [stateSelectedIntervalIndex, setSelectedIntervalIndex] = useState<number | null>(null);
    const [stateIntervalRequestPerSecond, setIntervalRequestPerSecond] = useState<number>(0);
    const [stateNumberOfIntervals, setNumberOfIntervals] = useState<number>(24);
    const [stateSelectedTrafficPeriod, setSelectedTrafficPeriod] = useState<TrafficPeriod>("Hour");
    const [stateWidgetWidth, setWidgetWidth] = useState<number>(300);
    const [stateWidgetHeight, setWidgetHeight] = useState<number>(320);
    const [stateIsResizingWidget, setIsResizingWidget] = useState<boolean>(false);

    const [stateTrafficWidgetController] = useState<TrafficWidgetController>(new TrafficWidgetController(setIntervalPositions, setSelectedIntervalIndex, setIntervalRequestPerSecond, setNumberOfIntervals, setSelectedTrafficPeriod, setWidgetWidth, setWidgetHeight, setIsResizingWidget));

    useEffect(() => {

        if(!stateIsResizingWidget){
            return;
        }

        const resizeHandleOnMouseMove = (event: MouseEvent) => stateTrafficWidgetController.resizeHandleOnMouseMove(event, minWidgetWidth, minWidgetHeight);
        const resizeHandleOnMouseUp = () => stateTrafficWidgetController.resizeHandleOnMouseUp();

        window.addEventListener('mousemove', resizeHandleOnMouseMove);
        window.addEventListener('mouseup', resizeHandleOnMouseUp);

        return () => {
            window.removeEventListener('mousemove', resizeHandleOnMouseMove);
            window.removeEventListener('mouseup', resizeHandleOnMouseUp);
        };

    }, [stateIsResizingWidget]);

    useLayoutEffect(() => {

        if(!svgRef.current){
            return;
        }

        const resizeObserver = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            setSvgWidth(width);
            setSvgHeight(height);
        });

        resizeObserver.observe(svgRef.current);

        return () => resizeObserver.disconnect();

    }, []);


    return (
        <div className="trafficWidgetWrapper" style={{ width: stateWidgetWidth, height: stateWidgetHeight }}>

            <div className="resizeHandleTopLeft" onMouseDown={() => stateTrafficWidgetController.resizeHandleOnMouseDown()}></div>

            <div className="costWrapper">
                <p>Cost 100$</p>
                <p>/period</p>
            </div>

            <div className="timeFrameWrapper">
                <input name="intervalInput" className='numberOfIntervalsInput' type="number" max="31" min="1" value={stateNumberOfIntervals} onChange={(event) => stateTrafficWidgetController.numberOfIntervalsInputOnChange(event.target.value, stateIntervalPositions)}/>
                <RoundedButton className={`roundedButton ${stateSelectedTrafficPeriod === 'Hour' && 'selectedPeriodButton'}`} onClickHandler={() => stateTrafficWidgetController.periodButtonOnClick('Hour')} buttonText={'Hours'}></RoundedButton>
                <RoundedButton className={`roundedButton ${stateSelectedTrafficPeriod === 'Day' && 'selectedPeriodButton'}`} onClickHandler={() => stateTrafficWidgetController.periodButtonOnClick('Day')} buttonText={'Days'}></RoundedButton>
                <RoundedButton className={`roundedButton ${stateSelectedTrafficPeriod === 'Month' && 'selectedPeriodButton'}`} onClickHandler={() => stateTrafficWidgetController.periodButtonOnClick('Month')} buttonText={'Months'}></RoundedButton>
            </div>


            <svg
                ref={svgRef}
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

                        const intervalSpacing = (svgWidth - (graphPaddingLeft + graphPaddingRight)) / (stateNumberOfIntervals - 1);
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

                        const intervalSpacing = (svgWidth - (graphPaddingLeft + graphPaddingRight)) / (stateNumberOfIntervals - 1);
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

                        const intervalSpacing = (svgWidth - (graphPaddingLeft + graphPaddingRight)) / (stateNumberOfIntervals - 1);
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

    const numberOfYAxisLabels: number = Math.floor(yAxisMaxValue / increment);

    for(let i = 0; i < numberOfYAxisLabels; i++){
        yAxisLabels.push({
            numberOfRequests: increment * (i + 1), 
            fractionOfMax: increment * (i + 1) / yAxisMaxValue
        });
    }

    return yAxisLabels;

}