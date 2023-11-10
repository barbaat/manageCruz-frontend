import '../css/CardProfile.css';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { useState } from "react";


export default function CardSustitution({ object }) {

    const [, setHovered] = useState(false);

    const cardStyles = {
        marginBottom: '20px',
        border: '4px solid rgb(128, 0, 128)',
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
            <Link to={`/sust/${object.id}`} style={{ textDecoration: "none" }}>
                <Card
                    className="custom-card"
                    style={cardStyles}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Card.Body style={cardBodyStyles}>
                        <div className="text-center" style={cardTextStyles}>
                            <Card.Title>Temario: {object.resumeOfSub}</Card.Title>
                            <h5>Curso: {object.teachingSession.student.nameCourse}</h5>
                            <h5>Fecha: {object.teachingSession.dateParse}</h5>
                            <Button variant="primary" style={{ background: "purple", color: "white" }}>Ver</Button>
                        </div>
                    </Card.Body>
                </Card>
            </Link>
        </>
    );
}