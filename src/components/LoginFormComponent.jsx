import logo from '../assets/images/logo.png';

export default function LoginForm({ handleSubmit, username, password, handleUsernameChange, handlePasswordChange }) {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="col-sm-6 col-md-4">
          <h1 className="text-center pb-4">Inicio de sesión</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                value={username}
                name="Username"
                placeholder="Username"
                onChange={handleUsernameChange}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                value={password}
                name="Password"
                placeholder="Password"
                onChange={handlePasswordChange}
              />
            </div>
            <button
              id="form-login-button"
              type="submit"
              className="btn btn-primary"
              style={{ background: "purple", color: "white" }}
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>

    </>
  );
};
