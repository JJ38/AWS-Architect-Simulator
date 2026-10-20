import '../../styles/TrafficWidget.css'


export default function TrafficWidget(){


    return (
        <div className="trafficWidgetWrapper">

            <div className="costWrapper">
                <p>Cost 100$</p>
                <p>/period</p>
            </div>

            <svg viewBox='0 0 300 100' width="100%" height="100%">

                <line x1={0} y1={0} x2={0} y2={100} stroke="red"/>
                <line x1={0} y1={100} x2={100} y2={100} stroke="yellow"/>

            </svg>
        
        </div>
    );

}