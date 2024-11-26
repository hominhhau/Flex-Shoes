import { createContext, useContext, useState } from 'react';

// Tạo context
const AuthContext = createContext();

// Provider để cung cấp trạng thái đăng nhập
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Biến trạng thái đăng nhập
    const [role, setRole] = useState(false); // Biến quyền hạn

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
