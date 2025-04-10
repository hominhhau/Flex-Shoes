import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import GlobalStyles from './components/GlobalStyles';
import { AuthProvider } from './hooks/useAuth';
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <StrictMode>
            <GlobalStyles>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </GlobalStyles>
        </StrictMode>
    </Provider>
);
