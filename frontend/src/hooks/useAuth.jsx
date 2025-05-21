import { createContext, useContext, useState, useEffect } from 'react';

// Tạo context
const AuthContext = createContext();

// Provider để cung cấp trạng thái đăng nhập
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Biến trạng thái đăng nhập
    const [role, setRole] = useState(false); // Biến quyền hạn

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedRoles = localStorage.getItem('role');
        console.log('Token:', token);
        setIsLoggedIn(!!token);

        if (storedRoles) {
            const parsedRoles = JSON.parse(storedRoles);
            const isAdmin = parsedRoles.some((role) => role.authority === 'ROLE_ADMIN');
            setRole(isAdmin);
        } else {
            setRole(false);
        }
    }, [isLoggedIn, role]);

    return <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole }}>{children}</AuthContext.Provider>;
};

// Hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
