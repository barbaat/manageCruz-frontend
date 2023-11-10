import { useState, useEffect } from 'react';
import userService from '../../services/api/users';
import CustomNavbar from '../../components/NavbarComponent';
import validaciones from '../../services/utils/validaciones';
import { useLocation } from 'react-router-dom';
import { Col, Row, Container } from 'react-bootstrap';
import enumUtils from '../../services/utils/enumUtils';

export default function UserForm() {

  const queryParams = new URLSearchParams(useLocation().search);
  const roleFromURL = queryParams.get('role');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [rolUser, setRolUser] = useState(roleFromURL);
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [telephone, setTelephone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [course, setCourse] = useState('');

  const [ciudades, setCiudades] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);

  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [errores, setErrores] = useState([]);


  const handleCourseChange = (event) => setCourse(event.target.value);

  const handleAvatarChange = (event) => {
    const avatarURL = event.target.value;
    setAvatar(avatarURL);
    setAvatarLoadError(false);
  };

  const handleAvatarError = () => {
    setAvatarLoadError(true);
  };

  const handleChange = (setState) => (event) => setState(event.target.value);

  const newUser = {
    username: username,
    password: password,
    name: name,
    lastName: lastName,
    email: email,
    gender: gender,
    rolUser: rolUser,
    city: city,
    telephone: telephone,
    avatar: avatar,
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();

    const errores = validaciones.checkValidate(newUser, users, course, false, '');
    const camposVacios = Object.values(errores).every(valor => valor === '');

    if (camposVacios.valueOf() == false) {
      setErrores(errores);
    } else {
      try {
        const response = await userService.newUser(newUser);
      } catch (error) {
        console.log(error);
      }
    }
  };


  useEffect(() => {
    const roles = ['COACH', 'STUDENT', 'TUTOR', 'ACCOUNTANT','COORDINATOR'];
    if (roleFromURL == null || roleFromURL == '' || !roles.includes(roleFromURL)) {
      window.location.href = '/notAuthorized';
    }

    const getData = async () => {
      const userLogged = await userService.getUserLogeado();
      if (userLogged.rolUser != 'ADMIN') {
        window.location.href = '/notAuthorized';
      }
      const cities = await userService.cities();
      const citiesSelect = enumUtils.enumObject(cities);
      setCiudades(citiesSelect);

      const genders = await userService.gender();
      const genderSelect = enumUtils.enumObject(genders);
      setGeneros(genderSelect);
    };
    getData();

    const getAllUsers = async () => {
      const allUsers = await userService.allUsers();
      setUsers(allUsers);
    };
    getAllUsers();
  }, []);


  const renderAvatarPreview = () => {
    if (avatar) {
      if (avatarLoadError) {
        return (
          <div className="avatar-preview">
            <p className="error-message">No se puede visualizar la imagen</p>
          </div>
        );
      } else {
        return (
          <div className="avatar-preview">
            <p>Previsualización de avatar:</p>
            <img
              src={avatar}
              alt="Avatar Preview"
              className="preview-image"
              onError={handleAvatarError}
              style={{ height: '100px', width: '100px' }}
            />
          </div>
        );
      }
    } else {
      return null;
    }
  };


  return (
    <>
      <CustomNavbar />
      <Container fluid>
        <div className="row justify-content-center">
          <div className="col-sm-6 col-md-4">
            <h1 className="text-center pt-4 pb-4 mb-4">Registro de <b>{rolUser}</b></h1>
            <form onSubmit={handleCreateUser}>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <h6 htmlFor="username" className='text-center'>Nombre de usuario</h6>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      id="username"
                      name="Username"
                      placeholder="Username"
                      onChange={handleChange(setUsername)}
                    />
                    {errores.username && (
                      <p className="text-danger">{errores.username}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <h6 htmlFor="password" className='text-center'>Contraseña</h6>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      id="password"
                      name="Password"
                      placeholder="Password"
                      onChange={handleChange(setPassword)}
                    />
                    {errores.password && (
                      <p className="text-danger">{errores.password}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <h6 htmlFor="name" className='text-center'>Nombre</h6>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      id="name"
                      name="name"
                      placeholder="Name"
                      onChange={handleChange(setName)}
                    />
                    {errores.name && (
                      <p className="text-danger">{errores.name}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <h6 htmlFor="lastName" className='text-center'>Apellidos</h6>
                    <input
                      type="text"
                      className="form-control"
                      value={lastName}
                      id="lastName"
                      name="lastName"
                      placeholder="Last Name"
                      onChange={handleChange(setLastName)}
                    />
                    {errores.lastName && (
                      <p className="text-danger">{errores.lastName}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <h6 htmlFor="email" className='text-center'>Email</h6>
                    <input
                      type="text"
                      className="form-control"
                      value={email}
                      id="email"
                      name="email"
                      placeholder="Email"
                      onChange={handleChange(setEmail)}
                    />
                  </div>
                  {errores.email && (
                    <p className="text-danger">{errores.email}</p>
                  )}
                </Col>
                <Col md={{ span: 5, offset: 1 }}>
                  <div className="mb-3">
                    <h6 htmlFor="gender" className='text-center'>Género</h6>
                    <select
                      className="form-control"
                      value={gender}
                      id="gender"
                      name="gender"
                      placeholder="Género"
                      onChange={handleChange(setGender)}
                    >
                      <option value="">Selecciona un género</option>
                      {generos.map((genero) => (
                        <option key={genero.id} value={genero.value}>
                          {genero.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errores.gender && (
                    <p className="text-danger">{errores.gender}</p>
                  )}
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      value={rolUser}
                      id="rolUser"
                      name="rolUser"
                      placeholder="Rol"
                      onChange={handleChange(setRolUser)}
                      disabled
                      hidden
                    />
                    {errores.rolUser && (
                      <p className="text-danger">{errores.rolUser}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <h6 htmlFor="city" className='text-center'>Ciudad</h6>
                    <select
                      className="form-control"
                      value={city}
                      id="city"
                      name="city"
                      placeholder="Ciudad"
                      onChange={handleChange(setCity)}
                    >
                      <option value="">Selecciona una ciudad</option>
                      {ciudades.map((ciudad) => (
                        <option key={ciudad.id} value={ciudad.value}>
                          {ciudad.label}
                        </option>
                      ))}
                    </select>
                    {errores.city && (
                      <p className="text-danger">{errores.city}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <h6 htmlFor="telephone" className='text-center'>Teléfono</h6>
                    <input
                      type="text"
                      className="form-control"
                      value={telephone}
                      id="telephone"
                      name="telephone"
                      placeholder="Teléfono"
                      onChange={handleChange(setTelephone)}
                    />
                    {errores.telephone && (
                      <p className="text-danger">{errores.telephone}</p>
                    )}
                  </div>

                  {/*INPUT DE STUDENT */}
                  {rolUser == 'STUDENT' && (
                    <div className="mb-3">
                      <h6 htmlFor="course" className='text-center'>Curso</h6>
                      <select
                        className="form-control"
                        value={course}
                        id="course"
                        name="course"
                        placeholder="Curso del alumno"
                        onChange={handleCourseChange}
                      >
                        <option value="">Selecciona un curso</option>
                        {courses.map((curso) => (
                          <option key={curso.id} value={curso.value}>
                            {curso.label}
                          </option>
                        ))}
                      </select>
                      {errores.course && (
                        <p className="text-danger">{errores.course}</p>
                      )}
                    </div>
                  )}

                  <div className="mb-3">
                    <h6 htmlFor="avatar" className='text-center'>Avatar</h6>
                    <input
                      type="text"
                      className="form-control"
                      value={avatar}
                      name="avatar"
                      placeholder="Avatar"
                      onChange={handleAvatarChange}
                    />
                    {errores.avatar && (
                      <p className="text-danger">{errores.avatar}</p>
                    )}
                  </div>
                  {renderAvatarPreview()}
                </Col>
              </Row>
              <div className="text-center mx-auto d-block align-center">
                <button type="submit" className="btn btn-primary mt-4 text-center mb-5" style={{ background: "purple", color: "white" }}>
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </>
  );
}

