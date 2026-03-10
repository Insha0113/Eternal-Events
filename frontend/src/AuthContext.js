import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session from sessionStorage on mount.
    // sessionStorage is automatically cleared when the browser tab/window is closed,
    // so the user is automatically logged out every time they leave the site.
    useEffect(() => {
        const savedToken = sessionStorage.getItem('userToken');
        const savedUser = sessionStorage.getItem('userInfo');
        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch {
                sessionStorage.removeItem('userToken');
                sessionStorage.removeItem('userInfo');
            }
        }
        setLoading(false);
    }, []);

    const login = (newToken, userInfo) => {
        setToken(newToken);
        setUser(userInfo);
        // Store in sessionStorage so the session expires when the browser is closed
        sessionStorage.setItem('userToken', newToken);
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        sessionStorage.removeItem('userToken');
        sessionStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export default AuthContext;
