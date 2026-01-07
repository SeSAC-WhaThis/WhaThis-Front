import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MainBanner from "../components/common/MainBanner";
import ProductList from "../components/products/ProductList";
import { fetchProducts, fetchCategories } from "../store/productSlice";
import type { RootState } from "../store";
import type { ThunkDispatch } from "@reduxjs/toolkit";
import { PATH } from "../constants/path";

const MainPage: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const navigate = useNavigate();
  const { products, categories, isLoading } = useSelector(
    (state: RootState) => state.products
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // 인기 상품 정렬 (좋아요 순)
  const popularProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
      .slice(0, 5);
  }, [products]);

  const handleCategoryClick = (categoryId: number) => {
    navigate(`${PATH.PRODUCT.FUNDINGPAGE}?category_id=${categoryId}`);
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
    <div className="container mx-auto px-4 my-8">
      {/* 카테고리 버튼 목록 */}
      <div className="relative flex items-center mb-8 border-b border-gray-200">
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
              className="py-6 px-[10px] bg-white text-gray-700 text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 border-b-2 border-transparent hover:border-black"
            >
              {category.name}
            </button>
          ))}
        </div>
        <button
          onClick={handleScrollRight}
          className="absolute -right-8 z-10 w-16 h-12 flex items-center justify-center text-gray-600 rounded-full hover:text-black transition-colors"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,1) 25%, rgba(255,255,255,0) 100%)",
          }}
          aria-label="끝으로"
        >
          &gt;
        </button>
      </div>

      <div className="pt-8 flex flex-col md:flex-row gap-y-8">
        {/* 메인 영역 (왼쪽 3/4) */}
        <main className="w-full md:flex-1 flex flex-col gap-10 md:border-r border-gray-200 md:pr-8">
          {/* 메인 배너 */}
          <section>
            {isLoading ? (
              <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-xl flex items-center">
                <div className="px-8 md:px-12 w-full">
                  <div className="h-10 md:h-14 bg-gray-200 rounded-md w-3/4 mb-4" />
                  <div className="h-5 md:h-6 bg-gray-200 rounded-md w-1/2 mb-8" />
                  <div className="h-12 w-40 bg-gray-200 rounded-md" />
                </div>
              </div>
            ) : (
              <MainBanner products={products} />
            )}
          </section>

          {/* 상품 목록 */}
          <section>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-3" />
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductList products={products} />
            )}
          </section>
        </main>

        {/* 사이드 영역 (오른쪽 1/4) */}
        <aside className="w-full md:w-1/4 bg-white p-4 rounded-xl h-fit md:ml-8 border border-gray-100">
          <h3 className="text-xl font-bold mb-4">인기 프로젝트</h3>
          <div className="flex flex-col gap-4">
            {isLoading
              ? // 스켈레톤 UI
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-start animate-pulse"
                  >
                    <div className="w-20 h-14 bg-gray-200 rounded flex-shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                ))
              : popularProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex gap-3 cursor-pointer group items-start"
                    onClick={() => navigate(PATH.PRODUCT.DETAIL(product.id))}
                  >
                    {/* 썸네일 (좌측) */}
                    <div className="w-20 h-14 flex-shrink-0 rounded overflow-hidden relative bg-gray-200">
                      <img
                        src={product.thumbnailImageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-0 left-0 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-br font-bold">
                        {index + 1}
                      </div>
                    </div>

                    {/* 타이틀 (우측) */}
                    <div className="flex-1 min-w-0">
                      <h6 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#00cfcf] transition-colors leading-tight">
                        {product.title}
                      </h6>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="text-[#00cfcf] font-bold text-[16px]">
                          {Math.floor(
                            (product.currentAmount / product.goalAmount) * 100
                          )}
                          % 달성
                        </span>
                        <span className="text-red-400">
                          ♥ {product.likeCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MainPage;
