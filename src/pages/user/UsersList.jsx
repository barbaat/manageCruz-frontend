import { useEffect, useState } from 'react';
import userService from '../../services/api/users.js';
import CustomNavbar from '../../components/NavbarComponent.jsx';
import UsersListComponent from '../../components/UserListComponent.jsx';

export default function UsersList() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const userLog = await userService.getUserLogeado();
      if (userLog && userLog.rolUser != 'ADMIN') {
        window.location.href = '/notAuthorized';
      }
      const users = await userService.allUsers();
      setUsers(users);
    };
    getUsers();
  }, []);

  return (
    <>
      <CustomNavbar />
      <div className='text-center container'>
        <UsersListComponent users={users} title='usuarios' />
      </div>
    </>
  );
}
