import React, { createContext, useState, useEffect, useContext } from 'react';
import { getToken, removeToken } from '../utils/authHelper';
import { useNavigation } from '@react-navigation/native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await getToken();
            if (token) {
                setIsLoggedIn(true);

            } else {
                setIsLoggedIn(false);
            }
            setIsLoading(false);
        };

        checkLoginStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);