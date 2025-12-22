import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import type { RootState } from "../../store"; // 1. RootState 타입 import
import { PATH } from "../../constants/path";

export default function RootMenus() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    alert("로그아웃 되었습니다.");
    navigate(PATH.MAIN);
  };

  // 3. NavLink 활성 스타일
  const activeLinkStyle = {
    color: "#FBBF24", // TailwindCSS amber-400
  };

  return (
    <nav
      id="navbar"
      className="flex bg-blue-500 justify-between items-center p-4 text-white font-bold shadow-md"
    >
      <ul className="flex items-center space-x-8 text-xl">
        <li>
          <NavLink
            to={PATH.MAIN}
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="text-2xl hover:text-amber-300 transition-colors"
          >
            whathis
          </NavLink>
        </li>
        <li>
          <NavLink
            to={PATH.PRODUCT.FUNDINGPAGE}
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="hover:text-amber-300 transition-colors"
          >
            펀딩+
          </NavLink>
        </li>
        <li>
          <NavLink
            to={PATH.PRODUCT.PREORDERPAGE}
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="hover:text-amber-300 transition-colors"
          >
            프리오더
          </NavLink>
        </li>
      </ul>
      <div className="text-lg">
        {!isAuthenticated ? (
          <NavLink
            to={PATH.AUTH.LOGIN}
            className="hover:text-amber-300 transition-colors"
          >
            Login
          </NavLink>
        ) : (
          <button
            onClick={handleLogout}
            className="hover:text-amber-300 transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
