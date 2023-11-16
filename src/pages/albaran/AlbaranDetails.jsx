import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col, Table, Spinner, Button } from 'react-bootstrap';
import CustomNavbar from '../../components/NavbarComponent.jsx';
import albaranService from '../../services/api/albaran.js';

export default function AlbaranDetails() {
    const { id } = useParams();
    const [albaran, setAlbaran] = useState(null);
    const [botelleros, setBotelleros] = useState(null);
    const [sinAlcohol, setSinAlcohol] = useState(0);
    const [sinGluten, setSinGluten] = useState(0);
    const [milPesetas, setMilPesetas] = useState(0);
    const [aguas, setAguas] = useState(0);

    useEffect(() => {
        const getAlbaran = async () => {
            const albaran = await albaranService.getAlbaran(id);
            console.log(albaran);
            setAlbaran(albaran);
            const detalles = albaran.detalles;
            const botelleros = detalles.filter(detalle => detalle.nombreProducto === "Botelleros");
            setBotelleros(botelleros);
            setSinGluten(botelleros.length * 10);
            setSinAlcohol(botelleros.length * 10);
            setMilPesetas(botelleros.length * 10);
            setAguas(botelleros.length * 10);
        }
        getAlbaran();
    }, []);

    function roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }

    function buildUrl() {
        console.log("data:image/png;base64," + albaran.firma);
        return "data:image/png;base64," + albaran.firma;
    }

    async function handlePrepAndConf(e) {
        albaran.preparadoYConfirmado = true;
        await albaranService.updateAlb(id, albaran);
        window.location.reload();
    }


    return (
        <>
            <CustomNavbar />
            {albaran && (
                <Container>
                    <h1 style={{ color: "#f8c76495" }} className="text-center"><strong>Albarán #{albaran.id}</strong></h1>
                    <br />
                    <Card>
                        <Card.Header>
                            <h2 style={{ color: "#f8c76495" }}>Información general</h2>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col sm="6">
                                            <h4><strong>Fecha de creación:</strong> {new Date(albaran.fecha).toLocaleDateString()}</h4>
                                            <h4><strong>Número de Cliente:</strong> {albaran.vendedor}</h4>
                                        </Col>
                                        <Col sm="6">
                                            <h4><strong>DNI del cliente:</strong> {albaran.cliente.dni}</h4>
                                            <h4><strong>Cliente: </strong>
                                                <Button className='btn btn-primary' href={`/users/${albaran.cliente.username}`}>{albaran.cliente.name} {albaran.cliente.lastName}</Button>
                                            </h4>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <br />
                    <br />
                    <Card>
                        <Card.Header>
                            <h2 style={{ color: "#f8c76495" }}>Detalles del Albarán</h2>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col className='text-center'>
                                    <h4 style={{ color: "#f8c76495" }}>Productos a entregar</h4>
                                    <Table striped bordered hover variant="dark">
                                        <thead>
                                            <tr>
                                                <th>Nombre del Producto</th>
                                                <th>Unidades</th>
                                                <th>Precio</th>
                                                <th>Importe</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {albaran.detalles.map((detalle) => (
                                                <tr key={detalle.id}>
                                                    <td>{detalle.nombreProducto}</td>
                                                    <td>{detalle.unidades}</td>
                                                    <td>{detalle.precio}€</td>
                                                    <td>{detalle.importe}€</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Col>
                                <Col className='text-center'>
                                    <h4 style={{ color: "#f8c76495" }}>Mercancía gratuita</h4>
                                    {botelleros.length > 0 ? (
                                    <Table striped bordered hover variant="dark">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Cantidad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Sin Alcohol</td>
                                                <td>{sinAlcohol}</td>
                                            </tr>
                                            <tr>
                                                <td>Sin Gluten</td>
                                                <td>{sinGluten}</td>
                                            </tr>
                                            <tr>
                                                <td>Mil Pesetas</td>
                                                <td>{milPesetas}</td>
                                            </tr>
                                            <tr>
                                                <td>Aguas 0,5L</td>
                                                <td>{aguas}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    ) : (
                                        <h5 className='pt-4'>No incluido</h5>
                                    )}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <br />
                    <br />
                    <Card>
                        <Card.Header>
                            <h2 style={{ color: "#f8c76495" }}>Total</h2>
                        </Card.Header>
                        <Card.Body>
                            <Row className='text-center'>
                                <h4><strong>Importe a pagar por fianza: </strong>{roundToTwo(albaran.total)}€</h4>
                            </Row>
                        </Card.Body>
                    </Card>
                    <br />
                    <br />
                    <Card>
                        <Card.Header>
                            <h2 style={{ color: "#f8c76495" }}>Información de Pago</h2>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <h4><strong>Forma de Pago:</strong> {albaran.formaPago}</h4>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    {albaran.firma && (
                        <>
                            <h4 className='text-center pt-4'>Firmado ✅</h4>
                            <div className="d-flex justify-content-center pt-2 pb-5">
                                <img src={buildUrl()} alt="Firma" />
                            </div>
                        </>
                    )}
                    {!albaran.firma && albaran.preparadoYConfirmado && (
                        <>
                            <h4 className='text-center pt-4'>Preparado y confirmado ✅</h4>
                            <h4 className='text-center pt-4'>Esperando firma...</h4>
                        </>
                    )}
                    <div className="d-flex justify-content-center align-items-center pt-5 pb-5">
                        {!albaran.firma && (
                            <>
                                <Button className='btn btn-primary' href={`/albaran/${albaran.id}/edit`} style={{ marginRight: '10px' }}>Editar</Button>
                                {albaran.preparadoYConfirmado ? (
                                    <Button className='btn btn-secondary' href={`/albaran/sign/${albaran.id}`}>Firmar</Button>
                                ) : (
                                    <Button className='btn btn-success' onClick={(e) => handlePrepAndConf(e)}>Preparar y confirmar</Button>
                                )}
                            </>
                        )}
                    </div>
                    <br />
                    <br />

                </Container>
            )}
            {!albaran && (
                <Container>
                    <h1>Albarán #{id}</h1>
                    <Spinner animation="border" variant="primary" />
                </Container>
            )}
        </>
    );
}