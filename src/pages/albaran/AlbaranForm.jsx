import React, { useEffect, useState } from "react";
import { Form, Button, Table, Col, Row, Container } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";
import CustomNavbar from '../../components/NavbarComponent.jsx';
import { createFilter } from 'react-select';
import "../../css/AlbaranForm.css"
import albaranService from "../../services/api/albaran.js";
import userService from "../../services/api/users.js";

// Datos de prueba para los clientes y los productos
const clientes = [
    { value: "37", label: "B91114306 - Electrodomésticos S.A." },
    { value: "42", label: "B12345678 - Muebles y Decoración S.L." },
    { value: "51", label: "B98765432 - Informática y Comunicaciones S.A." },
];

// Función para calcular el importe de un detalle
const calcularImporte = (unidades, precio, porcentajeDescuento) => {
    return unidades * precio * (1 - porcentajeDescuento / 100);
};

// Función para calcular el total bruto de un albarán
const calcularTotalBruto = (detalles) => {
    return detalles.reduce((total, detalle) => total + detalle.importe, 0);
};

// Función para calcular el importe del descuento de un albarán
const calcularImporteDescuento = (totalBruto, porcentajeDescuento) => {
    return totalBruto * (porcentajeDescuento / 100);
};

// Función para calcular la base imponible de un albarán
const calcularBaseImponible = (totalBruto, importeDescuento) => {
    return totalBruto - importeDescuento;
};

// Función para calcular el importe del IVA de un albarán
const calcularImporteIVA = (baseImponible, porcentajeIVA) => {
    return baseImponible * (porcentajeIVA / 100);
};

// Función para calcular el importe del recargo de un albarán
const calcularImporteRec = (baseImponible, porcentajeRec) => {
    return baseImponible * (porcentajeRec / 100);
};

// Función para calcular el total de un albarán
const calcularTotal = (
    baseImponible,
    importeIVA,
    importeRec
) => {
    return baseImponible + importeIVA + importeRec;
};

