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
  const [userName, setUserName] = useState(() => {
    const storedUserName = sessionStorage.getItem('userName');
    return storedUserName ? JSON.parse(storedUserName) : null;
  });
  const [facultyName, setFacultyName] = useState(() => {
    const storedFacultyName = sessionStorage.getItem('facultyName');
    return storedFacultyName ? JSON.parse(storedFacultyName) : null;
  });

  useEffect(() => {
    sessionStorage.setItem('accessToken', JSON.stringify(accessToken));
    sessionStorage.setItem('userRole', JSON.stringify(userRole));
    sessionStorage.setItem('userId', JSON.stringify(userId));
    sessionStorage.setItem('userName', JSON.stringify(userName));
    sessionStorage.setItem('facultyName', JSON.stringify(facultyName));
  }, [accessToken, userRole, userId, userName, facultyName]);

  const login = (token, role, id, name, faculty) => {
    setAccessToken(token);
    setUserRole(role);
    setUserId(id);
    setUserName(name);
    setFacultyName(faculty);
  };

  const logout = () => {
    setAccessToken(null);
    setUserRole(null);
    setUserId(null);
    setUserName(null);
    setFacultyName(null)
  };

  const isAuthorized = (requiredRole) => {
    return userRole === requiredRole;
  };

  return (
    <AuthContext.Provider value={{ accessToken, userRole, userId, userName, facultyName, login, logout, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
};
