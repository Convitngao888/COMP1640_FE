import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const login = (token, role) => {
    setAccessToken(token);
    setUserRole(role);
  };

  const logout = () => {
    setAccessToken(null);
    setUserRole(null);
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
