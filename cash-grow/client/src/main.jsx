import 'bootstrap/dist/css/bootstrap.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from "./context/AuthProvider";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Provides user context to the whole application */}
    < AuthProvider> 
    <App/>
    </AuthProvider>
  </StrictMode>,
)
