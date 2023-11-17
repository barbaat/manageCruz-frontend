import '../css/NavBar.css'
import { Nav, Navbar } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import userService from '../services/api/users.js';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import ModalWelcome from './ModalWelcomeComponent';


export default function CustomNavbar() {

  const [userLog, setUserLog] = useState([]);
  const [urlPerfil, setUrlPerfil] = useState('');
  const [showModal, setShowModal] = useState(false);

  const location = useLocation();

  const handleLogout = () => {
    window.localStorage.removeItem('tokenLoggedUser');
    window.location.href = '/';
  };

  useEffect(() => {
    const getUserLog = async () => {
      const user = await userService.getUserLogeado();
      if (user) {
        setUserLog(user);
        setUrlPerfil("/users/" + user.username);
      } else {
        window.location.href = '/';
      }
    }
    getUserLog();

  }, []);


  useEffect(() => {
    const token = window.localStorage.getItem('tokenLoggedUser');
    if (!token) {
      window.location.href = '/';
    }
  }, []);

  return (
    <>
      <Navbar className="mb-4" expand="lg">
        <Navbar.Brand href="/">
          <img src={logo} alt="Logo" style={{ width: '60px', height: '60px' }} />
        </Navbar.Brand>
        <Navbar.Brand>
          <Button className='btn btn-primary' onClick={() => setShowModal(true)}> + info </Button>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" className="center-toggle" />
        <Navbar.Collapse id="navbarNav" >
          <Nav className='mx-auto'>
            <Nav.Link href="/" className={location.pathname == '/' ? 'active' : 'not-active'}>Inicio</Nav.Link>
            {userLog.rolUser == 'ADMIN' && (
              <>
                <Nav.Link href="/users" className={location.pathname == '/users' ? 'active' : 'not-active'}>Usuarios</Nav.Link>
                <Nav.Link href="/albaran" className={location.pathname == '/albaran' ? 'active' : 'not-active'}>Albaranes</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            <>
              <button className="btn btn-danger" onClick={handleLogout}>Cerrar sesión</button>
            </>
          </Nav>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Nav>
            <Nav.Link href={urlPerfil} className='not-active'>Ver perfil de <b>{userLog.username}</b></Nav.Link>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <ModalWelcome showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};