export default function AlbaranForm() {

    const [albaran, setAlbaran] = useState({
        id: 1,
        fecha: new Date(),
        numeroCliente: "",
        dni: "",
        detalles: [],
        totalBruto: 0,
        porcentajeDescuento: 0,
        importeDescuento: 0,
        baseImponible: 0,
        porcentajeIVA: 21,
        importeIVA: 0,
        porcentajeRec: 0,
        importeRec: 0,
        total: 0,
        formaPago: "",
    });

    // Estado para el detalle actual
    const [detalle, setDetalle] = useState({
        id: "",
        unidades: 0,
        precio: 0,
        porcentajeDescuento: 0,
        importe: 0,
        nombreProducto: "",
        descripcionProducto: "",
        referenciaProducto: "",
    });

    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);


    useEffect(() => {
        const getProducts = async () => {
            const results = await albaranService.getAllProductos();
            const productosConEtiquetas = results.map(producto => ({
                label: producto.nombre,
                value: producto
            }));
            setProductos(productosConEtiquetas);
            console.log(productosConEtiquetas);
        };
        getProducts();
        const getClientes = async () => {
            const results = await userService.usersByRol("CLIENTE");
            const clientesConEtiquetas = results.map(cliente => ({
                label: `${cliente.name} ${cliente.lastName}`,
                value: cliente
            }));
            setClientes(clientesConEtiquetas);
            console.log(clientesConEtiquetas);
        }
        getClientes();
    }, []);


    // Manejador del cambio de fecha
    const handleFechaChange = (date) => {
        setAlbaran({ ...albaran, fecha: date });
    };

    // Manejador del cambio de cliente
    const handleClienteChange = (option) => {
        setAlbaran({
            ...albaran,
            numeroCliente: option.value.id,
            dni: option.value.dni,
        });
    };

    // Manejador del cambio de producto
    const handleProductoChange = (option) => {
        setDetalle({
            ...detalle,
            id: uuidv4(),
            precio: option.value.precio,
            nombreProducto: option.value.nombre,
            descripcionProducto: option.value.descripcion,
            referenciaProducto: option.value.referencia,
        });
    };

    // Manejador del cambio de unidades
    const handleUnidadesChange = (e) => {
        const unidades = Number(e.target.value);
        const importe = calcularImporte(
            unidades,
            detalle.precio,
            detalle.porcentajeDescuento
        );
        setDetalle({ ...detalle, unidades, importe });
    };

    // Manejador del cambio de porcentaje de descuento
    const handlePorcentajeDescuentoChange = (e) => {
        const porcentajeDescuento = Number(e.target.value);
        const importe = calcularImporte(
            detalle.unidades,
            detalle.precio,
            porcentajeDescuento
        );
        setDetalle({ ...detalle, porcentajeDescuento, importe });
    };

    // Manejador del botón de añadir detalle
    const handleAddDetalle = () => {
        if (selectedProduct === null) {
            alert("Debes seleccionar un producto");
            return;
        }
        if (detalle.unidades === 0) {
            alert("Las unidades deben ser mayor que 0");
            return;
        }
        const nuevosDetalles = [...albaran.detalles, detalle];
        const totalBruto = calcularTotalBruto(nuevosDetalles);
        const importeDescuento = calcularImporteDescuento(
            totalBruto,
            albaran.porcentajeDescuento
        );
        const baseImponible = calcularBaseImponible(totalBruto, importeDescuento);
        const importeIVA = calcularImporteIVA(baseImponible, albaran.porcentajeIVA);
        const importeRec = calcularImporteRec(baseImponible, albaran.porcentajeRec);
        const total = calcularTotal(baseImponible, importeIVA, importeRec);
        setAlbaran({
            ...albaran,
            detalles: nuevosDetalles,
            totalBruto,
            importeDescuento,
            baseImponible,
            importeIVA,
            importeRec,
            total,
        });
        setDetalle({
            id: "",
            unidades: 0,
            precio: 0,
            porcentajeDescuento: 0,
            importe: 0,
            nombreProducto: "",
            descripcionProducto: "",
            referenciaProducto: "",
        });
        setSelectedProduct(null);
    };

    // Manejador del cambio de porcentaje de descuento del albarán
    const handlePorcentajeDescuentoAlbaranChange = (e) => {
        const porcentajeDescuento = Number(e.target.value);
        const importeDescuento = calcularImporteDescuento(
            albaran.totalBruto,
            porcentajeDescuento
        );
        const baseImponible = calcularBaseImponible(
            albaran.totalBruto,
            importeDescuento
        );
        const importeIVA = calcularImporteIVA(baseImponible, albaran.porcentajeIVA);
        const importeRec = calcularImporteRec(baseImponible, albaran.porcentajeRec);
        const total = calcularTotal(baseImponible, importeIVA, importeRec);
        setAlbaran({
            ...albaran,
            porcentajeDescuento,
            importeDescuento,
            baseImponible,
            importeIVA,
            importeRec,
            total,
        });
    };

    // Manejador del cambio de porcentaje de IVA del albarán
    const handlePorcentajeIVAAlbaranChange = (e) => {
        const porcentajeIVA = Number(e.target.value);
        const importeIVA = calcularImporteIVA(albaran.baseImponible, porcentajeIVA);
        const total = calcularTotal(
            albaran.baseImponible,
            importeIVA,
            albaran.importeRec
        );
        setAlbaran({
            ...albaran,
            porcentajeIVA,
            importeIVA,
            total,
        });
    };

    // Manejador del cambio de porcentaje de recargo del albarán
    const handlePorcentajeRecAlbaranChange = (e) => {
        const porcentajeRec = Number(e.target.value);
        const importeRec = calcularImporteRec(albaran.baseImponible, porcentajeRec);
        const total = calcularTotal(
            albaran.baseImponible,
            albaran.importeIVA,
            importeRec
        );
        setAlbaran({
            ...albaran,
            porcentajeRec,
            importeRec,
            total,
        });
    };

    // Manejador del cambio de forma de pago del albarán
    const handleFormaPagoChange = (e) => {
        setAlbaran({ ...albaran, formaPago: e.target.value });
    };

    // Manejador del botón de guardar albarán
    const handleSaveAlbaran = () => {
        console.log(albaran);
        alert("Albarán guardado con éxito");
    };


    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: 'black',
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: 'black',
        }),
    };

    const CustomSelectInput = (props) => (
        <div>
            <input {...props} />
        </div>
    );

    return (
        <>
            <CustomNavbar />
            {productos.length > 0 && (
                <Container>
                    <h1 className="text-center pb-4"><strong>Formulario de albarán</strong></h1>
                    <Form>
                        <Row>
                            <Col sm="6">
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Fecha
                                    </Form.Label>
                                    <Col sm="10">
                                        <DatePicker
                                            selected={albaran.fecha}
                                            onChange={handleFechaChange}
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Cliente
                                    </Form.Label>
                                    <Col sm="10">
                                        <Select
                                            options={clientes}
                                            value={clientes.find((cliente) => cliente.value === albaran.numeroCliente)}
                                            onChange={handleClienteChange}
                                            components={{ Input: CustomSelectInput }}
                                            filterOption={createFilter({ ignoreAccents: false })}
                                            styles={customStyles}
                                        />
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col sm="6">
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        NIF/CIF
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control
                                            type="text"
                                            value={albaran.dni}
                                            readOnly
                                            className="read-only"
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Vendedor
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control
                                            type="text"
                                            value={albaran.numeroCliente}
                                            readOnly
                                            className="read-only"
                                        />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <h2 className="pt-2 pb-2"><strong>Añadir detalle</strong></h2>
                        <Row>
                            <Col sm="6">
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Producto
                                    </Form.Label>
                                    <Col sm="10">
                                        <Select
                                            options={productos}
                                            value={selectedProduct}
                                            onChange={(option) => {
                                                handleProductoChange(option);
                                                setSelectedProduct(option);
                                            }}
                                            components={{ Input: CustomSelectInput }}
                                            filterOption={createFilter({ ignoreAccents: false })}
                                            styles={customStyles}
                                            id="producto"
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Unidades
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control
                                            type="number"
                                            value={detalle.unidades}
                                            onChange={handleUnidadesChange}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Precio
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control
                                            type="number"
                                            value={detalle.precio}
                                            readOnly
                                            className="read-only"
                                        />
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col sm="6">
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Descuento
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control
                                            type="number"
                                            value={detalle.porcentajeDescuento || ''}
                                            onChange={handlePorcentajeDescuentoChange}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Importe
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control
                                            type="number"
                                            value={detalle.importe}
                                            readOnly
                                            className="read-only"
                                        />
                                    </Col>
                                </Form.Group>

                            </Col>
                        </Row>
                        <Button variant="primary" onClick={handleAddDetalle}>
                            Añadir producto
                        </Button>
                        <h2 className="pt-3 pb-2">
                            <strong>Detalles del albarán</strong>
                        </h2>
                        <div className="table-responsive">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Descripción</th>
                                        <th>Unidades</th>
                                        <th>Precio</th>
                                        <th>Descuento (%)</th>
                                        <th>Importe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {albaran.detalles.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center">
                                                No hay detalles
                                            </td>
                                        </tr>
                                    )}
                                    {albaran.detalles.map((detalle) => (
                                        <tr key={detalle.id}>
                                            <td>{detalle.nombreProducto}</td>
                                            <td>{detalle.descripcionProducto}</td>
                                            <td>{detalle.unidades}</td>
                                            <td>{detalle.precio}</td>
                                            <td>{detalle.porcentajeDescuento}</td>
                                            <td>{detalle.importe}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <h2 className="pt-2 pb-2"><strong>Totales del albarán</strong></h2>
                        <Row>
                            <Col sm="6">
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Total bruto
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control
                                            type="number"
                                            value={albaran.totalBruto}
                                            readOnly
                                            className="read-only"
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Descuento
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control
                                            type="number"
                                            value={albaran.porcentajeDescuento}
                                            onChange={handlePorcentajeDescuentoAlbaranChange}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Importe descuento
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control
                                            type="number"
                                            value={albaran.importeDescuento}
                                            readOnly
                                            className="read-only"
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Base imponible
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control
                                            type="number"
                                            value={albaran.baseImponible}
                                            readOnly
                                            className="read-only"
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        % IVA
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control
                                            type="number"
                                            value={albaran.porcentajeIVA}
                                            onChange={handlePorcentajeIVAAlbaranChange}
                                        />
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col sm="6">
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Importe IVA
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control
                                            type="number"
                                            value={albaran.importeIVA}
                                            readOnly
                                            className="read-only"
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        % Recargo
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control
                                            type="number"
                                            value={albaran.porcentajeRec}
                                            onChange={handlePorcentajeRecAlbaranChange}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Importe recargo
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control
                                            type="number"
                                            value={albaran.importeRec}
                                            readOnly
                                            className="read-only"
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Total
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control
                                            type="number"
                                            value={albaran.total}
                                            readOnly
                                            className="read-only"
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Forma de pago
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control
                                            type="text"
                                            value={albaran.formaPago}
                                            onChange={handleFormaPagoChange}
                                        />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <br />
                        <div className="d-flex justify-content-center align-items-center pb-5">
                            <Button variant="success" onClick={handleSaveAlbaran}>
                                Guardar albarán
                            </Button>
                        </div>
                    </Form>
                </Container>
            )}
        </>
    );
};
