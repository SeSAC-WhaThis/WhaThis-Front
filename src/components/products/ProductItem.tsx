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

  const now = new Date();
  const startDate = new Date(product.startDate);
  const endDate = new Date(product.endDate);

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

  let statusBadge = null;
  if (now < startDate) {
    statusBadge = (
      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
        준비중
      </div>
    );
  } else if (now > endDate) {
    statusBadge = (
      <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
        종료
      </div>
    );
  } else {
    statusBadge = (
      <div className="absolute top-2 right-2 bg-[#00cfcf] text-white text-xs font-bold px-2 py-1 rounded z-10">
        진행중
      </div>
    );
  }

  return (
    <div
      onClick={handleItemClick}
      className="relative border rounded-lg border-white overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer"
    >
      {statusBadge}
      <img
        src={product.thumbnailImageUrl}
        alt={product.title}
        className="w-full h-46 object-cover"
      />

      <div className="pt-3 pl-2 pr-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#00cfcf] font-bold text-lg">
            {achievePercentage}% 달성
          </span>
          <span className="text-gray-500 text-sm font-medium">
            {daysLeft}일 남음
          </span>
        </div>

        <h5 className="text-lg font-bold truncate mb-1">{product.title}</h5>
        <p className="text-gray-500 text-sm">
          {product.seller?.nickname || product.seller?.name || "판매자"}
        </p>
      </div>
    </div>
  );
};

export default ProductItem;
