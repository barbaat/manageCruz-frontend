import { Row, Col } from 'react-bootstrap';
import { useListAnimation } from '../../services/utils/animationsList.js';
import { useEffect, useState } from 'react';
import albaranService from '../../services/api/albaran.js';
import AlbaranCard from '../../components/AlbaranCard.jsx';
import CustomNavbar from '../../components/NavbarComponent.jsx';

export default function AlbaranList() {

    const [albaranes, setAlbaranes] = useState([]);
    const [parent,] = useListAnimation();

    useEffect(() => {
        const getAlbaranes = async () => {
            const result = await albaranService.getAllAlbaran();
            setAlbaranes(result);
            console.log(result);
        }
        getAlbaranes();
    }, []);

    return (
        <>
            <CustomNavbar />
            <div className='text-center container'>
                <h1 className='pb-4 mt-5'><b>Lista de albaranes</b></h1>
                {albaranes.length === 0 && <p>No hay albaranes</p>}
                <Row ref={parent}>
                    {albaranes.map((albaran) => (
                        <Col key={albaran.id} xs={12} md={4}>
                            <AlbaranCard object={albaran} />
                        </Col>
                    ))}
                </Row>
            </div>

        </>
    );
}
