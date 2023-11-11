import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import SignatureCanvas from 'react-signature-canvas';
import albaranService from '../../services/api/albaran.js';
import CustomNavbar from '../../components/NavbarComponent.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function AlbaranSign() {
    const signatureRef = useRef(null);
    const { id } = useParams();
    const [albaran, setAlbaran] = useState(null);

    useEffect(() => {
        const getAlbaran = async () => {
            try {
                const albaran = await albaranService.getAlbaran(id);
                console.log(albaran);
                setAlbaran(albaran);
            } catch (error) {
                console.error('Error al obtener el albarán', error);
            }
        };
        getAlbaran();
    }, [id]);

    const handleClear = () => {
        signatureRef.current.clear();
    };

    const handleSave = () => {
        const signature = signatureRef.current.toDataURL();
        const signature64 = signature.split(',')[1];
        albaran.firma = signature64;
        albaranService.updateAlb(id,albaran);
        window.location.href = `/albaran/${id}`;
    };

    return (
        <>
            <CustomNavbar />
            <div className="d-flex justify-content-center align-items-center pb-5">
            {albaran ? (
                <Row className="justify-content-center">
                    <Col>
                        <h1 className="mb-4"><strong>Albarán {id}</strong></h1>
                        <SignatureCanvas
                            ref={signatureRef}
                            penColor="black"
                            backgroundColor='white'
                            canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }}
                        />
                        <div className="d-flex justify-content-center align-items-center pt-5 pb-5">
                            <Button variant="secondary" onClick={handleClear} className="mr-2">
                                Borrar firma
                            </Button>
                            <Button variant="primary" onClick={handleSave}>
                                Guardar firma
                            </Button>
                        </div>
                    </Col>
                </Row>
            ) : (
                <Row className="justify-content-center">
                    <Col>
                        <h1>Cargando...</h1>
                    </Col>
                </Row>
            )}
        </div >
        </>
    );


}
