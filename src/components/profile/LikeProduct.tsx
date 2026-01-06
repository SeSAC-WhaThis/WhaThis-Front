import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLikedProducts } from "../../store/productSlice";
import ProductList from "../products/ProductList";
import type { RootState } from "../../store";
import type { ThunkDispatch } from "@reduxjs/toolkit";

const LikeProduct: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { likedProducts, isLoading } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchLikedProducts());
  }, [dispatch]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 border-b pb-4">
        좋아요 누른 상품
      </h2>
      {isLoading && likedProducts.length === 0 ? (
        <div className="text-center py-8">Loading...</div>
      ) : likedProducts.length > 0 ? (
        <ProductList products={likedProducts} />
      ) : (
        <div className="text-gray-500 py-8 text-center">
          좋아요를 누른 상품이 없습니다.
        </div>
      )}
    </div>
  );
};

export default LikeProduct;
