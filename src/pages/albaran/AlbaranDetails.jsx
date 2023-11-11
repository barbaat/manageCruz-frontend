import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col, Table, Spinner } from 'react-bootstrap';
import CustomNavbar from '../../components/NavbarComponent.jsx';
import albaranService from '../../services/api/albaran.js';

export default function AlbaranDetails() {
    const { id } = useParams();
    const [albaran, setAlbaran] = useState(null);

    useEffect(() => {
        const getAlbaran = async () => {
            const albaran = await albaranService.getAlbaran(id);
            console.log(albaran);
            setAlbaran(albaran);
        }
        getAlbaran();
    }, []);

    return (
        <>
            <CustomNavbar />
            {albaran && (
                <Container>
                    <h1 className="text-center">Albarán #{albaran.id}</h1>
                    <br />
                    <Card>
                        <Card.Header>
                            <h2>Información del Cliente</h2>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col sm="6">
                                            <h4><strong>Fecha:</strong> {new Date(albaran.fecha).toLocaleDateString()}</h4>
                                            <h4><strong>Número de Cliente:</strong> {albaran.numeroCliente}</h4>
                                        </Col>
                                        <Col sm="6">
                                            <h4><strong>NIF/CIF:</strong> {albaran.nifCif}</h4>
                                            <h4><strong>Vendedor:</strong> {albaran.vendedor}</h4>
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
                            <h2>Detalles del Albarán</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="table-responsive">
                                <Table striped bordered hover variant="dark">
                                    <thead>
                                        <tr>
                                            <th>Nombre del Producto</th>
                                            <th>Descripción</th>
                                            <th>Unidades</th>
                                            <th>Precio</th>
                                            <th>Importe</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {albaran.detalles.map((detalle) => (
                                            <tr key={detalle.id}>
                                                <td>{detalle.nombreProducto}</td>
                                                <td>{detalle.descripcionProducto}</td>
                                                <td>{detalle.unidades}</td>
                                                <td>{detalle.precio}€</td>
                                                <td>{detalle.importe}€</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                    <br />
                    <br />
                    <Card>
                        <Card.Header>
                            <h2>Total</h2>
                        </Card.Header>
                        <Card.Body>
                            <Row className='text-center'>
                                <Col>
                                    <Row>
                                        <Col sm="6">
                                            <h4><strong>Total Bruto:</strong> {albaran.totalBruto}€</h4>
                                            <h4><strong>Descuento ({albaran.porcentajeDescuento}%):</strong> {albaran.importeDescuento}€</h4>
                                        </Col>
                                        <Col sm="6">
                                            <h4><strong>Base Imponible:</strong> {albaran.baseImponible}€</h4>
                                            <h4><strong>IVA ({albaran.porcentajeIVA}%):</strong> {albaran.importeIVA}€</h4>
                                        </Col>
                                        <h4 className='pt-4'><strong>Total:</strong> {albaran.total}€</h4>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <br />
                    <br />
                    <Card>
                        <Card.Header>
                            <h2>Información de Pago</h2>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <h4><strong>Forma de Pago:</strong> {albaran.formaPago}</h4>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
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