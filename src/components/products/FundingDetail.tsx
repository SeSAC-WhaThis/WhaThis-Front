import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../store/productSlice";
import { CiHeart } from "react-icons/ci";
import { PiHandsClappingLight } from "react-icons/pi";
import "bootstrap/dist/css/bootstrap.min.css";
import { Badge } from "reactstrap";
import { GiPresent } from "react-icons/gi";
import { PATH } from "../../constants/path";
import "./FundungDetail.css";

interface FundingDetailProps {
  product: Product;
}

const FundingDetail: React.FC<FundingDetailProps> = ({ product }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const achievePercentage = Math.floor(
    (product.currentAmount / product.goalAmount) * 100
  );

  const daysLeft = Math.max(
    Math.ceil(
      (new Date(product.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
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

  return (
    <div className="flex flex-col md:flex-row gap-12">
      {/* 왼쪽 이미지 */}
      <div className="w-full md:w-1/2 p-4">
        <img
          src={product.thumbnailImageUrl}
          alt={product.title}
          className="w-full h-auto object-cover aspect-video rounded-lg"
        />
        <div className="font-bold text-lg py-4">프로젝트 스토리</div>
        <div>
          <img
            src={product.storyImage} // 또는 storyImageUrl (API 응답에 따라 다름)
            alt="프로젝트 스토리"
            className="w-full h-auto object-cover aspect-video rounded-lg"
          />
        </div>
      </div>

      {/* 오른쪽 정보 */}
      <div className="w-full md:w-1/2 p-4 flex flex-col gap-3">
        <div className="text-sm font-medium text-gray-500 border-b border-gray-100 py-4">
          <span>
            {product.category?.name || "카테고리"} {">"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <GiPresent />
          <span className="text-gray-600 font-bold text-sm">
            {product.type || "펀딩"}
          </span>
        </div>
        <p className="text-lg font-bold text-gray-900">{product.title}</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          {product.description || "등록된 설명이 없습니다."}
        </p>

        <div className="flex justify-start items-end mt-2">
          <div>
            <span className="text-2xl font-bold text-[#00afaf]">
              {achievePercentage}%
            </span>
            <span className="text-sm text-[#00afaf] ml-1 pr-1">달성</span>
          </div>
          <Badge className="mint-badge ml-2">
            <div className="text-xs font-bold">{daysLeft}일 남음</div>
          </Badge>
        </div>

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
          <button className="w-16 h-16 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex flex-col items-center justify-center text-gray-400">
            <CiHeart size={28} />
            <span className="text-sm font-medium">{123}</span>
          </button>
          <button className="w-16 h-16 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex flex-col items-center justify-center text-gray-400">
            <PiHandsClappingLight size={28} />
            <span className="text-sm font-medium">{45}</span>
          </button>
          <button
            onClick={handleFundingClick}
            className="flex-1 bg-[#00cfcf] text-white rounded-md h-16 hover:bg-[#00afaf] transition-colors font-bold text-lg"
          >
            펀딩하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundingDetail;
