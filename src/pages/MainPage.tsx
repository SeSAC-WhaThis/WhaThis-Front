import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainBanner from "../components/common/MainBanner";
import ProductList from "../components/products/ProductList";
import { fetchProducts } from "../store/productSlice";
import type { RootState } from "../store";
import type { ThunkDispatch } from "@reduxjs/toolkit";

const MainPage: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { products, isLoading } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 my-8 border-t border-gray-200 pt-8 flex flex-col md:flex-row gap-y-8">
      {/* 메인 영역 (왼쪽 3/4) */}
      <main className="w-full md:flex-1 flex flex-col gap-10 md:border-r border-gray-200 md:pr-8">
        {/* 메인 배너 */}
        <section>
          <MainBanner products={products} />
        </section>

        {/* 상품 목록 */}
        <section>
          {isLoading ? (
            <div className="text-center py-20">Loading...</div>
          ) : (
            <ProductList products={products} />
          )}
        </section>
      </main>

      {/* 사이드 영역 (오른쪽 1/4) */}
      <aside className="w-full md:w-1/4 bg-gray-50 p-2 rounded-xl h-fit md:ml-8">
        <h3 className="text-xl font-bold mb-4">Sidebar</h3>
        <div className="space-y-4 text-gray-600">
          <div className="h-40 bg-gray-200 rounded flex items-center justify-center">
            인기상품 출력 영역
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MainPage;
