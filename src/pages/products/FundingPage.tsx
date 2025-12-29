import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductList from "../../components/products/ProductList";
import { fetchProducts } from "../../store/productSlice";
import type { RootState } from "../../store"; // store/index.ts에서 RootState 타입이 export 되어 있다고 가정
import type { ThunkDispatch } from "@reduxjs/toolkit"; // dispatch 타입 지정을 위해

const FundingPage: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  // productSlice에서 정의한 상태를 가져옵니다.
  const { products, isLoading } = useSelector(
    (state: RootState) => state.products
  );

  // FUNDING 타입만 필터링
  const fundingProducts = products;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 border-b pb-4">펀딩+</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ProductList products={fundingProducts} />
      )}
    </div>
  );
};

export default FundingPage;
