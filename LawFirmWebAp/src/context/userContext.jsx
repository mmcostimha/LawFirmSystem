import React, { createContext, useContext, useState, useEffect } from 'react';

// Define possible account types
const ACCOUNT_TYPES = {
    ADMIN: 'admin',
    LAWYER: 'lawyer',
    CLIENT: 'client',
};

// Example: pages allowed per account type
const PAGES_PER_ACCOUNT = {
    admin: ['register', 'users', 'dashboard', 'profile'],
    // lawyer: ['dashboard', 'cases', 'profile'],
    client: ['dashboard', 'profile'],
};

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [accountType, setAccountType] = useState(null); // e.g., 'admin', 'lawyer', 'client'
    const [token, setToken] = useState(null); // e.g., JWT or session tokens
    const [allowedPages, setAllowedPages] = useState([]);

    // Restaurar sessão ao carregar a app
    useEffect(() => {
        const savedToken = localStorage.getItem('authToken');
        const savedType = localStorage.getItem('accountType');

        if (savedToken && savedType) {
            setToken(savedToken);
            setAccountType(savedType);
            setAllowedPages(PAGES_PER_ACCOUNT[savedType] || []);
        }
    }, []);

    // Login
    const login = (type, token) => {
        setAccountType(type);
        setAllowedPages(PAGES_PER_ACCOUNT[type] || []);
        setToken(token);

        console.log("User logged in:");
        console.log("type:", type);
        console.log("token:", token);
        console.log("allowedPages:", PAGES_PER_ACCOUNT[type] || []);
        // Persistir no localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('accountType', type);
    };

    // Logout
    const logout = () => {
        setAccountType(null);
        setAllowedPages([]);
        setToken(null);

        // Limpar do localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('accountType');
    };

    // Check if a page is allowed for current account
    const isPageAllowed = (page) => allowedPages.includes(page);

    return (
        <UserContext.Provider
            value={{
                accountType,
                token,
                allowedPages,
                login,
                logout,
                isPageAllowed,
            }}
            >
            {children}
        </UserContext.Provider>
    );
};