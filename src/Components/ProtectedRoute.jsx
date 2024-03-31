import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const accessToken = localStorage.getItem('accessToken');

  return (
    <Route
      {...rest}
      element={props =>
        accessToken ? <Element {...props} /> : <Navigate to="/" />
      }
    />
  );
};

export default ProtectedRoute;
