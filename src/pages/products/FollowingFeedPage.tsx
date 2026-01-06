import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { PATH } from "../../constants/path";
import defaultavatar from "../../assets/icons/defaultavatar.png";
import { CiHeart } from "react-icons/ci";
import { PiHandsClappingLight } from "react-icons/pi";

interface Seller {
  id: number;
  email: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  address: string;
  profileImageUrl: string | null;
  brn: string | null;
}

interface Category {
  id: number;
  name: string;
}

interface FeedProduct {
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
  viewCount: number;
  thumbnailImageUrl: string;
  seller: Seller;
  category: Category;
  daysLeft: number;
  createdAt: string;
}

const FollowingFeedPage: React.FC = () => {
  const [products, setProducts] = useState<FeedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await axiosInstance.get("/follows/products");
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error("피드 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-[470px] mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 px-4">피드</h1>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white rounded-lg border border-gray-100 mx-4">
          <p className="text-lg font-bold mb-2">새로운 소식이 없습니다.</p>
          <p>
            관심 있는 판매자를 팔로우하여
            <br />
            새로운 프로젝트 소식을 받아보세요!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() =>
                    navigate(PATH.AUTH.SELLER_PROFILE(product.seller.id))
                  }
                >
                  <img
                    src={product.seller.profileImageUrl || defaultavatar}
                    alt={product.seller.nickname}
                    className="w-8 h-8 rounded-full object-cover border border-gray-100"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = defaultavatar;
                    }}
                  />
                  <div>
                    <div className="font-bold text-sm text-gray-900 leading-none">
                      {product.seller.nickname}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {product.category.name}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div
                className="relative aspect-square cursor-pointer bg-gray-100"
                onClick={() => navigate(PATH.PRODUCT.DETAIL(product.id))}
              >
                {(() => {
                  const now = new Date();
                  const startDate = new Date(product.startDate);
                  const endDate = new Date(product.endDate);

                  if (now < startDate) {
                    return (
                      <div className="absolute top-3 right-3 z-10 bg-yellow-500 text-white text-xs px-2 py-1 rounded font-bold">
                        준비중
                      </div>
                    );
                  } else if (now > endDate) {
                    return (
                      <div className="absolute top-3 right-3 z-10 bg-gray-500 text-white text-xs px-2 py-1 rounded font-bold">
                        종료
                      </div>
                    );
                  } else {
                    return (
                      <div className="absolute top-3 right-3 z-10 bg-[#00cfcf] text-white text-xs px-2 py-1 rounded font-bold">
                        진행중
                      </div>
                    );
                  }
                })()}
                <img
                  src={product.thumbnailImageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Action Buttons */}
              <div className="p-3 pb-0 flex gap-4">
                <button className="text-gray-800 hover:text-red-500 transition-colors">
                  <CiHeart size={28} />
                </button>
                <button className="text-gray-800 hover:text-blue-500 transition-colors">
                  <PiHandsClappingLight size={28} />
                </button>
              </div>

              {/* Content */}
              <div className="p-3">
                <div className="font-bold text-sm mb-1">
                  {product.buyerCount}명이 참여중
                </div>

                <div className="mb-2">
                  <span
                    className="font-bold text-sm mr-2 cursor-pointer hover:underline"
                    onClick={() =>
                      navigate(PATH.AUTH.SELLER_PROFILE(product.seller.id))
                    }
                  >
                    {product.seller.nickname}
                  </span>
                  <span className="text-sm text-gray-800">{product.title}</span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {product.description}
                </p>

                {/* Funding Info */}
                <div className="bg-gray-50 p-3 rounded-lg mt-2 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">달성률</span>
                    <span className="font-bold text-[#00cfcf]">
                      {product.achievementRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-[#00cfcf] h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(product.achievementRate, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">남은 기간</span>
                    <span className="font-bold text-gray-800">
                      {product.daysLeft}일
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-400 mt-3 uppercase">
                  {new Date(product.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowingFeedPage;
