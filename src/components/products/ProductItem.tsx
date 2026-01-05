import React from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../store/productSlice";
import { PATH } from "../../constants/path";

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const navigate = useNavigate();

  // 데이터가 없으면 렌더링하지 않음 (방어 코드)
  if (!product) {
    return null;
  }

  const achievePercentage = Math.floor(
    (product.currentAmount / product.goalAmount) * 100
  );

  const daysLeft = Math.max(
    Math.ceil(
      (new Date(product.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    ),
    0
  );

  const handleItemClick = () => {
    navigate(PATH.PRODUCT.DETAIL(product.id));
  };

  return (
    <div
      onClick={handleItemClick}
      className="border rounded-lg border-white overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer"
    >
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
        <p className="text-gray-500 text-sm">
          {product.seller?.nickname || product.seller?.name || "판매자"}
        </p>
      </div>
    </div>
  );
};

export default ProductItem;
