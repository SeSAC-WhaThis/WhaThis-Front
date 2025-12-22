import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import type { RootState } from "../../store";
// 더미 로그인용 액션과 더미 응답 데이터
import { mockLogin } from "../../store/authSlice";
import { dummyAuthResponse } from "../../mocks/dummyAuthResponse";
// 경로 상수
import { PATH } from "../../constants/path";
import defaultavatar from "../../assets/icons/defaultavatar.png";
export default function RootMenus() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // isAuthenticated 뿐 아니라 user도 가져오기
  const { token, user } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = Boolean(token);

  const handleLogout = () => {
    dispatch(logout());
    alert("로그아웃 되었습니다.");
    navigate(PATH.MAIN);
  };

  const activeLinkStyle = {
    color: "#FBBF24",
  };

  // ✅ 프로필 이미지 없을 때 기본 이미지(원하면 경로 바꿔도 됨)
  const profileImgSrc = user?.profileImageUrl || "/default-avatar.png";

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

      {/* ✅ 오른쪽 영역 */}
      <div className="text-lg flex items-center gap-3">
        <button
          className="hover:text-amber-300 transition-colors"
          onClick={() => dispatch(mockLogin(dummyAuthResponse))}
        >
          더미 로그인
        </button>
        {!isLoggedIn ? (
          <NavLink
            to={PATH.AUTH.LOGIN}
            className="hover:text-amber-300 transition-colors"
          >
            Login
          </NavLink>
        ) : (
          <>
            {/* 프로필 이미지 */}
            <img
              src={profileImgSrc}
              alt="프로필"
              className="w-9 h-9 rounded-full object-cover border border-white/50"
              onError={(e) => {
                // 이미지 깨지면 기본 이미지로 교체
                (e.currentTarget as HTMLImageElement).src = defaultavatar;
              }}
            />

            {/* 이름 */}
            <span className="text-white/90 font-semibold max-w-35 truncate">
              {user?.name ?? "사용자"}
            </span>

            {/* 로그아웃 버튼 */}
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-md bg-white/15 hover:bg-white/25 transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
