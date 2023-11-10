import { Modal,Row } from 'react-bootstrap';
import { LinkedinSVG, GithubSVG } from '../assets/icons.js';
import logo from '../assets/images/logo.png';

export default function ModalWelcome({ showModal, setShowModal }) {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className='text-center'>Detalles del proyecto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='text-center'>
          <img src={logo} alt='logo' width='180px' className='mb-2 pb-2'/>
          <p>Proyecto realizado por:</p>
          <p><strong> Francisco Javier Barba Trejo  </strong>
            <a href='https://github.com/barbaat'><GithubSVG /></a>
            <a href='https://www.linkedin.com/in/fco-jav-barba/'><LinkedinSVG /></a>
          </p>
          <Row>
            <p className='mt-4 pt-4'>Todos los derechos reservados © 2023</p>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  );
}
