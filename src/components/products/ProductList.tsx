import React from "react";
import { Product } from "../../store/productSlice";
import ProductItem from "./ProductItem";

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  // products가 배열인지 확인 (API 응답이 올바르지 않을 경우 대비)
  const safeProducts = Array.isArray(products) ? products : [];

  if (safeProducts.length === 0) {
    return (
      <div className="text-center w-full py-10 text-gray-500">
        등록된 상품이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {safeProducts.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
