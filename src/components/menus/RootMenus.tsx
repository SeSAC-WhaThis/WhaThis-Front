import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { PATH } from "../../constants/path";

export default function RootMenus() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // @ts-ignore
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    alert("로그아웃 되었습니다.");
    navigate(PATH.MAIN);
  };

  return (
    <nav id="navbar" className=" flex bg-blue-300 justify-between items-center">
      <div className="w-4/5 bg-gray-500">
        <ul className="flex p-4 text-white font-bold">
          <li className="pr-6 text-2xl">
            <NavLink to={PATH.MAIN}>Main</NavLink>
          </li>
          <li className="pr-6 text-2xl">
            <NavLink to={PATH.ABOUT}>About</NavLink>
          </li>
          <li className="pr-6 text-2xl">
            <NavLink to={PATH.TODO}>Todo</NavLink>
          </li>
        </ul>
      </div>
      <div className="pr-6 text-white font-bold">
        {!isAuthenticated ? (
          <NavLink to={PATH.LOGIN} className="text-2xl">
            Login
          </NavLink>
        ) : (
          <button onClick={handleLogout} className="text-2xl">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
