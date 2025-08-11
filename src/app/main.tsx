import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router";
import './index.css';
import App from './App.tsx';

// Point d'entrée : rend l'application React dans la page HTML
createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
