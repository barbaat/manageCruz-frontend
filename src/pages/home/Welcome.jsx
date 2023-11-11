import '../../css/Style.css';
import '../../css/Loader.css';
import { useState, useEffect } from 'react';
import loginService from '../../services/api/login';
import LoginForm from '../../components/LoginFormComponent';
import CustomNavbar from '../../components/NavbarComponent';
import userService from '../../services/api/users';
import { Button, Row, Col, Container } from 'react-bootstrap';
import { useListAnimation } from '../../services/utils/animationsList.js';
import ModalWelcome from '../../components/ModalWelcomeComponent';


export default function Welcome() {
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [, setToken] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [parent,] = useListAnimation();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('tokenLoggedUser');
    if (loggedUserJSON) {
      setToken(loggedUserJSON);
      const getUserByTokenFunc = async () => {
        const userRes = await userService.getUserLogeado();
        setUser(userRes);
      };
      getUserByTokenFunc();
    } else {
      setToken(null);
      setUser(null);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const token = await loginService.token({ username, password, });
      const userLog = await loginService.login({ username, password, });
      console.log(userLog);
      console.log(token);
      if (userLog) {
        window.localStorage.setItem('tokenLoggedUser', token);
        setToken(token);
        setUser(userLog);
        window.location.reload();
      } else if (userLog == undefined) {
        setErrorMessage('Credenciales inválidas');
        console.log(errorMessage.length);
        setTimeout(() => {
          setErrorMessage('');
        }, 4000);
      }
    } catch (e) {
      setErrorMessage('Credenciales inválidas');
      setTimeout(() => {
        setErrorMessage('');
      }, 4000);
    }
  };

  return (
    <>
      {user ? (
        <>
          <CustomNavbar />
          <Container fluid>
            <div className='text-center pt-4 mt-4'>
              <Button href='/albaran' className="mb-5" style={{ background: "rgb(159, 149, 61)", color: "black" }}>Lista de albaranes</Button>
              <br />
              <Button href='/albaran/new' className="mb-5" style={{ background: "rgb(159, 149, 61)", color: "black" }}>Crear albarán</Button>
            </div>
            <div className='text-center pt-4 mt-4'>
              <br />
              <Button className="mb-5" style={{ background: "rgb(159, 149, 61)", color: "black" }} onClick={() => setShowModal(true)}> Ver información acerca del proyecto </Button>
            </div>
          </Container >
        </>
      ) : (
        <>
          <div className="container">
            <div className="text-center justify-content-center">
              <LoginForm
                username={username}
                password={password}
                handleUsernameChange={({ target }) => setUsername(target.value)}
                handlePasswordChange={({ target }) => setPassword(target.value)}
                handleSubmit={handleLogin}
              />
            </div>
            {errorMessage.length >= 1 && <p className='alert alert-warning mt-5'>{errorMessage}, prueba otra vez</p>}
          </div>
        </>
      )
      }

      <ModalWelcome showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};