import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../api/axiosInstance";
import defaultavatar from "../../assets/icons/defaultavatar.png";
import { PATH } from "../../constants/path";
import type { RootState } from "../../store";
import { followUser, unfollowUser } from "../../store/followSlice";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  goalAmount: number;
  currentAmount: number;
  buyerCount: number;
  achievementRate: number;
  startDate: string;
  endDate: string;
  status: string;
  viewCount: number;
  thumbnailImageUrl: string;
  category: {
    id: number;
    name: string;
  };
  daysLeft: number;
  createdAt: string;
}

export interface SellerProfileData {
  id: number;
  name: string;
  nickname: string;
  profileImageUrl: string | null;
  brn: string | null;
  followerCount: number;
  ratingAvg: number;
  salesTotalAmount: number;
  following: boolean;
  products: Product[];
}

const SellerProfile = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [profile, setProfile] = useState<SellerProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleFollow = async () => {
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      navigate(PATH.AUTH.LOGIN);
      return;
    }

    if (!profile) return;

    try {
      if (profile.following) {
        // 언팔로우 요청
        await dispatch(unfollowUser(profile.id)).unwrap();
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                following: false,
                followerCount: Math.max(0, prev.followerCount - 1),
              }
            : null
        );
      } else {
        // 팔로우 요청
        await dispatch(followUser(profile.id)).unwrap();
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                following: true,
                followerCount: prev.followerCount + 1,
              }
            : null
        );
      }
    } catch (error: any) {
      alert(error || "요청 처리에 실패했습니다.");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(`/products/user/${sellerId}`);
        if (response.data.success) {
          setProfile(response.data.data);
        }
      } catch (error) {
        console.error("프로필 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      fetchProfile();
    }
  }, [sellerId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        로딩 중...
      </div>
    );
  if (!profile)
    return (
      <div className="flex justify-center items-center h-screen">
        판매자 정보를 찾을 수 없습니다.
      </div>
    );

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      {/* 프로필 섹션 */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="relative">
          <img
            src={profile.profileImageUrl || defaultavatar}
            alt={profile.nickname}
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-100"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = defaultavatar;
            }}
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {profile.nickname}
            </h1>
            <span className="text-gray-500 text-sm">({profile.name})</span>
          </div>

          <div className="flex justify-center md:justify-start gap-8 mt-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {profile.followerCount}
              </div>
              <div className="text-sm text-gray-500">팔로워</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {profile.ratingAvg.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">평점</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {new Intl.NumberFormat("ko-KR", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(profile.salesTotalAmount)}
              </div>
              <div className="text-sm text-gray-500">누적 판매액</div>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={handleFollow}
            className={`px-8 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
              profile.following
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : "bg-[#00cfcf] text-white hover:bg-[#00b0b0] shadow-md hover:shadow-lg"
            }`}
          >
            {profile.following ? "팔로잉" : "팔로우"}
          </button>
        </div>
      </div>

      {/* 상품 목록 섹션 */}
      <div>
        <h2 className="text-xl font-bold mb-6 text-gray-900">
          진행 중인 프로젝트{" "}
          <span className="text-[#00cfcf]">{profile.products.length}</span>
        </h2>

        {profile.products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl text-gray-500">
            진행 중인 프로젝트가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {profile.products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => navigate(PATH.PRODUCT.DETAIL(product.id))}
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={product.thumbnailImageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                    {product.category.name}
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-[#00cfcf] transition-colors">
                    {product.title}
                  </h4>

                  <div className="space-y-1">
                    <div className="flex justify-between items-end">
                      <span className="text-[#00cfcf] font-bold text-sm">
                        {product.achievementRate}%
                      </span>
                      <span className="text-gray-400 text-xs">
                        {product.daysLeft}일 남음
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1">
                      <div
                        className="bg-[#00cfcf] h-1 rounded-full"
                        style={{
                          width: `${Math.min(product.achievementRate, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-right font-bold text-xs text-gray-900">
                      {product.currentAmount.toLocaleString()}원
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;
