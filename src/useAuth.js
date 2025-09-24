import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            const storedProfilePicture = localStorage.getItem('profilePictureUrl');
            console.log('Auth check - Token:', !!token, 'Profile URL:', storedProfilePicture);
            console.log('LocalStorage contents:', {
                token: localStorage.getItem('token'),
                profilePictureUrl: localStorage.getItem('profilePictureUrl'),
                allKeys: Object.keys(localStorage)
            });
            if (token) {
                setIsLoggedIn(true);
                setProfilePictureUrl(storedProfilePicture);
            } else {
                setIsLoggedIn(false);
                setProfilePictureUrl(null);
            }
        };

        checkLoginStatus();

        const handleStorageChange = () => {
            checkLoginStatus();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('localStorageUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('localStorageUpdated', handleStorageChange);
        };
    }, []);

    // Debug logging whenever state changes
    useEffect(() => {
        console.log('Auth state changed - isLoggedIn:', isLoggedIn, 'profilePictureUrl:', profilePictureUrl);
    }, [isLoggedIn, profilePictureUrl]);

    return { isLoggedIn, profilePictureUrl };
};