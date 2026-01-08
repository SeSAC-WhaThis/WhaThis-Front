import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyProducts,
  fetchCategories,
  fetchProductDetail,
} from "../../store/productSlice";
import { PATH } from "../../constants/path";
import axiosInstance from "../../api/axiosInstance";
import type { RootState } from "../../store";
import type { ThunkDispatch } from "@reduxjs/toolkit";

interface Buyer {
  orderId: number;
  buyerNickname: string;
  buyerProfileImage: string | null;
  quantity: number;
  totalAmount: number;
}

const MyProjects = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const navigate = useNavigate();
  const { myProducts, isLoading, categories } = useSelector(
    (state: RootState) => state.products
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // 구매자 목록 모달 상태
  const [buyersList, setBuyersList] = useState<Buyer[]>([]);
  const [isBuyersModalOpen, setIsBuyersModalOpen] = useState(false);

  // 초기 상태
  const [editFormData, setEditFormData] = useState({
    brn: "",
    title: "",
    description: "",
    categoryId: 0,
    price: "",
    goalAmount: "",
    inventory: 0,
    startDate: "",
    endDate: "",
  });

  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [storyImage, setStoryImage] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [storyPreview, setStoryPreview] = useState<string | null>(null);

  const handleFetchBuyers = async (productId: number) => {
    try {
      const response = await axiosInstance.get(`/orders/buyers/${productId}`);
      if (response.data.success) {
        setBuyersList(response.data.data);
        setIsBuyersModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch buyers:", error);
      alert("구매자 목록을 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    dispatch(fetchMyProducts());
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const handleCardClick = async (productSummary: any) => {
    try {
      const action = await dispatch(fetchProductDetail(productSummary.id));
      
      if (fetchProductDetail.fulfilled.match(action)) {
        const product = action.payload;
        setSelectedProduct(product);
        setEditFormData({
          brn: user?.brn || product.brn || "",
          title: product.title,
          description: product.description || "",
          categoryId: product.category?.id || 0,
          price: product.price ? product.price.toLocaleString() : "",
          goalAmount: product.goalAmount ? product.goalAmount.toLocaleString() : "",
          inventory: product.inventory || 0,
          startDate: product.startDate ? product.startDate.split("T")[0] : "",
          endDate: product.endDate ? product.endDate.split("T")[0] : "",
        });
        setThumbnailPreview(product.thumbnailImageUrl || null);
        setStoryPreview(product.storyImageUrl || null);
        setThumbnailImage(null);
        setStoryImage(null);
        setIsEditModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch product detail:", error);
      alert("상품 정보를 불러오는데 실패했습니다.");
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "price" || name === "goalAmount") {
      const numValue = value.replace(/,/g, "");
      if (value === "" || !isNaN(Number(numValue))) {
        setEditFormData((prev) => ({
          ...prev,
          [name]: numValue ? Number(numValue).toLocaleString() : "",
        }));
      }
    } else {
      setEditFormData((prev) => ({
        ...prev,
        [name]:
          name === "categoryId" || name === "inventory" ? Number(value) : value,
      }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const formData = new FormData();
    formData.append("brn", editFormData.brn);
    formData.append("title", editFormData.title);
    formData.append("description", editFormData.description);
    formData.append("categoryId", String(editFormData.categoryId));
    formData.append("price", editFormData.price.replace(/,/g, ""));
    formData.append("goalAmount", editFormData.goalAmount.replace(/,/g, ""));
    formData.append("inventory", String(editFormData.inventory));
    formData.append("startDate", `${editFormData.startDate}T00:00:00`);
    formData.append("endDate", `${editFormData.endDate}T23:59:59`);

    // 파일이 있을 경우에만 전송 (수정 시)
    if (thumbnailImage) {
      formData.append("thumbnailImageUrl", thumbnailImage);
    }

    if (storyImage) {
      formData.append("storyImageUrl", storyImage);
    }

    try {
      const response = await axiosInstance.post(
        `/products/${selectedProduct.id}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.data.success) {
        alert("프로젝트 정보가 수정되었습니다.");
        setIsEditModalOpen(false);
        dispatch(fetchMyProducts());
      }
    } catch (error) {
      console.error("프로젝트 수정 실패:", error);
      // alert는 axiosInstance 인터셉터에서 처리될 수 있음
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    if (
      window.confirm(
        "정말로 이 프로젝트를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
      )
    ) {
      try {
        const response = await axiosInstance.delete(
          `/products/${selectedProduct.id}`
        );
        if (response.status === 204 || response.status === 200) {
          alert("프로젝트가 삭제되었습니다.");
          setIsEditModalOpen(false);
          dispatch(fetchMyProducts());
        }
      } catch (error) {
        console.error("프로젝트 삭제 실패:", error);
        alert("프로젝트 삭제에 실패했습니다.");
      }
    }
  };

  const getDaysLeft = (endDateStr: string) => {
    const end = new Date(endDateStr).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const renderStatusBadge = (product: any) => {
    const now = new Date().getTime();
    const start = new Date(product.startDate).getTime();
    const end = new Date(product.endDate).getTime();
    const isSuccess = product.currentAmount >= product.goalAmount;

    let text = "";
    let styles = "";

    if (now < start) {
      text = "공개 예정";
      styles = "bg-yellow-100 text-yellow-700";
    } else if (now > end) {
      if (isSuccess) {
        text = "펀딩 성공";
        styles = "bg-green-100 text-green-700";
      } else {
        text = "펀딩 실패";
        styles = "bg-gray-100 text-gray-600";
      }
    } else {
      text = "진행중";
      styles = "bg-blue-100 text-blue-700";
    }

    return (
      <span className={`px-2 py-0.5 rounded text-xs font-bold ${styles}`}>
        {text}
      </span>
    );
  };

  if (isLoading && myProducts.length === 0)
    return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold">내가 만든 프로젝트</h2>
        <button
          onClick={() => navigate(PATH.PRODUCT.CREATE)}
          className="px-6 py-2 bg-[#00cfcf] text-white rounded-lg hover:bg-[#00afaf] transition-colors font-bold text-sm"
        >
          프로젝트 만들기
        </button>
      </div>

      {myProducts.length === 0 ? (
        <div className="text-gray-500 py-8 text-center">
          생성한 프로젝트가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myProducts.map((product) => {
            const achieveRate = Math.floor(
              (product.currentAmount / product.goalAmount) * 100
            );
            const daysLeft = getDaysLeft(product.endDate);

            const isUpcoming =
              new Date().getTime() < new Date(product.startDate).getTime();

            return (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-xs text-gray-500">
                      {product.category?.name || "카테고리"}
                    </div>
                    {renderStatusBadge(product)}
                  </div>
                  <div className="flex gap-4 mb-4">
                    <img
                      src={
                        product.thumbnailImageUrl?.startsWith("http")
                          ? product.thumbnailImageUrl
                          : `http://localhost:8080${product.thumbnailImageUrl}`
                      }
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded-md flex-shrink-0 bg-gray-100"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="text-sm text-gray-500 mb-1">
                        목표금액: {product.goalAmount.toLocaleString()}원
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-xl font-bold text-[#00cfcf]">
                          {achieveRate}%
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {product.currentAmount.toLocaleString()}원 달성
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-2 pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    {daysLeft > 0 ? (
                      <span className="text-red-500 font-bold">
                        {daysLeft}일 남음
                      </span>
                    ) : (
                      <span className="text-gray-400">종료됨</span>
                    )}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => isUpcoming && handleCardClick(product)}
                      disabled={!isUpcoming}
                      className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                        isUpcoming
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : "bg-gray-50 text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleFetchBuyers(product.id)}
                      className="px-3 py-1 bg-[#00cfcf] text-white rounded-lg text-xs hover:bg-[#00afaf] transition-colors"
                    >
                      펀딩유저
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 수정 모달 */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">
              프로젝트 수정
            </h3>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              {/* 사업자등록번호 - 읽기 전용으로 표시 (자동 입력) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  사업자등록번호
                </label>
                <input
                  type="text"
                  name="brn"
                  value={editFormData.brn}
                  readOnly // user 정보에서 가져오므로 수정 불가하게? 또는 수정 가능하게? "User의 brn이라는 컬럼에 남겨져있어" implies it comes from user.
                  // If user can edit it, remove readOnly. Assuming it's auto-filled but editable or fixed.
                  // I'll make it editable for now in case they need to correct it, but pre-filled.
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00cfcf]"
                />
              </div>

              {/* 프로젝트명 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  프로젝트명
                </label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00cfcf]"
                  required
                />
              </div>

              {/* 카테고리 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  카테고리
                </label>
                <select
                  name="categoryId"
                  value={editFormData.categoryId}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00cfcf]"
                  required
                >
                  <option value={0}>카테고리 선택</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 가격 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  가격
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#00cfcf]"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    원
                  </span>
                </div>
              </div>

              {/* 목표 금액 & 재고 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    목표 금액
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="goalAmount"
                      value={editFormData.goalAmount}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#00cfcf]"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      원
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    재고
                  </label>
                  <input
                    type="number"
                    name="inventory"
                    value={editFormData.inventory}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00cfcf]"
                    required
                  />
                </div>
              </div>

              {/* 시작일 & 종료일 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    펀딩 시작일
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={editFormData.startDate}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00cfcf]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    펀딩 종료일
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={editFormData.endDate}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00cfcf]"
                    required
                  />
                </div>
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00cfcf] resize-none h-32"
                />
              </div>

              {/* 이미지 업로드 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    대표 이미지
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(
                        e,
                        setThumbnailImage,
                        setThumbnailPreview
                      )
                    }
                    className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-[#e7f9f9] file:text-[#00cfcf] hover:file:bg-[#d0f0f0] cursor-pointer"
                  />
                  {thumbnailPreview && (
                    <img
                      src={
                        thumbnailPreview.startsWith("/")
                          ? `http://localhost:8080${thumbnailPreview}`
                          : thumbnailPreview
                      }
                      alt="미리보기"
                      className="mt-2 w-full h-32 object-cover rounded border"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    스토리 이미지
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(e, setStoryImage, setStoryPreview)
                    }
                    className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-[#e7f9f9] file:text-[#00cfcf] hover:file:bg-[#d0f0f0] cursor-pointer"
                  />
                  {storyPreview && (
                    <img
                      src={
                        storyPreview.startsWith("blob:") ||
                        storyPreview.startsWith("http")
                          ? storyPreview
                          : `http://localhost:8080${storyPreview}`
                      }
                      alt="미리보기"
                      className="mt-2 w-full h-32 object-cover rounded border"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleDeleteProduct}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
                >
                  프로젝트 삭제
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00cfcf] text-white rounded-lg hover:bg-[#00afaf] font-bold transition-colors"
                  >
                    수정 완료
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 실구매자 목록 모달 */}
      {isBuyersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">실구매자 목록</h3>
              <button
                onClick={() => setIsBuyersModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {buyersList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                아직 구매자가 없습니다.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {buyersList.map((buyer) => (
                  <li
                    key={buyer.orderId}
                    className="py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        {buyer.buyerProfileImage ? (
                          <img
                            src={buyer.buyerProfileImage}
                            alt={buyer.buyerNickname}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">
                          {buyer.buyerNickname}
                        </div>
                        <div className="text-xs text-gray-500">
                          주문번호: {buyer.orderId}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#00cfcf]">
                        {buyer.totalAmount.toLocaleString()}원
                      </div>
                      <div className="text-xs text-gray-500">
                        {buyer.quantity}개 구매
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsBuyersModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjects;
