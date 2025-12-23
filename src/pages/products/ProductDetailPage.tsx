import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductDetail } from "../../store/productSlice";
import type { RootState } from "../../store";
import type { ThunkDispatch } from "@reduxjs/toolkit";
import FundingDetail from "../../components/products/FundingDetail";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { selectedProduct, isLoading } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetail(Number(productId)));
    }
  }, [dispatch, productId]);

  if (isLoading) return <div>Loading...</div>;
  if (!selectedProduct) return <div>상품을 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <FundingDetail product={selectedProduct} />
    </div>
  );
};

export default ProductDetailPage;
