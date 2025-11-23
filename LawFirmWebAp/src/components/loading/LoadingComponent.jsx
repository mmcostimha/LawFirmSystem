
import loading_gif from "../../assets/Images/loadingRed.svg"

export default function LoadingComponent({size}){

    return <div style={
        {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    }>
        <img src={loading_gif} alt="Loading gift" style={
        {
            width: size,
            height: size,
            objectFit: "contain",
            color:"black",
        }
    }/>
    </div>
}