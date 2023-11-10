import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="940110356498-v5bs4ch6enhssjqti6qfe9hl7i37j7vv.apps.googleusercontent.com">
      <App />
  </GoogleOAuthProvider>
);
