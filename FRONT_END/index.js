import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
<Auth0Provider
     domain="dev-7bom31phfk83ffkv.us.auth0.com"
     clientId="Dh4MXqUj8w9N52IY9psQ54TjUje50SJe"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>,
);
