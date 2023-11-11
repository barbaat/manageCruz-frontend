import React, { useState } from "react";
import { Form, Button, Table, Col, Row, Container } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";
import CustomNavbar from '../../components/NavbarComponent.jsx';
import { dark } from "@mui/material/styles/createPalette";

// Datos de prueba para los clientes y los productos
const clientes = [
    { value: "37", label: "B91114306 - Electrodomésticos S.A." },
    { value: "42", label: "B12345678 - Muebles y Decoración S.L." },
    { value: "51", label: "B98765432 - Informática y Comunicaciones S.A." },
];

const productos = [
    {
        value: "42800056",
        label: "Termostato digital ELIWELL EW961 (GREEN)",
        precio: 23.4,
        descripcion: "Termostato para uso industrial",
    },
    {
        value: "42800051",
        label: "Termostato DINFER IC200 ATX ( GREEN)",
        precio: 11.49,
        descripcion: "Termostato DINFER para aplicaciones industriales",
    },
    {
        value: "42800101",
        label: "Ventilador 10W",
        precio: 7.46,
        descripcion: "Ventilador de 10W para sistemas de refrigeración",
    },
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

// Componente para el formulario de albarán
const AlbaranForm = () => {
    // Estado para el albarán
    const [albaran, setAlbaran] = useState({
        id: 1,
        fecha: new Date(),
        numeroCliente: "",
        nifCif: "",
        vendedor: "",
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

    // Manejador del cambio de fecha
    const handleFechaChange = (date) => {
        setAlbaran({ ...albaran, fecha: date });
    };

    // Manejador del cambio de cliente
    const handleClienteChange = (option) => {
        setAlbaran({ ...albaran, numeroCliente: option.value, nifCif: option.label.split(" - ")[0] });
    };

    // Manejador del cambio de vendedor
    const handleVendedorChange = (e) => {
        setAlbaran({ ...albaran, vendedor: e.target.value });
    };

    // Manejador del cambio de producto
    const handleProductoChange = (option) => {
        setDetalle({
            ...detalle,
            id: uuidv4(),
            precio: option.precio,
            nombreProducto: option.label,
            descripcionProducto: option.descripcion,
            referenciaProducto: option.value,
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
        // Aquí se podría enviar el albarán al servidor o a una base de datos
        console.log(albaran);
        alert("Albarán guardado con éxito");
    };


    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: 'black', // Cambia el color del texto a negro
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: 'black', // Cambia el color del texto a negro
        }),
    };

    return (
        <>
            <CustomNavbar />
            <Container>
                <h1 className="text-center">Formulario de albarán</h1>
                <Form>
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
                                styles={customStyles}
                                theme={(theme) => ({
                                    ...theme,
                                    borderRadius: 0,
                                    colors: {
                                        ...theme.colors,
                                        primary25: 'dark',
                                        color: 'dark',
                                    },
                                })}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                            NIF/CIF
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                type="text"
                                value={albaran.nifCif}
                                readOnly
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
                                value={albaran.vendedor}
                                onChange={handleVendedorChange}
                            />
                        </Col>
                    </Form.Group>
                    <h2>Añadir detalle</h2>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                            Producto
                        </Form.Label>
                        <Col sm="10">
                            <Select
                                options={productos}
                                value={productos.find(
                                    (producto) =>
                                        producto.value === detalle.referenciaProducto
                                )}
                                onChange={handleProductoChange}
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
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                            % Descuento
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                type="number"
                                value={detalle.porcentajeDescuento}
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
                            />
                        </Col>
                    </Form.Group>
                    <Button variant="primary" onClick={handleAddDetalle}>
                        Añadir detalle
                    </Button>
                    <h2>Detalles del albarán</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Descripción</th>
                                <th>Unidades</th>
                                <th>Precio</th>
                                <th>% Descuento</th>
                                <th>Importe</th>
                            </tr>
                        </thead>
                        <tbody>
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
                    <h2>Totales del albarán</h2>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                            Total bruto
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                type="number"
                                value={albaran.totalBruto}
                                readOnly
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                            % Descuento
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
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                            Importe IVA
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                type="number"
                                value={albaran.importeIVA}
                                readOnly
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
                    <Button variant="success" onClick={handleSaveAlbaran}>
                        Guardar albarán
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default AlbaranForm;
