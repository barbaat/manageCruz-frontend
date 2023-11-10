import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function CardSession({ session, handleSessionFinishedWrapper, handleSessionPaidWrapper, handleCreateSubstitutionWrapper, userLog}) {

    return (
        <div className='card border-primary rounded pt-4 mt-4' key={session.id}>
            {session.noEsMio && (
                <h5 className='pb-2' style={{ color: "orange" }}>SUSTITUCIÓN</h5>
            )}
            <h5 className='pb-2'>Fecha: {session.dateParse}</h5>
            <h5 className='pb-2'>Link de meet:
                <Link to={session.linkMeet} style={{ background: "transparent", color: "white" }} className="btn btn-sm ml-4 pl-4" target='blank'>
                    <Button style={{ background: "purple", color: "white" }} className="btn btn-primary btn-sm ml-4 pl-4"> Unirse a llamada</Button>
                </Link>
            </h5>
            <h5 className='pb-2'>Precio: {session.price}€</h5>
            <h5 className='pb-2'>Realizado:
                {session.finished ?
                    <span className='text-success'> Sí</span> :
                    <span className='text-danger'> No</span>
                }
            </h5>
            {session.finished && (
                <h5 className='pb-2'>Resumen de la clase:
                    <p>"{session.resumeAfter}"</p>
                </h5>
            )}
            {!session.acceptSust && (
                <>
                    <h5 className='pb-2'>Pagado:
                        {session.paid ?
                            <span className='text-success'> Sí</span> :
                            <span className='text-danger'> No</span>
                        }
                    </h5>
                    {!session.finished && userLog.rolUser == 'COACH' && (
                        <>
                            <Link style={{ background: "transparent", color: "white" }} className="btn btn-sm ml-4 pl-4">
                                <Button style={{ background: "green", color: "white" }} className="btn btn-primary btn-sm ml-4 pl-4" 
                                onClick={(e) => handleSessionFinishedWrapper(e, session)}>¿Sesión realizada?</Button>
                            </Link>
                            <br />
                            {!session.noEsMio && (
                                <>
                                    <Link style={{ background: "transparent", color: "white" }} className="btn btn-sm ml-4 pl-4">
                                        <Button style={{ background: "green", color: "white" }} className="btn btn-primary btn-sm ml-4 pl-4" 
                                        onClick={(e) => handleCreateSubstitutionWrapper(e, session)}>¿Crear sustitución?</Button>
                                    </Link>
                                    <br />
                                </>
                            )}
                        </>
                    )}
                    {session.finished && !session.paid && userLog.rolUser == 'ACCOUNTANT' && (
                        <>
                            <Link style={{ background: "transparent", color: "white" }} className="btn btn-sm ml-4 pl-4">
                                <Button style={{ background: "green", color: "white" }} className="btn btn-primary btn-sm ml-4 pl-4" onClick={(e) => handleSessionPaidWrapper(e, session)}>¿Sesión pagada?</Button>
                            </Link>
                            <br />
                        </>
                    )}
                </>
            )}
            {session.acceptSust && (
                <>
                    <h6 className='pb-2' style={{ color: "orange" }}>Clase asignada a:  {session.coach.coachName} {session.coach.coachLastName}</h6>
                </>
            )}
        </div>
    );
}