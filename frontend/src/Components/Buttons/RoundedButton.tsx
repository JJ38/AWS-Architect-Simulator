import '../../styles/RoundedButton.css'

export default function RoundedButton({ onClickHandler, buttonText, className }: { onClickHandler: () => void; buttonText: string, className: string }){

    return(
        <div 
            className={className} 
            onClick={onClickHandler}
        >
            {buttonText}
        </div>

    )

}