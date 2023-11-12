import '../css/CardProfile.css';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { useState } from "react";


export default function AlbaranCard({ object }) {

    const [, setHovered] = useState(false);

    const cardStyles = {
        marginBottom: '20px',
        border: '4px solid rgb(0, 0, 0)',
        borderRadius: '35px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 6px -3px 20px 3px',
    };

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const cardBodyStyles = {
        display: 'flex',
        alignItems: 'center',
    };

    const cardTextStyles = {
        flex: '1',
    };


    return (
        <>
            <Link to={`/albaran/${object.id}`} style={{ textDecoration: "none" }}>
                <Card
                    className="custom-card"
                    style={cardStyles}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Card.Body style={cardBodyStyles}>
                        <div className="text-center" style={cardTextStyles}>
                            <Card.Title>Cliente: {object.cliente.name} {object.cliente.lastName}</Card.Title>
                            <Card.Text style={{ fontSize: "1.2rem" }}>
                                <p>Fecha: {new Date(object.fecha).toLocaleDateString()}</p>
                                <p>Total: {object.total.toFixed(2)} €</p>
                                <p>Forma de Pago: {object.formaPago}</p>
                            </Card.Text>
                            <Button variant="primary" style={{ background: "purple", color: "white" }}>Ver</Button>
                        </div>
                    </Card.Body>
                </Card>
            </Link>
        </>
    );
}