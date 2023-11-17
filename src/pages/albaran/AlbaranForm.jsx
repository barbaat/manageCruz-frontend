import React, { useEffect, useState } from "react";
import { Form, Button, Table, Col, Row, Container } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import CustomNavbar from '../../components/NavbarComponent.jsx';
import { createFilter } from 'react-select';
import "../../css/AlbaranForm.css"
import albaranService from "../../services/api/albaran.js";
import userService from "../../services/api/users.js";

export default function AlbaranForm() {
    const idAleatorio = Math.floor(Math.random() * 1000) + 1;
    const [showTipoInstalacion, setShowTipoInstalacion] = useState(false);
    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [instalaciones, setInstalaciones] = useState([]);


    const [albaran, setAlbaran] = useState({
        id: idAleatorio,
        fecha: new Date(),
        numeroCliente: "",
        dni: "",
        detalles: [],
        total: 0,
        formaPago: "",
        tipoInstalacion: "",
    });

    // Estado para el detalle actual
    const [detalle, setDetalle] = useState({
        id: idAleatorio,
        unidades: 0,
        importe: 0,
        nombreProducto: "",
        descripcionProducto: "",
        referenciaProducto: "",
    });


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

    useEffect(() => {
        const instalaciones = albaran.detalles.filter(detalle => detalle.nombreProducto.includes("Instalaciones"));
        setInstalaciones(instalaciones);
        if (instalaciones.length > 0) {
            setShowTipoInstalacion(true);
        } else {
            setShowTipoInstalacion(false);
        }
    }, [albaran.detalles]);


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
        // const idAleatorio = Math.floor(Math.random() * 1000) + 1;
        setDetalle({
            ...detalle,
            precio: option.value.precio,
            nombreProducto: option.value.nombre,
            descripcionProducto: option.value.descripcion,
            referenciaProducto: option.value.referencia,
        });
    };

    // Función para calcular el importe de un detalle
    const calcularImporte = (precio, unidades) => {
        const importe = precio * unidades;
        return importe;
    };

    // Manejador del cambio de unidades
    const handleUnidadesChange = (e) => {
        const unidades = Number(e.target.value);
        const importe = calcularImporte(detalle.precio, unidades);
        setDetalle({ ...detalle, unidades, importe });
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
        const total = nuevosDetalles.reduce((acc, detalle) => acc + detalle.importe, 0);
        setAlbaran({
            ...albaran,
            detalles: nuevosDetalles,
            total,
        });
        setDetalle({
            unidades: 0,
            precio: 0,
            porcentajeDescuento: 0,
            importe: 0,
            nombreProducto: "",
        });
        setSelectedProduct(null);
    };

    // Manejador del cambio de forma de pago del albarán
    const handleFormaPagoChange = (selectedOption) => {
        setAlbaran({ ...albaran, formaPago: selectedOption.value });
    };

    // Manejador del cambio de forma de pago del albarán
    const handleTipoInstalacionChange = (selectedOption) => {
        setAlbaran({ ...albaran, tipoInstalacion: selectedOption.value });
    };


    // Función para buscar un producto por su nombre
    const findProductByName = (nombre) => {
        const res = productos.find(producto => producto.value.nombre === nombre).value;
        return res;
    }

    const handleSaveAlbaran = async () => {
        if (albaran.numeroCliente == "") {
            alert("Debes seleccionar un cliente");
            return;
        }
        if (albaran.detalles.length === 0) {
            alert("Debes añadir al menos un detalle");
            return;
        }
        if (albaran.formaPago === "") {
            alert("Debes seleccionar una forma de pago");
            return;
        }
        if (instalaciones.length > 0 && albaran.tipoInstalacion === "") {
            alert("Debes seleccionar un tipo de instalación");
            return;
        }
        const detallesToSave = albaran.detalles.map(detalle => ({
            ...detalle,
            producto: findProductByName(detalle.nombreProducto),
            id_producto: findProductByName(detalle.nombreProducto).id,
        }));
        const clienteToSave = clientes.find(cliente => cliente.value.id == albaran.numeroCliente).value;
        const albaranToSave = {
            ...albaran,
            detalles: detallesToSave,
            cliente: clienteToSave
        };
        const albaranToSaveWithoutDetalles = { ...albaranToSave };
        delete albaranToSaveWithoutDetalles.detalles;
        const albaran_guardado = await albaranService.newAlbaran(albaranToSaveWithoutDetalles);
        for (const detalle of albaranToSave.detalles) {
            detalle.albaran = albaran_guardado;
            await albaranService.newDetalleAlbaran(detalle);
        }
        window.location.href = `/albaran/${albaran_guardado.id}`;
    };


    const customStyles = {
        option: (provided,) => ({
            ...provided,
            color: 'black',
        }),
        singleValue: (provided,) => ({
            ...provided,
            color: 'black',
        }),
    };

    const CustomSelectInput = (props) => (
        <div>
            <input {...props} />
        </div>
    );

    const handleRemoveDetalle = (detalleId) => {
        const nuevosDetalles = albaran.detalles.filter((detalle) => detalle.id !== detalleId);
        const total = nuevosDetalles.reduce((acc, detalle) => acc + detalle.importe, 0);

        setAlbaran({
            ...albaran,
            detalles: nuevosDetalles,
            total,
        });
    };

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
                                            placeholder="Selecciona un cliente"
                                        />
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col sm="6">
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        DNI
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
                                            placeholder="Selecciona unn producto"
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
                        <h2 className="pt-2 pb-2"><strong>Detalles del albarán</strong></h2>
                        <div className="table-responsive">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Unidades</th>
                                        <th>Precio</th>
                                        <th>Importe</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {albaran.detalles.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="text-center">
                                                No hay detalles
                                            </td>
                                        </tr>
                                    )}
                                    {albaran.detalles.map((detalle) => (
                                        <tr key={detalle.id}>
                                            <td>{detalle.nombreProducto}</td>
                                            <td>{detalle.unidades}</td>
                                            <td>{detalle.precio}</td>
                                            <td>{detalle.importe}</td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleRemoveDetalle(detalle.id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <br />
                        <div>
                            {showTipoInstalacion && (
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Tipo de instalación
                                    </Form.Label>
                                    <Col sm="10">
                                        <Select
                                            options={[
                                                { value: 'MODELO', label: 'MODELO' },
                                                { value: 'GLACIAL', label: 'GLACIAL' },
                                                { value: 'V-200', label: 'V-200' },
                                                { value: 'V-100', label: 'V-100' },
                                                { value: 'COBRA', label: 'COBRA' },
                                                { value: 'V-200 DOBLE', label: 'V-200 DOBLE' },
                                                { value: 'COBRA DOBLE', label: 'COBRA DOBLE' },
                                                { value: 'V-200 Acero', label: 'V-200 Acero' },
                                                { value: 'V-175 GLACIAL', label: 'V-175 GLACIAL' },
                                                { value: 'GLACIAL COBRA', label: 'GLACIAL COBRA' },
                                                { value: 'V-100 CARTUJA', label: 'V-100 CARTUJA' },
                                                { value: 'COBRA V-100', label: 'COBRA V-100' },
                                            ]}
                                            value={{ value: albaran.tipoInstalacion, label: albaran.tipoInstalacion }}
                                            onChange={handleTipoInstalacionChange}
                                            styles={customStyles}
                                            placeholder="Selecciona un modelo"
                                        />
                                    </Col>
                                </Form.Group>
                            )}
                        </div>
                        <h2 className="pt-2 pb-2"><strong>Totales del albarán</strong></h2>
                        <Row>
                            <Col sm="6">
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
                                        <Select
                                            options={[
                                                { value: 'Contado', label: 'Contado' },
                                                { value: 'Crédito', label: 'Crédito' },
                                            ]}
                                            value={{ value: albaran.formaPago, label: albaran.formaPago }}
                                            onChange={handleFormaPagoChange}
                                            styles={customStyles}
                                            placeholder="Selecciona una forma de pago"
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
