import React from 'react';
import { Form, Button } from 'react-bootstrap';
import logo from '../assets/images/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LoginForm({
  handleSubmit,
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  errorMessage
}) {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="col-sm-8 col-md-6 col-lg-4 p-4 shadow-lg rounded" style={{ background: "white" }}>
        <h1 className="text-center pb-4" style={{ color: "black" }}>Inicio de sesión</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              value={username}
              name="Username"
              placeholder="Username"
              onChange={handleUsernameChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              value={password}
              name="Password"
              placeholder="Password"
              onChange={handlePasswordChange}
            />
          </Form.Group>
          <Button
            id="form-login-button"
            type="submit"
            className="btn-primary w-100"
            style={{ background: '#f8c76495', color: 'black' }}
          >
            Iniciar sesión
          </Button>
          {errorMessage && <p className='alert alert-danger mt-2'>{errorMessage}</p>}
        </Form>
      </div>
    </div>
  );
}
