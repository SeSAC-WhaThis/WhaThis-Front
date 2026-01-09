import React, { useEffect } from "react";
import ProductList from "../../components/products/ProductList";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, resetProducts } from "../../store/productSlice";
import type { RootState } from "../../store";
import type { ThunkDispatch } from "@reduxjs/toolkit";

const PreorderPage: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { products, isLoading } = useSelector(
    (state: RootState) => state.products
  );

  // PRE_ORDER 타입만 필터링
  const preOrderProducts = products;

  useEffect(() => {
    dispatch(resetProducts());
    dispatch(fetchProducts({ page: 0, size: 12 }));
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 border-b pb-4">프리오더</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ProductList products={preOrderProducts} />
      )}
    </div>
  );
};

export default PreorderPage;
