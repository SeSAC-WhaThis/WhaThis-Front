import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useBlocker } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createProduct, fetchCategories } from "../../store/productSlice";
import type { RootState } from "../../store";
import type { ThunkDispatch } from "@reduxjs/toolkit";
import { PATH } from "../../constants/path";

const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  // 입력 상태 관리
  const [brn, setBrn] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [price, setPrice] = useState<string>("");
  const [goalAmount, setGoalAmount] = useState<string>("");
  const [inventory, setInventory] = useState<number | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [storyImage, setStoryImage] = useState<File | null>(null);

  // 제출 완료 여부 (제출 성공 시에는 블로킹하지 않기 위함)
  const isSubmittedRef = useRef(false);

  // 이미지 미리보기 상태
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [storyPreview, setStoryPreview] = useState<string | null>(null);

  // 에러 상태 관리
  const [errors, setErrors] = useState({
    brn: "",
    title: "",
    description: "",
    categoryId: "",
    price: "",
    goalAmount: "",
    inventory: "",
    startDate: "",
    endDate: "",
    thumbnailImageUrl: "",
    storyImageUrl: "",
  });

  // Redux 상태
  const {
    categories,
    isLoading,
    error: apiError,
  } = useSelector((state: RootState) => state.products);

  // Redux에 저장된 카테고리 데이터 확인
  console.log("Component categories state:", categories);

  // 카테고리 목록 가져오기
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // 파일 선택 핸들러
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

  // 사업자등록번호 포맷팅 핸들러 (XXX-XX-XXXXX)
  const handleBrnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    let formattedValue = "";

    if (value.length <= 3) {
      formattedValue = value;
    } else if (value.length <= 5) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(
        5,
        10
      )}`;
    }
    setBrn(formattedValue);
  };

  // 가격 입력 핸들러 (천 단위 콤마)
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (value === "") {
      setPrice("");
      return;
    }
    if (!isNaN(Number(value))) {
      setPrice(Number(value).toLocaleString());
    }
  };

  // 목표 금액 입력 핸들러 (천 단위 콤마)
  const handleGoalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (value === "") {
      setGoalAmount("");
      return;
    }
    if (!isNaN(Number(value))) {
      setGoalAmount(Number(value).toLocaleString());
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      brn: "",
      title: "",
      description: "",
      categoryId: "",
      price: "",
      goalAmount: "",
      inventory: "",
      startDate: "",
      endDate: "",
      thumbnailImageUrl: "",
      storyImageUrl: "",
    };

    if (!brn.trim()) {
      newErrors.brn = "사업자등록번호를 입력해주세요.";
      isValid = false;
    }

    if (!title.trim()) {
      newErrors.title = "프로젝트 이름을 입력해주세요.";
      isValid = false;
    }

    if (!categoryId) {
      newErrors.categoryId = "카테고리를 선택해주세요.";
      isValid = false;
    }

    const priceAmount = Number(price.replace(/,/g, ""));
    if (!priceAmount || priceAmount <= 0) {
      newErrors.price = "가격을 입력해주세요.";
      isValid = false;
    }

    const amount = Number(goalAmount.replace(/,/g, ""));
    if (!amount || amount <= 0) {
      newErrors.goalAmount = "목표 금액은 0원보다 커야 합니다.";
      isValid = false;
    }

    if (!inventory || Number(inventory) <= 0) {
      newErrors.inventory = "재고는 0개보다 많아야 합니다.";
      isValid = false;
    }

    if (!startDate) {
      newErrors.startDate = "펀딩 시작일을 선택해주세요.";
      isValid = false;
    }

    if (!endDate) {
      newErrors.endDate = "펀딩 종료일을 선택해주세요.";
      isValid = false;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        newErrors.endDate = "펀딩 종료일은 시작일보다 이후여야 합니다.";
        isValid = false;
      }
    }

    if (!description.trim()) {
      newErrors.description = "프로젝트 설명을 입력해주세요.";
      isValid = false;
    }

    if (!thumbnailImage) {
      newErrors.thumbnailImageUrl = "대표 이미지를 업로드해주세요.";
      isValid = false;
    }

    if (!storyImage) {
      newErrors.storyImageUrl = "스토리 이미지를 업로드해주세요.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 폼에 작성된 내용이 있는지 확인 (Dirty Check)
  const isFormDirty =
    brn !== "" ||
    title !== "" ||
    description !== "" ||
    categoryId !== "" ||
    price !== "" ||
    goalAmount !== "" ||
    startDate !== "" ||
    endDate !== "" ||
    inventory !== "" ||
    thumbnailImage !== null ||
    storyImage !== null;

  // 1. 브라우저 새로고침/닫기 방지
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormDirty && !isSubmittedRef.current) {
        e.preventDefault();
        e.returnValue = ""; // Chrome에서는 이 설정이 필요함
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFormDirty]);

  // 2. 앱 내 페이지 이동 방지 (useBlocker)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isFormDirty &&
      !isSubmittedRef.current &&
      currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirm = window.confirm(
        "작성 중인 내용이 있습니다. 정말 떠나시겠습니까?"
      );
      if (confirm) blocker.proceed();
      else blocker.reset();
    }
  }, [blocker]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("brn", brn);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoryId", String(categoryId));
    formData.append("price", price.replace(/,/g, ""));
    formData.append("goalAmount", goalAmount.replace(/,/g, ""));
    formData.append("inventory", String(inventory));
    formData.append("startDate", `${startDate}T00:00:00`);
    formData.append("endDate", `${endDate}T23:59:59`);
    if (thumbnailImage) formData.append("thumbnailImageUrl", thumbnailImage);
    if (storyImage) formData.append("storyImageUrl", storyImage);

    try {
      await dispatch(createProduct(formData)).unwrap();
      isSubmittedRef.current = true; // 제출 성공 처리
      alert("프로젝트가 성공적으로 생성되었습니다.");
      navigate(PATH.AUTH.PROFILE); // 생성 후 프로필 페이지(내 프로젝트 목록)로 이동
    } catch (error) {
      alert("프로젝트 생성 실패: " + error);
    }
  };

  // 오늘 날짜 (YYYY-MM-DD) - 로컬 시간 기준
  const today = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  return (
    <div className="mx-auto px-4 py-12 w-full max-w-2xl">
      <h1 className="text-3xl font-bold !mb-16 text-center">프로젝트 만들기</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 bg-white p-8 rounded-lg shadow-sm border border-gray-100"
      >
        {/* 1. 사업자등록번호 */}
        <div>
          <label className="block text-base font-bold text-gray-800 mb-2">
            사업자등록번호
          </label>
          <input
            type="text"
            value={brn}
            onChange={handleBrnChange}
            maxLength={12}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00cfcf] transition-shadow"
            placeholder="000-00-00000"
          />
          {errors.brn && (
            <p className="text-red-500 text-sm mt-1">{errors.brn}</p>
          )}
        </div>

        {/* 2. 프로젝트명 */}
        <div>
          <label className="block text-base font-bold text-gray-800 mb-2">
            프로젝트명
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00cfcf] transition-shadow"
            placeholder="프로젝트 이름을 입력하세요"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* 3. 카테고리 */}
        <div>
          <label className="block text-base font-bold text-gray-800 mb-2">
            카테고리
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00cfcf] bg-white transition-shadow"
          >
            <option value="">카테고리를 선택해주세요</option>
            {Array.isArray(categories) &&
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
          )}
          {apiError && categories.length === 0 && (
            <p className="text-red-500 text-sm mt-1">
              카테고리 로딩 실패: {apiError}
            </p>
          )}
        </div>

        {/* 가격 */}
        <div>
          <label className="block text-base font-bold text-gray-800 mb-2">
            가격
          </label>
          <div className="relative">
            <input
              type="text"
              value={price}
              onChange={handlePriceChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#00cfcf] transition-shadow"
              placeholder="0"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              원
            </span>
          </div>
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        {/* 4. 목표 금액 */}
        <div>
          <label className="block text-base font-bold text-gray-800 mb-2">
            목표 금액
          </label>
          <div className="relative">
            <input
              type="text"
              value={goalAmount}
              onChange={handleGoalAmountChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#00cfcf] transition-shadow"
              placeholder="0"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              원
            </span>
          </div>
          {errors.goalAmount && (
            <p className="text-red-500 text-sm mt-1">{errors.goalAmount}</p>
          )}
        </div>

        {/* 5. 재고 */}
        <div>
          <label className="block text-base font-bold text-gray-800 mb-2">
            재고
          </label>
          <input
            type="number"
            value={inventory}
            onChange={(e) => setInventory(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00cfcf] transition-shadow"
            placeholder="0"
          />
          {errors.inventory && (
            <p className="text-red-500 text-sm mt-1">{errors.inventory}</p>
          )}
        </div>

        {/* 6. 펀딩 시작일 */}
        <div>
          <label className="block text-base font-bold text-gray-800 mb-2">
            펀딩 시작일
          </label>
          <input
            type="date"
            value={startDate}
            min={today}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00cfcf] transition-shadow"
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
          )}
        </div>

        {/* 7. 펀딩 종료일 */}
        <div>
          <label className="block text-base font-bold text-gray-800 mb-2">
            펀딩 종료일
          </label>
          <input
            type="date"
            value={endDate}
            min={startDate || today}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00cfcf] transition-shadow"
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
          )}
        </div>

        {/* 프로젝트 설명 */}
        <div>
          <label className="block text-base font-bold text-gray-800 mb-2">
            프로젝트 설명
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-3 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-[#00cfcf] transition-shadow"
            placeholder="프로젝트에 대한 상세한 설명을 작성해주세요"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* 이미지 업로드 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-bold text-gray-800 mb-2">
              대표 이미지
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileChange(e, setThumbnailImage, setThumbnailPreview)
              }
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#e7f9f9] file:text-[#00cfcf] hover:file:bg-[#d0f0f0] cursor-pointer"
            />
            {errors.thumbnailImageUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.thumbnailImageUrl}
              </p>
            )}
            {thumbnailPreview && (
              <div className="mt-4">
                <img
                  src={thumbnailPreview}
                  alt="대표 이미지 미리보기"
                  className="w-full h-48 object-cover rounded-md border border-gray-200"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-base font-bold text-gray-800 mb-2">
              스토리 이미지
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileChange(e, setStoryImage, setStoryPreview)
              }
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#e7f9f9] file:text-[#00cfcf] hover:file:bg-[#d0f0f0] cursor-pointer"
            />
            {errors.storyImageUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.storyImageUrl}</p>
            )}
            {storyPreview && (
              <div className="mt-4">
                <img
                  src={storyPreview}
                  alt="스토리 이미지 미리보기"
                  className="w-full h-auto object-cover rounded-md border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#00b0b0] text-white font-bold text-lg py-4 rounded-md hover:bg-[#009090] transition-colors mt-6 shadow-md"
        >
          {isLoading ? "생성 중..." : "프로젝트 생성하기"}
        </button>
      </form>
    </div>
  );
};

export default ProductCreatePage;
