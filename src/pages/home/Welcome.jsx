import '../../css/Style.css';
import '../../css/Loader.css';
import { useState, useEffect } from 'react';
import loginService from '../../services/api/login';
import LoginForm from '../../components/LoginFormComponent';
import CustomNavbar from '../../components/NavbarComponent';
import userService from '../../services/api/users';
import { Button, Row, Col, Container } from 'react-bootstrap';


export default function Welcome() {
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [, setToken] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('tokenLoggedUser');
    if (loggedUserJSON) {
      setToken(loggedUserJSON);
      const getUserByTokenFunc = async () => {
        const userRes = await userService.getUserLogeado();
        console.log(userRes);
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
            <Row className='justify-content-center'>
              <Col className='text-center'>
                <br />
                <h1 className='text-center'>Bienvenido {user.name} {user.lastName}</h1>
                <br />
                <h2 className='text-center'>Tu rol es: {user.rolUser}</h2>
                <br />
                <h3 className='text-center'>¿Qué quieres hacer?</h3>
              </Col>
            </Row>
          </Container>
          <Container fluid>
            <div className='text-center pt-4 mt-4'>
              <Button href='/albaran' className="mb-5" style={{ background: "rgb(159, 149, 61)", color: "black" }}>Lista de albaranes</Button>
              <br />
              <Button href='/albaran/new' className="mb-5" style={{ background: "rgb(159, 149, 61)", color: "black" }}>Crear albarán</Button>
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
    </>
  );
};