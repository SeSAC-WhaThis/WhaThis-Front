import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductList from "../../components/products/ProductList";
import { fetchFundingProducts } from "../../store/productSlice";
import type { RootState } from "../../store"; // store/index.ts에서 RootState 타입이 export 되어 있다고 가정
import type { ThunkDispatch } from "@reduxjs/toolkit"; // dispatch 타입 지정을 위해

const FundingPage: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  // productSlice에서 정의한 상태를 가져옵니다.
  // 주의: store/index.ts에 productReducer가 'products'라는 키로 등록되어 있어야 합니다.
  const { fundingProducts, isLoading } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchFundingProducts());
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
