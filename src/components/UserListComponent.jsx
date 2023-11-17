import { BsFillArrowUpCircleFill, BsFillArrowDownCircleFill } from "react-icons/bs";
import CardProfile from './CardProfileComponent.jsx';
import { Row, Col } from 'react-bootstrap';
import { useListAnimation } from '../services/utils/animationsList.js';
import { useState } from 'react';

export default function UsersListComponent({ users }) {

    const [sortOrder, setSortOrder] = useState('asc');
    const [search, setSearch] = useState('');
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


    return (
        <>
            <h1 className='pb-4 mt-5'><b>Lista de usuarios</b></h1>
            <Row>
                <Col md="3">
                    <button className="btn btn-primary" onClick={handleSort}>
                        <h5>
                            Ordenar {sortOrder === 'asc' ? <BsFillArrowUpCircleFill /> : <BsFillArrowDownCircleFill />}
                        </h5>
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
                        <h3>No hay usuario que coincida con la búsqueda</h3>
                    </Col>
                )}
                {sortUsers(filteredUsers).map((user) => (
                    <Col key={user.id} xs={12} md={4}>
                        <CardProfile object={user} />
                    </Col>
                ))}
            </Row>
        </>
    );
}
