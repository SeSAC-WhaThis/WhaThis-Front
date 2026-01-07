import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductList from "../../components/products/ProductList";
import { fetchMyProducts } from "../../store/productSlice";
import LikeProduct from "../../components/profile/LikeProduct";
import MyFunding from "../../components/profile/MyFunding";
import type { RootState } from "../../store";
import type { ThunkDispatch } from "@reduxjs/toolkit";
import { PATH } from "../../constants/path";
import defaultavatar from "../../assets/icons/defaultavatar.png";

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { myProducts, isLoading } = useSelector(
    (state: RootState) => state.products
  );
  const [activeTab, setActiveTab] = useState<"project" | "funding" | "liked">(
    "project"
  );

  useEffect(() => {
    if (activeTab === "project") {
      dispatch(fetchMyProducts());
    }
  }, [dispatch, activeTab]);

  if (!user) {
    return <div className="p-8 text-center">로그인이 필요한 페이지입니다.</div>;
  }

  // user 타입에 nickname이 없으면 name을 사용하도록 처리
  const nickname = (user as any).nickname || user.name;
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
          <h2 className="text-xl font-bold text-gray-900">{nickname}</h2>
        </div>

        {/* 메뉴 */}
        <div className="flex flex-col border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white">
          <button
            className={`p-4 text-left transition-colors ${
              activeTab === "project"
                ? "bg-gray-100 font-bold text-[#00cfcf]"
                : "hover:bg-gray-50 text-gray-700"
            }`}
            onClick={() => setActiveTab("project")}
          >
            프로젝트
          </button>
          <button
            className={`p-4 text-left transition-colors ${
              activeTab === "funding"
                ? "bg-gray-100 font-bold text-[#00cfcf]"
                : "hover:bg-gray-50 text-gray-700"
            }`}
            onClick={() => setActiveTab("funding")}
          >
            내 펀딩
          </button>
          <button
            className={`p-4 text-left transition-colors ${
              activeTab === "liked"
                ? "bg-gray-100 font-bold text-[#00cfcf]"
                : "hover:bg-gray-50 text-gray-700"
            }`}
            onClick={() => setActiveTab("liked")}
          >
            좋아요 누른 상품
          </button>
        </div>
      </div>

      {/* 오른쪽 컨텐츠 */}
      <div className="w-full md:w-3/4">
        {activeTab === "project" && (
          <div>
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold">내가 만든 프로젝트</h2>
              <button
                onClick={() => navigate(PATH.PRODUCT.CREATE)}
                className="px-6 py-2 bg-[#00cfcf] text-white rounded-md hover:bg-[#00afaf] transition-colors font-bold"
              >
                프로젝트 만들기
              </button>
            </div>
            {isLoading && myProducts.length === 0 ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <ProductList products={myProducts} />
            )}
          </div>
        )}
        {activeTab === "funding" && <MyFunding />}
        {activeTab === "liked" && <LikeProduct />}
      </div>
    </div>
  );
};

export default ProfilePage;
