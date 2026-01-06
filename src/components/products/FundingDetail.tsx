import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../store/productSlice";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Badge } from "reactstrap";
import "./FundungDetail.css";
import defaultavatar from "../../assets/icons/defaultavatar.png";
import { PATH } from "../../constants/path";
import axiosInstance from "../../api/axiosInstance";

interface FundingDetailProps {
  product: Product;
}

const FundingDetail: React.FC<FundingDetailProps> = ({ product }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [likeCount, setLikeCount] = useState(product.likeCount || 0);
  const [isLiked, setIsLiked] = useState(product.isLiked || false);

  // 달성률 계산
  const achievePercentage = Math.floor(
    ((product.currentAmount || 0) / (product.goalAmount || 1)) * 100
  );

  // 남은 기한 계산
  const daysLeft = Math.max(
    Math.ceil(
      (new Date(product.endDate || Date.now()).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    ),
    0
  );

  const handleFundingClick = () => {
    navigate(PATH.PRODUCT.ORDER, {
      state: {
        productId: product.id,
        productTitle: product.title,
        quantity: quantity,
        price: product.price,
        thumbnailImageUrl: product.thumbnailImageUrl,
      },
    });
  };

  const handleLikeClick = async () => {
    try {
      if (isLiked) {
        await axiosInstance.delete(`/products/${product.id}/like`);
        setLikeCount((prev) => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        await axiosInstance.post(`/products/${product.id}/like`);
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("좋아요 요청 실패:", error);
    }
  };

  // 판매자 정보 처리
  const sellerName =
    typeof product.seller === "object" && product.seller !== null
      ? (product.seller as any).nickname
      : product.seller;
  const sellerImage =
    typeof product.seller === "object" && product.seller !== null
      ? (product.seller as any).profileImageUrl
      : null;
  const sellerId =
    typeof product.seller === "object" && product.seller !== null
      ? (product.seller as any).id
      : 999; // 더미 데이터인 경우 임의의 ID 사용

  return (
    <div className="flex flex-col md:flex-row gap-12">
      {/* 왼쪽: 썸네일 이미지 */}
      <div className="w-full md:w-1/1 p-4">
        <img
          src={product.thumbnailImageUrl}
          alt={product.title}
          className="w-full h-auto object-cover aspect-video"
        />

        <div className="font-bold text-lg py-4">프로젝트 스토리</div>
        <div>
          <img
            src={product.storyImageUrl}
            alt="프로젝트 스토리"
            className="w-full h-auto object-cover aspect-video"
          />
        </div>
      </div>

      {/* 오른쪽 (사이드바 쪽): 정보 및 버튼 */}
      <div className="w-full md:w-1/2 p-4 flex flex-col gap-3">
        {/* 카테고리 & 타입 */}
        <div className="text-sm font-medium text-gray-500 border-b border-gray-100 py-2b-4 py-4">
          <span className="">
            {typeof product.category === "object" && product.category !== null
              ? (product.category as any).name
              : product.category}
            {">"}
          </span>
        </div>
        {/* 타이틀 */}
        <p className="text-lg font-bold text-gray-900">{product.title}</p>

        {/* 설명 */}
        <p className="text-sm text-gray-600 leading-relaxed">
          {product.description || "등록된 설명이 없습니다."}
        </p>

        {/* 달성률 & 남은 기한 */}
        <div className="flex justify-start items-end">
          <div>
            <span className="text-2xl font-bold text-[#00afaf]">
              {achievePercentage}%
            </span>
            <span className="text-sm text-[#00afaf] ml-1 pr-1">달성</span>
          </div>
          <Badge className="mint-badge">
            <div className="text-xs font-bold">{daysLeft}일 남음</div>
          </Badge>
        </div>

        {/* 현재 금액 */}
        <div className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">
          {(product.currentAmount || 0).toLocaleString()}
          <span className="text-sm font-normal text-gray-900">원 달성</span>
        </div>

        {/* 수량 선택 */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <span className="font-bold text-gray-700">수량 선택</span>
          <div className="flex items-center border border-gray-300 rounded">
            <button
              className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              -
            </button>
            <span className="px-4 font-bold text-gray-800">{quantity}</span>
            <button
              className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center py-2 text-lg font-bold">
          <span>총 펀딩 금액</span>
          <span className="text-[#00cfcf]">
            {((product.price || 0) * quantity).toLocaleString()}원
          </span>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleLikeClick}
            className={`w-16 h-16 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors flex flex-col items-center justify-center ${
              isLiked
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            {isLiked ? <FaHeart size={28} /> : <CiHeart size={28} />}
            <span className="text-sm font-medium">{likeCount}</span>
          </button>
          <button
            className="flex-1 bg-[#00cfcf] text-white rounded-md h-16 hover:bg-[#00afaf] transition-colors font-bold text-lg"
            onClick={handleFundingClick}
          >
            펀딩하기
          </button>
        </div>

        {/* 판매자 프로필 섹션 */}
        <div
          className="flex items-center gap-4 mt-6 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => navigate(PATH.AUTH.SELLER_PROFILE(sellerId))}
        >
          <img
            src={sellerImage || defaultavatar}
            alt="판매자 프로필"
            className="w-12 h-12 rounded-full object-cover border border-gray-100"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = defaultavatar;
            }}
          />
          <div>
            <div className="text-xs text-gray-500 mb-0.5">판매자</div>
            <div className="font-bold text-gray-900">{sellerName}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingDetail;
