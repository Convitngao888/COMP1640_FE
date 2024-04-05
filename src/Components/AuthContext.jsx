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
  const [userId, setUserId] = useState(() => {
    const storedUserId = sessionStorage.getItem('userId');
    return storedUserId ? JSON.parse(storedUserId) : null;
  });

  useEffect(() => {
    sessionStorage.setItem('accessToken', JSON.stringify(accessToken));
    sessionStorage.setItem('userRole', JSON.stringify(userRole));
    sessionStorage.setItem('userId', JSON.stringify(userId));
  }, [accessToken, userRole, userId]);

  const login = (token, role, id) => {
    setAccessToken(token);
    setUserRole(role);
    setUserId(id);
  };

  const logout = () => {
    setAccessToken(null);
    setUserRole(null);
    setUserId(null);
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userId');
  };

  const isAuthorized = (requiredRole) => {
    return userRole === requiredRole;
  };

  return (
    <AuthContext.Provider value={{ accessToken, userRole, userId, login, logout, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
};
