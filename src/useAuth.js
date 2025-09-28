import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');
            
            console.log('Auth check - Token exists:', !!token, 'Username:', username);
            
            if (token) {
                setIsLoggedIn(true);
                console.log('User is authenticated');
            } else {
                setIsLoggedIn(false);
                console.log('User is not authenticated');
            }
        };

        checkLoginStatus();

        const handleStorageChange = () => {
            console.log('Storage change detected, rechecking auth status');
            checkLoginStatus();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('localStorageUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('localStorageUpdated', handleStorageChange);
        };
    }, []);

    return { isLoggedIn };
};