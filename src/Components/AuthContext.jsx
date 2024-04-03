import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => {
    const storedToken = sessionStorage.getItem('accessToken');
    return storedToken ? JSON.parse(storedToken) : null;
  });
  const [userRole, setUserRole] = useState(() => {
    const storedRole = sessionStorage.getItem('userRole');
    return storedRole ? JSON.parse(storedRole) : null;
  });

  useEffect(() => {
    sessionStorage.setItem('accessToken', JSON.stringify(accessToken));
    sessionStorage.setItem('userRole', JSON.stringify(userRole));
  }, [accessToken, userRole]);

  const login = (token, role) => {
    setAccessToken(token);
    setUserRole(role);
  };

  const logout = () => {
    setAccessToken(null);
    setUserRole(null);
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userRole');
  };

  const isAuthorized = (requiredRole) => {
    return userRole === requiredRole;
  };

  return (
    <AuthContext.Provider value={{ accessToken, userRole, login, logout, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
};
