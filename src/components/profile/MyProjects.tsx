import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProducts } from "../../store/productSlice";
import ProductList from "../products/ProductList";
import { PATH } from "../../constants/path";
import type { RootState } from "../../store";
import type { ThunkDispatch } from "@reduxjs/toolkit";

const MyProjects = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const navigate = useNavigate();
  const { myProducts, isLoading } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchMyProducts());
  }, [dispatch]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold">내가 만든 프로젝트</h2>
        <button
          onClick={() => navigate(PATH.PRODUCT.CREATE)}
          className="px-6 py-2 bg-[#00cfcf] text-white rounded-md hover:bg-[#00afaf] transition-colors font-bold"
        >
          프로젝트 만들기
        </button>
      </div>
      {isLoading && myProducts.length === 0 ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <ProductList products={myProducts} />
      )}
    </div>
  );
};

export default MyProjects;
