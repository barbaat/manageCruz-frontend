import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { BsFillTrash3Fill } from "react-icons/bs";
import { useEffect, useState } from 'react';
import userService from '../services/api/users';

export default function CardEvent({ event, action, welcome = false }) {

    const [user, setUser] = useState({});

    const cardStyles = {
        marginBottom: '20px',
        border: '2px solid rgb(128, 0, 128)',
        borderRadius: '35px',
    };

    const cardBodyStyles = {
        display: 'flex',
        alignItems: 'center',
    };

    const cardTextStyles = {
        flex: '1',
    };

    const dateFormattedStart = () => {
        const date = event.start.dateTime;
        const formattedDateTime = date.replace(/^.*?(\d{2}:\d{2} \d{2}\/\d{2}\/\d{4})$/, '$1');
        return formattedDateTime;
    }

    const dateFormattedEnd = () => {
        const date = event.end.dateTime;
        const formattedDateTime = date.replace(/^.*?(\d{2}:\d{2} \d{2}\/\d{2}\/\d{4})$/, '$1');
        return formattedDateTime;
    }

    useEffect(() => {
        const getLogData = async () => {
            const user = await userService.getUserLogeado();
            setUser(user);
        }
        getLogData();
    }, []);

    return (
        <>
            {!welcome && (
                <>
                    <Card style={cardStyles}>
                        <Card.Body style={cardBodyStyles}>
                            <div className="text-center" style={cardTextStyles}>
                                <Card.Title>
                                    {event.summary ? event.summary : <em>"Sin título"</em>}
                                </Card.Title>
                                <div style={{ fontSize: "1.2rem" }}>
                                    {dateFormattedStart()}<br />
                                    {dateFormattedEnd()}<br />
                                    <div className=" justify-content-between mt-2 pt-2">
                                        {event.hangoutLink && (
                                            <div className="mr-2">
                                                <Link to={event.hangoutLink} target='blank'>
                                                    <Button style={{ background: "purple", color: "white" }} className="btn btn-primary btn-sm" >Unirse a llamada</Button>
                                                </Link>
                                            </div>
                                        )}
                                        <div className="ml-5 pl-5">
                                            {user && user.rolUser == 'COACH' && (
                                                <button className="btn btn-danger mt-2" onClick={() => action(event.id)}>
                                                    <BsFillTrash3Fill />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </>
            )}
            {welcome && (
                <>
                    <Card style={cardStyles}>
                        <Card.Body style={cardBodyStyles}>
                            <div className="text-center" style={cardTextStyles}>
                                <Card.Title style={{ fontSize: "1.1rem" }}>
                                    {event.summary ? event.summary : <em>"Sin título"</em>}
                                </Card.Title>
                                <div style={{ fontSize: "1.1rem" }}>
                                    {dateFormattedStart()}<br />
                                    {dateFormattedEnd()}<br />
                                    <div className=" justify-content-between mt-2 pt-2">
                                        {event.hangoutLink && (
                                            <div className="mr-2">
                                                <Link to={event.hangoutLink} target="blank">
                                                    <Button style={{ background: "purple", color: "white", fontSize: "1.1rem" }} className="btn btn-primary btn-sm" >Unirse a llamada</Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </>

            )}
        </>
    );
}