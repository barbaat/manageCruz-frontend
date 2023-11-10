import { BsFillArrowUpCircleFill, BsFillArrowDownCircleFill } from "react-icons/bs";
import CardProfile from './CardProfileComponent.jsx';
import { Row, Col } from 'react-bootstrap';
import { useListAnimation } from '../services/utils/animationsList.js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import userService from '../services/api/users.js';


export default function UsersListComponent({ users, title, role = '', addRol = false }) {

    const [sortOrder, setSortOrder] = useState('asc');
    const [search, setSearch] = useState('');
    const [userLog, setUserLog] = useState();
    const [parent,] = useListAnimation();

    const handleSort = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const sortUsers = (usersAOrdenar) => {
        return [...usersAOrdenar].sort((a, b) => {
            const nameA = a.username.toLowerCase();
            const nameB = b.username.toLowerCase();
            return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
    };

    const filteredUsers = users.filter((user) => {
        const searchTerm = search.toLowerCase();
        return (
            user.username.toLowerCase().includes(searchTerm) ||
            user.name.toLowerCase().includes(searchTerm) ||
            user.lastName.toLowerCase().includes(searchTerm)
        );
    });

    const handleChange = (setState) => (event) => setState(event.target.value);

    useEffect(() => {
        const getUserLog = async () => {
            const userLog = await userService.getUserLogeado();
            setUserLog(userLog);
        }
        getUserLog();
    }, []);


    return (
        <>
            <h1 className='pb-4 mt-5'><b>Lista de {title}</b></h1>
            <Row>
                <Col md="3">
                    <button className="btn btn-link" onClick={handleSort}>
                        <p className='btn btn-primary'>
                            Ordenar {sortOrder === 'asc' ? <BsFillArrowUpCircleFill /> : <BsFillArrowDownCircleFill />}
                        </p>
                    </button>
                </Col>
                <Col md="7">
                    <form className="form my-2 pb-4 mb-4">
                        <input
                            className="form-control mr-sm-2"
                            type="search"
                            placeholder="Buscar"
                            aria-label="Search"
                            onChange={handleChange(setSearch)}
                            style={{
                                backgroundColor: '#F9EDFF',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                padding: '8px'
                            }}
                        />
                    </form>
                </Col>
            </Row>
            <Row ref={parent}>
                {filteredUsers.length === 0 && (
                    <Col>
                        <h3>No hay {title} que coincidan con la búsqueda</h3>
                    </Col>
                )}
                {sortUsers(filteredUsers).map((user) => (
                    <Col key={user.id} xs={12} md={4}>
                        <CardProfile object={user} />
                    </Col>
                ))}
            </Row>
            {addRol && userLog && userLog.rolUser == 'ADMIN' &&
                <div className='pt-4'>
                    <Link to={`/users/new?role=${role}`}>
                        <Button className='btn btn-primary' style={{ background: "purple", color: "white" }}>Registrar {title}</Button>
                    </Link>
                </div>
            }
        </>
    );
}
