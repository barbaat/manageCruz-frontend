import "../../css/Loader.css"
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import userService from '../../services/api/users.js';
import CustomNavbar from '../../components/NavbarComponent';
import Error from '../others/Error';
import CardProfile from '../../components/CardProfileComponent';
import { BsFillTrash3Fill, BsPencilSquare } from "react-icons/bs";

export default function UserDetails() {
  const [user, setUser] = useState([]);
  const [userLog, setUserLog] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const getUser = async () => {
      const users = await userService.allUsers();
      const userExists = users.some((user) => user.username == username);
      if (userExists) {
        try {
          const user = await userService.getUser(username);
          setUser(user);
        } catch (error) {
          console.log('Error al obtener el usuario:', error);
        }
      } else {
        setUser(null);
        window.location.href = '/error';
      }
    };
    getUser();

    const getUserLog = async () => {
      const user = await userService.getUserLogeado();
      setUserLog(user);
    }
    getUserLog();
  }, [username]);

  const handleDelete = async () => {
    if (username == userLog.username) {
      window.alert('No puedes eliminarte a ti mismo');
      return;
    } else {
      const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este usuario?');
      if (confirmDelete) {
        try {
          await userService.deleteUser(user.id);
          window.location.href = '/';
        } catch (error) {
          console.log('Error al eliminar el usuario:', error);
        }
      }
    }
  }


  return (
    <>
      {user ? (
        <>
          <CustomNavbar />
          <div className="container pb-5">
            <Row className='mx-auto text-center'>
              <h1 className="mb-3 pb-3 mx-auto pt-3"><b>Detalles del usuario</b></h1>
            </Row>
            <br />
            <br />
            <Row>
                <br />
                <CardProfile object={user} profile />
                {(userLog.rolUser == 'ADMIN' || userLog.username == user.username) && (
                  <div className="pt-2 mt-2 text-center mb-4 pb-4" style={{ fontSize: "2rem" }}>
                    <Link to={`/users/edit/${user.username}`} className="btn" style={{ background: "rgb(159, 149, 61)", color: "white" }}>
                      <h5>Editar <BsPencilSquare /></h5>
                    </Link>
                    &nbsp;&nbsp;&nbsp;&nbsp;

                    {(userLog.rolUser == 'ADMIN') && (
                      <button className="btn btn-danger" style={{ fontSize: "1.25rem" }} onClick={handleDelete}>
                        <h5>Eliminar <BsFillTrash3Fill /></h5>
                      </button>
                    )}
                  </div>
                )}
            </Row>
          </div>
        </>
      ) : (
        <Error />
      )
      }
    </>
  );
}
