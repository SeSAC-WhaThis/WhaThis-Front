import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../store/productSlice";
import { PATH } from "../../constants/path";

interface MainBannerProps {
  products: Product[];
}

const MainBanner: React.FC<MainBannerProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // 전체 상품 중 앞에서 5개만 추림
  const bannerProducts = products.slice(0, 5);

  useEffect(() => {
    if (bannerProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerProducts.length);
    }, 4000); // 4초마다 전환
    return () => clearInterval(interval);
  }, [bannerProducts.length]);

  if (bannerProducts.length === 0) return null;

  return (
    <div className="w-full h-[300px] md:h-[400px] relative overflow-hidden bg-gray-100">
      {bannerProducts.map((product, index) => (
        <div
          key={product.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out cursor-pointer ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          onClick={() => navigate(PATH.PRODUCT.DETAIL(product.id))}
        >
          <img
            src={product.thumbnailImageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {/* 좌측 하단 타이틀 (가독성을 위한 그라데이션 배경 포함) */}
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/70 to-transparent">
            <h2 className="text-white text-2xl md:text-4xl font-bold drop-shadow-md">
              {product.title}
            </h2>
          </div>
        </div>
      ))}

      {/* 인디케이터 */}
      <div className="absolute bottom-6 right-6 flex gap-3 z-20">
        {bannerProducts.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex
                ? "bg-[#00cfcf]"
                : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MainBanner;
