import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoBackButton = () => {
    const navigate = useNavigate();

  const goBack = () => {
    navigate(-1)
  };

  return (
    <button onClick={goBack}>Go Back</button>
  );
};

export default GoBackButton;
