import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import { useListAnimation } from '../../services/utils/animationsList.js';
import albaranService from '../../services/api/albaran.js';
import AlbaranCard from '../../components/AlbaranCard.jsx';
import CustomNavbar from '../../components/NavbarComponent.jsx';
import userService from '../../services/api/users.js';

export default function AlbaranList() {
    const [albaranes, setAlbaranes] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [albaranesShow, setAlbaranesShow] = useState([]);
    const [parent,] = useListAnimation();

    useEffect(() => {
        const fetchData = async () => {
            const albaranesResult = await albaranService.getAllAlbaran();
            const clientesResult = await userService.usersByRol("CLIENTE");
            console.log(clientesResult);
            setAlbaranes(albaranesResult);
            setAlbaranesShow(albaranesResult);
            setClientes(clientesResult);
        };

        fetchData();
    }, []);

    const handleClienteChange = (selectedOption) => {
        if (selectedOption.value == null) {
            setAlbaranesShow(albaranes);
            setSelectedCliente({ value: null, label: 'Todos los clientes' });
            return;
        }
        setSelectedCliente(selectedOption);
        const clienteId = selectedOption.value;
        const filteredAlbaranes = albaranes.filter(albaran => albaran.cliente.id == clienteId);
        setAlbaranesShow(filteredAlbaranes);
    };

    const options = clientes.map(cliente => ({ value: cliente.id, label: `${cliente.name} ${cliente.lastName}` }));

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

    return (
        <>
            <CustomNavbar />
            <div className='text-center container'>
                <h1 className='pb-4 mt-5'><b>Lista de albaranes</b></h1>
                <Form.Group className='pb-4 text-center justify-content-center align-center-items' controlId="formCliente">
                    <Form.Label>Filtra por cliente:</Form.Label>
                    <Select
                        options={[{ value: null, label: 'Todos los clientes' }, ...options]}
                        onChange={handleClienteChange}
                        value={selectedCliente}
                        className="col-6 mx-auto"
                        styles={customStyles}
                    />
                </Form.Group>

                <Button className='btn btn-primary' style={{background:"#f8c76495"}} href={`/albaran/new`}>Crear albarán</Button>
                <br />
                <br />
                {albaranesShow.length === 0 && <p>No hay albaranes</p>}
                <Row ref={parent}>
                    {albaranesShow.map((albaran) => (
                        <Col key={albaran.id} xs={12} md={4}>
                            <AlbaranCard object={albaran} />
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    );
}
