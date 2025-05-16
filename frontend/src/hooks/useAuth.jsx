import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null); // null = chưa load role
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedRoles = localStorage.getItem('role');
        setIsLoggedIn(!!token);

        if (storedRoles) {
            const parsedRoles = JSON.parse(storedRoles);
            const isAdmin = parsedRoles.some(r => r.authority === 'ROLE_ADMIN');
            setRole(isAdmin);
        } else {
            setRole(false);
        }

        setIsLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
