import { useState, useEffect } from 'react';

export const useAuth = () => {
    // Get initial values from localStorage
    const initialToken = localStorage.getItem('token');
    const initialRole = localStorage.getItem('userRole');
    const initialUserId = localStorage.getItem('userId');

    // --- STATE DEFINITIONS ---
    const [token, setToken] = useState(initialToken); // ADDED: State for the token
    const [isLoggedIn, setIsLoggedIn] = useState(!!initialToken);
    const [userRole, setUserRole] = useState(initialRole);
    const [user, setUser] = useState(initialUserId ? { id: initialUserId } : null);

    useEffect(() => {
    
        const syncAuthStatus = () => {
            const currentToken = localStorage.getItem('token');
            const currentRole = localStorage.getItem('userRole');
            const currentUserId = localStorage.getItem('userId');
            
            console.log('Auth sync - Token:', currentToken, 'Role:', currentRole, 'UserID:', currentUserId);
            
            if (currentToken && currentUserId) {
                setIsLoggedIn(true);
                setToken(currentToken); // UPDATE the token state
                setUserRole(currentRole);
                setUser({ id: currentUserId });
            } else {
                setIsLoggedIn(false);
                setToken(null); // CLEAR the token state
                setUserRole(null);
                setUser(null);
            }
        };

        syncAuthStatus();

        // Listen for changes in other browser tabs or from manual logout/login functions
        const handleStorageChange = () => {
            console.log('Storage change detected, re-syncing auth status');
            syncAuthStatus();
        };

        window.addEventListener('storage', handleStorageChange);
        // This custom event is useful if you update localStorage manually in your code
        window.addEventListener('localStorageUpdated', handleStorageChange);

        // Cleanup function to remove listeners
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('localStorageUpdated', handleStorageChange);
        };
    }, []); 


    return { isLoggedIn, userRole, user, token };
};
