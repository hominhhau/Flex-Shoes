import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import GlobalStyles from './components/GlobalStyles';
import { AuthProvider } from './hooks/useAuth';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GlobalStyles>
        <AuthProvider>
            <App />
        </AuthProvider>
        </GlobalStyles>
    </StrictMode>,
);
