import React from "react";
import { Product } from "../../store/productSlice";
import { CiHeart } from "react-icons/ci";
import { PiHandsClappingLight } from "react-icons/pi";
import "bootstrap/dist/css/bootstrap.min.css";
import { Badge } from "reactstrap";
import { GiPresent } from "react-icons/gi";
import "./FundungDetail.css";

interface FundingDetailProps {
  product: Product;
}

const FundingDetail: React.FC<FundingDetailProps> = ({ product }) => {
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
            src={product.storyImage}
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
            {product.category}
            {">"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <GiPresent />
          <span className="text-gray-600 font-bold text-sm">
            {product.type || "펀딩"}
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

        {/* 버튼 그룹 */}
        <div className="flex gap-3 mt-4">
          <button className="w-16 h-16 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors flex flex-col items-center justify-center text-gray-400">
            <CiHeart size={28} />
            <span className="text-sm font-medium">{123}</span>
          </button>
          <button className="w-16 h-16 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors flex flex-col items-center justify-center text-gray-400">
            <PiHandsClappingLight size={28} />
            <span className="text-sm font-medium">{45}</span>
          </button>
          <button className="flex-1 bg-[#00cfcf] text-white rounded-md h-16 hover:bg-[#00afaf] transition-colors font-bold text-lg">
            펀딩하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundingDetail;
