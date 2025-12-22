import React from "react";
import { Product } from "../../store/productSlice";

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const achievePercentage = Math.floor(
    (product.currentAmount / product.goalAmount) * 100
  );

  const daysLeft = Math.max(
    Math.ceil(
      (new Date(product.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    ),
    0
  );

  return (
    <div className="border rounded-lg border-white overflow-hidden shadow-lg hover:scale-105 transition-transform">
      <img
        src={product.thumbnailImageUrl}
        alt={product.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-blue-600 font-bold text-lg">
            {achievePercentage}% 달성
          </span>
          <span className="text-gray-500 text-sm font-medium">
            {daysLeft}일 남음
          </span>
        </div>

        <h3 className="text-lg font-bold truncate mb-1">{product.title}</h3>
        <p className="text-gray-500 text-sm">{product.seller}</p>
      </div>
    </div>
  );
};

export default ProductItem;
