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
        try {
          const userRes = await userService.getUserLogeado();
          setUser(userRes);
        } catch (error) {
          console.error('Error fetching user by token:', error);
        }
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
      const token = await loginService.token({ username, password });
      const userLog = await loginService.login({ username, password });

      if (userLog) {
        window.localStorage.setItem('tokenLoggedUser', token);
        setToken(token);
        setUser(userLog);
        window.location.reload();
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error during login:', error);
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
              <Button href='/albaran' className="mb-5 btn btn-primary">Lista de albaranes</Button>
              <br />
              <Button href='/albaran/new' className="mb-5 btn btn-primary">Crear albarán</Button>
            </div>
          </Container >
        </>
      ) : (
        <div className="container">
          <div className="text-center justify-content-center">
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
              errorMessage={errorMessage}
            />
          </div>
        </div>
      )
      }
    </>
  );
};