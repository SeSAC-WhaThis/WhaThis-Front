import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductList from "../../components/products/ProductList";
import {
  fetchProducts,
  searchProductsAi,
  fetchCategories,
} from "../../store/productSlice";
import type { RootState } from "../../store"; // store/index.ts에서 RootState 타입이 export 되어 있다고 가정
import type { ThunkDispatch } from "@reduxjs/toolkit"; // dispatch 타입 지정을 위해
import { useSearchParams, useNavigate } from "react-router-dom";
import { PATH } from "../../constants/path";

const FundingPage: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const navigate = useNavigate();
  // productSlice에서 정의한 상태를 가져옵니다.
  const { products, categories, isLoading } = useSelector(
    (state: RootState) => state.products
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  // URL 쿼리 q 읽기
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim();
  const categoryId = searchParams.get("category_id");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (q) {
      dispatch(searchProductsAi(q));
    } else {
      dispatch(fetchProducts(categoryId ? Number(categoryId) : undefined));
    }
  }, [dispatch, q, categoryId]);

  const handleCategoryClick = (catId: number) => {
    navigate(`${PATH.PRODUCT.FUNDINGPAGE}?category_id=${catId}`);
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 카테고리 버튼 목록 */}
      <div className="relative flex items-center mb-16 border-b border-gray-200">
        <button
          onClick={handleScrollLeft}
          className="absolute -left-8 z-10 w-16 h-16 flex items-center justify-center text-gray-600 rounded-full hover:text-black transition-colors"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,1) 25%, rgba(255,255,255,0) 100%)",
          }}
          aria-label="처음으로"
        >
          &lt;
        </button>
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide flex-nowrap px-12 w-full"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`py-6 px-[10px] bg-white text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 border-b-2 ${
                categoryId && Number(categoryId) === category.id
                  ? "border-black text-black font-bold"
                  : "border-transparent text-gray-700 hover:border-black"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        <button
          onClick={handleScrollRight}
          className="absolute -right-8 z-10 w-16 h-16 flex items-center justify-center text-gray-600 rounded-full hover:text-black transition-colors"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,1) 25%, rgba(255,255,255,0) 100%)",
          }}
          aria-label="끝으로"
        >
          &gt;
        </button>
      </div>
      {isLoading ? <div>Loading...</div> : <ProductList products={products} />}
    </div>
  );
};

export default FundingPage;
