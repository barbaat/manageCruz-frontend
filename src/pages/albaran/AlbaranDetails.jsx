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
                                    <p><strong>Fecha:</strong> {new Date(albaran.fecha).toLocaleDateString()}</p>
                                    <p><strong>Número de Cliente:</strong> {albaran.numeroCliente}</p>
                                    <p><strong>NIF/CIF:</strong> {albaran.nifCif}</p>
                                    <p><strong>Vendedor:</strong> {albaran.vendedor}</p>
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
                            <Row>
                                <Col>
                                    <p><strong>Total Bruto:</strong> {albaran.totalBruto}€</p>
                                    <p><strong>Descuento ({albaran.porcentajeDescuento}%):</strong> {albaran.importeDescuento}€</p>
                                    <p><strong>Base Imponible:</strong> {albaran.baseImponible}€</p>
                                    <p><strong>IVA ({albaran.porcentajeIVA}%):</strong> {albaran.importeIVA}€</p>
                                    <p><strong>Total:</strong> {albaran.total}€</p>
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
                                    <p><strong>Forma de Pago:</strong> {albaran.formaPago}</p>
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