import "../css/Loader.css";

export default function LoaderComponent() {
    return (
        <div className="box-canvas">
            <div className="wheel-leg left"></div>
            <div className="wheel-leg right"></div>
            <div className="wheel">
            </div>
            <div className="hamster">
                <div className="body">
                    <div className="eye"></div>
                    <div className="nose"></div>
                </div>
                <div className="ear"></div>
                <div className="tail"></div>
                <div className="leg front"></div>
                <div className="leg back"></div>
            </div>
        </div>
    );
}