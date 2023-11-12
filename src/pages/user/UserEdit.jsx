import "../../css/Loader.css"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userService from "../../services/api/users.js";
import CustomNavbar from '../../components/NavbarComponent';
import validaciones from "../../services/utils/validaciones.js";
import { Col, Row, Container } from "react-bootstrap";
import enumUtils from "../../services/utils/enumUtils.js";
import LoaderComponent from "../../components/LoaderComponent";

export default function UserEdit() {

    const { username } = useParams();

    const [userEdit, setUserEdit] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [errores, setErrores] = useState({});
    const [lastUsername, setLastUsername] = useState("");

    const [ciudades, setCiudades] = useState([]);
    const [generos, setGeneros] = useState([]);

    const [student, setStudent] = useState({});

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const userLogged = await userService.getUserLogeado();
            const users = await userService.allUsers();
            const userExists = users.some((user) => user.username == username);
            const auth = (userLogged.rolUser != 'ADMIN' && userLogged.username == username) || userLogged.rolUser == 'ADMIN';
            if (!auth) {
                window.location.href = '/notAuthorized';
            }
            if (userExists) {
                setLoading(true)
                try {
                    const user = await userService.getUser(username);
                    user.avatar = user.avatar != "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Images.png" ? user.avatar : "";
                    setUserEdit(user);
                    setLastUsername(user.username);
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            } else {
                setUserEdit(null);
                window.location.href = '/error';
            }
        };
        getUser();

        const getAllUsers = async () => {
            const users = await userService.allUsers();
            setAllUsers(users);
        };
        getAllUsers();


        const getData = async () => {
            const cities = await userService.cities();
            const citiesSelect = enumUtils.enumObject(cities);
            setCiudades(citiesSelect);

            const genders = await userService.gender();
            const genderSelect = enumUtils.enumObject(genders);
            setGeneros(genderSelect);
        };
        getData();

    }, [username]);


    const handleChange = (event) => {
        setUserEdit({ ...userEdit, [event.target.name]: event.target.value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const errores = validaciones.checkValidate(userEdit, allUsers, student.course, true, lastUsername);
        setErrores(errores);
        if (Object.keys(errores).length === 0) {
            userService.updateUser(userEdit.id, userEdit);
            if (userEdit.username != lastUsername) {
                window.location.href = '/';
            } else {
                window.location.href = '/users/' + userEdit.username;
            }
        } else {
            console.log(errores);
        }
    }
    return (
        <>
            <CustomNavbar />

            {!loading ? (
                <Container fluid>
                    <div className="row justify-content-center">
                        <div className="col-sm-6 col-md-4">
                            {userEdit != null && (
                                <>
                                    <h1 className="text-center pt-4 pb-4">Editar usuario</h1>
                                    <form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <h6 htmlFor="name" className="text-center">Nombre</h6>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="name"
                                                        name="name"
                                                        value={userEdit.name}
                                                        onChange={handleChange}
                                                    />
                                                    {errores.name && (
                                                        <p className="text-danger">{errores.name}</p>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <h6 htmlFor="surname" className="text-center">Apellidos</h6>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="lastName"
                                                        name="lastName"
                                                        value={userEdit.lastName}
                                                        onChange={handleChange}
                                                    />
                                                    {errores.lastName && (
                                                        <p className="text-danger">{errores.lastName}</p>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <h6 htmlFor="email" className="text-center">Email</h6>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="email"
                                                        name="email"
                                                        value={userEdit.email}
                                                        onChange={handleChange}
                                                    />
                                                    {errores.email && (
                                                        <p className="text-danger">{errores.email}</p>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <h6 htmlFor="username" className="text-center">Nombre de usuario</h6>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="username"
                                                        name="username"
                                                        value={userEdit.username}
                                                        onChange={handleChange}
                                                    />
                                                    {errores.username && (
                                                        <p className="text-danger">{errores.username}</p>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <h6 htmlFor="password" className="text-center">Contraseña</h6>
                                                    <div className="input-group">
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            className="form-control"
                                                            id="password"
                                                            name="password"
                                                            value={userEdit.password}
                                                            onChange={handleChange}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn"
                                                            style={{ border: "none", fontSize: "1.2rem" }}
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? "🕶️" : "👁️"}
                                                        </button>
                                                    </div>
                                                    {errores.password && (
                                                        <p className="text-danger">{errores.password}</p>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col md={{ span: 5, offset: 1 }}>
                                                <div className="mb-3">
                                                    <h6 htmlFor="dni" className="text-center">DNI</h6>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="dni"
                                                        name="dni"
                                                        value={userEdit.dni}
                                                        onChange={handleChange}
                                                    />
                                                    {errores.telephone && (
                                                        <p className="text-danger">{errores.telephone}</p>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <h6 htmlFor="gender" className="text-center">Género</h6>
                                                    <select
                                                        type="text"
                                                        className="form-control"
                                                        id="gender"
                                                        name="gender"
                                                        value={userEdit.gender}
                                                        onChange={handleChange}
                                                    >
                                                        {generos.map((genero) => (
                                                            <option key={genero.id} value={genero.value}>
                                                                {genero.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errores.gender && (
                                                        <p className="text-danger">{errores.gender}</p>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <h6 htmlFor="city" className="text-center">Ciudad</h6>
                                                    <select
                                                        type="text"
                                                        className="form-control"
                                                        id="city"
                                                        name="city"
                                                        value={userEdit.city}
                                                        onChange={handleChange}
                                                    >
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
                                                    <h6 htmlFor="telephone" className="text-center">Teléfono</h6>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="telephone"
                                                        name="telephone"
                                                        value={userEdit.telephone}
                                                        onChange={handleChange}
                                                    />
                                                    {errores.telephone && (
                                                        <p className="text-danger">{errores.telephone}</p>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <h6 htmlFor="avatar" className="text-center">Avatar</h6>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="avatar"
                                                        name="avatar"
                                                        value={userEdit.avatar}
                                                        onChange={handleChange}
                                                    />
                                                    {errores.avatar && (
                                                        <p className="text-danger">{errores.avatar}</p>
                                                    )}
                                                    <div className="mt-3">
                                                        <h6 className="text-center">Previsualización del Avatar:</h6>
                                                        {userEdit.avatar ? (
                                                            <img
                                                                className="text-center align-center d-block mx-auto"
                                                                src={userEdit.avatar}
                                                                alt="No se encuentra la imagen"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = "";
                                                                }}
                                                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                                                            />
                                                        ) : (
                                                            <p className="text-center">Si deja el campo vacío, se asignará la imagen por defecto</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="text-center mx-auto d-block align-center">
                                            <button type="submit" className="btn btn-primary mt-4 text-center mb-5" style={{ background: " rgb(159, 149, 61)", color: "white" }}>
                                                Guardar
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </Container>
            ) : (
                <>
                    <LoaderComponent />
                    <div className="loader">

                    </div>
                </>
            )}

        </>
    );
}
