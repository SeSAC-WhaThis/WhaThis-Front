import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import type { RootState } from "../../store";
import defaultavatar from "../../assets/icons/defaultavatar.png";
import MyProjects from "../../components/profile/MyProjects";
import MyFunding from "../../components/profile/MyFunding";
import UpdateProfile from "./UpdateProfile";
import FollowList from "../../components/profile/FollowList";
import LikeProduct from "../../components/profile/LikeProduct";
import Unsubscribe from "../../components/profile/Unsubscribe";
import UpdatePassword from "./UpdatePassword";

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const initialTab = location.state?.tab || "project";

  const [activeTab, setActiveTab] = useState<
    | "project"
    | "funding"
    | "update"
    | "following"
    | "follower"
    | "liked"
    | "password"
    | "unsubscribe"
  >(initialTab);

  // location.state가 변경될 때도 탭 업데이트 (선택 사항이지만 안전하게)
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  if (!user) {
    return <div className="p-8 text-center">로그인이 필요한 페이지입니다.</div>;
  }

  // user 타입에 nickname이 없으면 name을 사용하도록 처리
  const nickname = (user as any)?.nickname || user?.name || "사용자";
  const profileImg = user.profileImageUrl || defaultavatar;

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* 왼쪽 사이드바 */}
      <div className="w-full md:w-1/4 flex flex-col gap-6">
        {/* 프로필 정보 */}
        <div className="flex flex-col items-center p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
          <img
            src={profileImg}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-4"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = defaultavatar;
            }}
          />
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setActiveTab("update")}
            title="프로필 수정하기"
          >
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#00cfcf] transition-colors">
              {nickname}
            </h2>
            <span className="text-xs text-gray-400 group-hover:text-[#00cfcf] transition-colors">
              ✎
            </span>
          </div>
        </div>

        {/* 메뉴 */}
        <div className="flex flex-col border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white">
          <button
            className={`p-4 text-left transition-colors ${activeTab === "project"
              ? "bg-gray-100 font-bold text-[#00cfcf]"
              : "hover:bg-gray-50 text-gray-700"
              }`}
            onClick={() => setActiveTab("project")}
          >
            프로젝트
          </button>
          <button
            className={`p-4 text-left transition-colors ${activeTab === "funding"
              ? "bg-gray-100 font-bold text-[#00cfcf]"
              : "hover:bg-gray-50 text-gray-700"
              }`}
            onClick={() => setActiveTab("funding")}
          >
            내 펀딩
          </button>
          <button
            className={`p-4 text-left transition-colors ${activeTab === "liked"
              ? "bg-gray-100 font-bold text-[#00cfcf]"
              : "hover:bg-gray-50 text-gray-700"
              }`}
            onClick={() => setActiveTab("liked")}
          >
            좋아요 누른 상품
          </button>
          <button
            className={`p-4 text-left transition-colors ${activeTab === "following"
              ? "bg-gray-100 font-bold text-[#00cfcf]"
              : "hover:bg-gray-50 text-gray-700"
              }`}
            onClick={() => setActiveTab("following")}
          >
            팔로잉
          </button>
          <button
            className={`p-4 text-left transition-colors ${activeTab === "follower"
              ? "bg-gray-100 font-bold text-[#00cfcf]"
              : "hover:bg-gray-50 text-gray-700"
              }`}
            onClick={() => setActiveTab("follower")}
          >
            팔로워
          </button>
          <button
            className={`p-4 text-left transition-colors ${activeTab === "update"
              ? "bg-gray-100 font-bold text-[#00cfcf]"
              : "hover:bg-gray-50 text-gray-700"
              }`}
            onClick={() => setActiveTab("update")}
          >
            프로필 수정
          </button>
          <button
            className={`p-4 text-left transition-colors ${activeTab === "password"
              ? "bg-gray-100 font-bold text-[#00cfcf]"
              : "hover:bg-gray-50 text-gray-700"
              }`}
            onClick={() => setActiveTab("password")}
          >
            비밀번호 변경
          </button>
          <button
            className={`p-4 text-left transition-colors ${activeTab === "unsubscribe"
              ? "bg-gray-100 font-bold text-[#00cfcf]"
              : "hover:bg-gray-50 text-gray-700"
              }`}
            onClick={() => setActiveTab("unsubscribe")}
          >
            회원 탈퇴
          </button>
        </div>
      </div>

      {/* 오른쪽 컨텐츠 */}
      <div className="w-full md:w-3/4">
        {activeTab === "project" && <MyProjects />}
        {activeTab === "funding" && <MyFunding />}
        {activeTab === "following" && <FollowList type="following" />}
        {activeTab === "follower" && <FollowList type="follower" />}
        {activeTab === "liked" && <LikeProduct />}
        {activeTab === "unsubscribe" && <Unsubscribe />}
        {activeTab === "update" && (
          <UpdateProfile
            onCancel={() => setActiveTab("project")}
            onSuccess={() => setActiveTab("project")}
          />
        )}
        {activeTab === "password" && (
          <UpdatePassword
            onCancel={() => setActiveTab("project")}
            onSuccess={() => setActiveTab("project")}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
