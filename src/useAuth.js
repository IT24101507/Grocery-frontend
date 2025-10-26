import { useState, useEffect } from 'react';

export const useAuth = () => {
    // Get initial values from localStorage
    const initialToken = localStorage.getItem('token');
    const initialRole = localStorage.getItem('userRole');
    const initialUserId = localStorage.getItem('userId');
    const initialTokenExpiration = localStorage.getItem('tokenExpiration');

    // --- STATE DEFINITIONS ---
    const [token, setToken] = useState(initialToken); // ADDED: State for the token
    const [isLoggedIn, setIsLoggedIn] = useState(!!initialToken);
    const [userRole, setUserRole] = useState(initialRole);
    // IMPROVED: Initialize user as null if no userId exists
    const [user, setUser] = useState(initialUserId ? { id: initialUserId } : null);
    const [logoutTimer, setLogoutTimer] = useState(null);        

       const clearLogoutTimer = () => {
        if (logoutTimer) {
            clearTimeout(logoutTimer);
            setLogoutTimer(null);
        }
    };

    const startLogoutTimer = (expirationTime) => {
        clearLogoutTimer(); // Clear any existing timer
        const remainingTime = expirationTime - new Date().getTime();
        if (remainingTime > 0) {
            setLogoutTimer(setTimeout(logout, remainingTime));
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('gmail');
        localStorage.removeItem('fullName');
        localStorage.removeItem('addressLine1');
        localStorage.removeItem('addressLine2');
        localStorage.removeItem('city');
        localStorage.removeItem('postalCode');
        localStorage.removeItem('telephone');
        localStorage.removeItem('profilePictureUrl');
        localStorage.removeItem('tokenExpiration');
        setIsLoggedIn(false);
        setToken(null);
        setUserRole(null);
        setUser(null);
        window.dispatchEvent(new Event('localStorageUpdated'));
    };
    
    useEffect(() => {
        // This function syncs the auth state with localStorage.
        const syncAuthStatus = () => {
            const currentToken = localStorage.getItem('token');
            const currentRole = localStorage.getItem('userRole');
            const currentUserId = localStorage.getItem('userId');
            const currentTokenExpiration = localStorage.getItem('tokenExpiration');
            
            console.log('Auth sync - Token:', currentToken, 'Role:', currentRole, 'UserID:', currentUserId, 'Expiration:', currentTokenExpiration);

           if (currentToken && currentUserId && currentTokenExpiration) {
                const now = new Date().getTime();
                if (now > parseInt(currentTokenExpiration)) {
                    console.log('Token expired, logging out.');
                    logout();
                    return;
                }
                setIsLoggedIn(true);
                setToken(currentToken); // UPDATE the token state
                setUserRole(currentRole);
                setUser({ id: currentUserId });
                startLogoutTimer(parseInt(currentTokenExpiration));
            } else {
                clearLogoutTimer();
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
            clearLogoutTimer(); // Clear timer on unmount
        };
    }, []); // Empty dependency array means this runs once on mount

    // --- RETURN STATEMENT ---
    // ADD token to the returned object
    return { isLoggedIn, userRole, user, token };
};
