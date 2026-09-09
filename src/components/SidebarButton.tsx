import '../styles/SidebarButton.css';

export default function SidebarButton({ serviceName, serviceDescription, serviceImg }: { serviceName: string; serviceDescription: string; serviceImg: string }) {
    return (
        <div className="sidebarButton">
            { <div className="sidebarButtonIcon">
                <img src={serviceImg} alt={serviceName} />
            </div> }
            {/* <span className="toolTip">{serviceDescription}</span>  */}
        </div>
    )
}