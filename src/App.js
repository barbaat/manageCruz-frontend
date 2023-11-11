import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';

import Welcome from './pages/home/Welcome';
import UserForm from './pages/user/UserForm';
import UsersList from './pages/user/UsersList';
import UserDetails from './pages/user/UserDetails';
import Error from './pages/others/Error';
import UserEdit from './pages/user/UserEdit';
import NotAuth from './pages/others/NotAuth';

import userService from '../src/services/api/users.js'

import '../src/css/Style.css';
import '../src/css/Loader.css';
import AlbaranDetails from './pages/albaran/AlbaranDetails.jsx';
import AlbaranList from './pages/albaran/AlbaranList.jsx';



const App = () => {

  const [userLog, setUserLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserLog = async () => {
      if (window.localStorage.getItem('tokenLoggedUser')) {
        const userLog = await userService.getUserLogeado();
        setUserLog(userLog);
      }
      setLoading(false);
    };
    getUserLog();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        <div className='loader'>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="root">
        <Router>
          <Routes>
            <Route exact path="/" element={<Welcome />} />

            <Route exact path="/users" element={<UsersList />} />
            <Route exact path="/users/new" element={<UserForm />} />
            <Route exact path="/users/:username" element={<UserDetails />} />
            <Route exact path="/users/edit/:username" element={<UserEdit />} />

            <Route exact path="/albaran/:id" element={<AlbaranDetails />} />
            <Route exact path="/albaran" element={<AlbaranList />} />

            <Route exact path="/notAuthorized" element={<NotAuth />} />

            <Route path="*" element={<Error />} />
          </Routes>
        </Router>
      </div >
    </>
  );
};

export default App;