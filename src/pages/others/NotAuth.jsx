import '../../css/Error.css'
import gifImage from '../../assets/images/AccessDeniedGif.gif'
import { useNavigate } from 'react-router-dom';

export default function NotAuth() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-2);
    };

    return (
        <div className="error-container">
            <div className="text-center">
                <h1>No tiene permiso para acceder a esta página</h1>
            </div>
            <img src={gifImage} alt="GIF" className="error-gif img-fluid" />
            <button className="btn btn-info btn-lg mt-5" style={{ background: "purple", color: "white" }} onClick={handleGoBack}>Volver</button>
        </div>

    );
}