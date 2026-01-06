import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { useState } from "react";
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

  const [keyword, setKeyword] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    alert("로그아웃 되었습니다.");
    navigate(PATH.MAIN);
  };

  // 프로필 이미지 없을 때 기본 이미지
  const profileImgSrc = user?.profileImageUrl || "/default-avatar.png";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-[18px] font-medium transition-colors ${
      isActive ? "text-[rgb(231,249,249)] active" : "text-black"
    }`;

  return (
    <nav id="navbar" className="w-full bg-white">
      {/* 전체를 가운데로 모으기 */}
      <div className="w-full px-4 py-4 flex justify-center">
        <div className="flex items-center gap-8">
          {/* 메뉴 */}
          <ul className="flex items-center gap-8">
            <li>
              <NavLink to={PATH.MAIN} className={linkClass} end>
                whathis
              </NavLink>
            </li>

            <li>
              <NavLink to={PATH.PRODUCT.FUNDINGPAGE} className={linkClass}>
                펀딩+
              </NavLink>
            </li>

            <li className="flex items-center gap-4">
              <NavLink to={PATH.PRODUCT.FEED} className={linkClass}>
                피드
              </NavLink>

              {/* ✅ 프리오더 옆 검색창 (라운드) */}
              <div className="flex items-center">
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="검색"
                  className="w-65 md:w-[320px] h-11 rounded-full bg-gray-100 px-5 text-[18px] text-black placeholder:text-gray-500 outline-none"
                />
              </div>
            </li>
          </ul>

          {/* 오른쪽(로그인/프로필/로그아웃)도 가운데 그룹에 포함 */}
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <NavLink to={PATH.AUTH.LOGIN} className={linkClass}>
                Login
              </NavLink>
            ) : (
              <>
                <Link
                  to={PATH.AUTH.PROFILE}
                  className="flex items-center gap-2"
                >
                  <img
                    src={profileImgSrc}
                    alt="프로필"
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = defaultavatar;
                    }}
                  />

                  <span className="text-[18px] font-medium text-black max-w-40 truncate">
                    {(user as any)?.nickname || user?.name || "사용자"}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-[18px] font-medium text-black hover:text-[rgb(0,178,178)] transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
