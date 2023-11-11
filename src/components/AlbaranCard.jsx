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

    const cardImageStyles = {
        width: '120px',
        height: '120px',
        marginRight: '30px',
    };

    const cardTextStyles = {
        flex: '1',
    };

    const mail = "mailto:" + object.email;
    const tel = "tel:" + object.telephone;


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
                            <Card.Title>{object.id}</Card.Title>
                            {/* <Card.Text style={{ fontSize: "1.2rem" }}>
                                {object.username}<br />
                            </Card.Text> */}
                            <Button variant="primary" style={{ background: "purple", color: "white" }}>Ver</Button>
                        </div>
                    </Card.Body>
                </Card>
            </Link>
        </>
    );
}