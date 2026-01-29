import React, { createContext, useContext, useState, useEffect } from 'react';

// Define possible account types
const ACCOUNT_TYPES = {
    ADMIN: 'admin',
    LAWYER: 'lawyer',
    CLIENT: 'client',
};

// Example: pages allowed per account type
const PAGES_PER_ACCOUNT = {
    admin: ['dashboard', 'profile'],
    // lawyer: ['dashboard', 'cases', 'profile'],
    client: ['profile'],
};

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [accountType, setAccountType] = useState(null); // e.g., 'admin', 'lawyer', 'client'
    const [token, setToken] = useState(null); // e.g., JWT or session tokens
    const [id, setId] = useState(null); // Placeholder for future use
    const [allowedPages, setAllowedPages] = useState([]);

    // Restaurar sessão ao carregar a app
    useEffect(() => {
        const savedToken = localStorage.getItem('authToken');
        const savedType = localStorage.getItem('accountType');
        const savedId = localStorage.getItem('userId');


        if (savedToken && savedType && savedId) {
            setToken(savedToken);
            setAccountType(savedType);
            setId(savedId);
            setAllowedPages(PAGES_PER_ACCOUNT[savedType] || []);
        }
    }, []);

    // Login
    const login = (type, token, id, username, password) => {
        setAccountType(type);
        setAllowedPages(PAGES_PER_ACCOUNT[type] || []);
        setToken(token);
        setId(id);

        // console.log("User logged in:");
        // console.log("type:", type);
        // console.log("token:", token);
        // console.log("id:", id);
        // console.log("allowedPages:", PAGES_PER_ACCOUNT[type] || []);
        // Persistir no localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('accountType', type);
        localStorage.setItem('userId', id);
        // Optionally save credentials for "Remember Me" functionality
        if (username && password) {
            localStorage.setItem('savedUsername', username);
            localStorage.setItem('savedPassword', password);
        }
    };


    // Logout
    const logout = () => {
        setAccountType(null);
        setAllowedPages([]);
        setToken(null);
        setId(null);

        // Limpar do localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('accountType');
        localStorage.removeItem('userId');
        // localStorage.removeItem('savedUsername');
        localStorage.removeItem('savedPassword');
    };

    // Check if a page is allowed for current account
    const isPageAllowed = (page) => allowedPages.includes(page);

    return (
        <UserContext.Provider
            value={{
                accountType,
                token,
                allowedPages,
                id,
                login,
                logout,
                isPageAllowed
            }}
            >
            {children}
        </UserContext.Provider>
    );
};