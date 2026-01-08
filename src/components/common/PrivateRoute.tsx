import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { PATH } from '../../constants/path';

const PrivateRoute = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      const timer = setTimeout(() => {
        alert('로그인이 필요한 서비스입니다.');
        navigate(PATH.AUTH.LOGIN);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [token, navigate]);

  return token ? <Outlet /> : null;
};

export default PrivateRoute;