import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

export function useModal(initialState = false) {
    const [show, setShow] = useState(initialState);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    return [show, handleShow, handleClose];
}

export function ChangeModal({ show, handleClose, handleConfirm, data, selected, handleChange, label }) {
    const handleConfirmClick = () => {
        if (!selected) {
            alert(`Por favor, selecciona un ${label.toLowerCase()} válido.`);
            return;
        }
        handleConfirm();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Seleccionar {label}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <label style={{ marginBottom: '10px' }}>{`Seleccionar ${label.toLowerCase()}: `}</label>
                    <br />
                    <select
                        value={selected}
                        onChange={handleChange}
                        style={{
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            fontSize: '16px',
                            outline: 'none',
                            width: '100%',
                            maxWidth: '300px',
                        }}
                    >
                        <option value="">Seleccionar</option>
                        {data.map(item => (
                            <option key={item.id} value={item.username}>
                                {item.name} {item.lastName}
                            </option>
                        ))}
                    </select>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" style={{ background: "purple", color: "white" }} onClick={handleConfirmClick}>
                    Confirmar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}