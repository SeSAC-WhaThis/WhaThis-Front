import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../api/axiosInstance";
import { PATH } from "../../constants/path";
import type { RootState } from "../../store";
import * as PortOne from "@portone/browser-sdk/v2";

const OrderPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const { productId, productTitle, quantity, price, thumbnailImageUrl } =
    location.state || {};

  const [receiverName, setReceiverName] = useState(user?.name || "");
  const [receiverPhone, setReceiverPhone] = useState(user?.phoneNumber || "");
  const [receiverAddress, setReceiverAddress] = useState(user?.address || "");
  const [requestNote, setRequestNote] = useState("");

  useEffect(() => {
    if (!productId) {
      alert("잘못된 접근입니다.");
      navigate(-1);
    }
  }, [productId, navigate]);

  const totalAmount = (price || 0) * (quantity || 0);

  const handlePayment = async () => {
    if (!receiverName || !receiverPhone || !receiverAddress) {
      alert("배송지 정보를 모두 입력해주세요.");
      return;
    }

    try {
      // 1. 주문 생성 요청
      const orderData = {
        productId,
        quantity,
        receiverName,
        receiverPhone,
        receiverAddress,
        requestNote,
      };

      const { data } = await axiosInstance.post("/orders", orderData);

      if (!data.success) {
        throw new Error(data.message || "주문 생성 실패");
      }

      const { merchantUid, buyerEmail, buyerName, buyerTel, buyerAddr } =
        data.data;

      // 2. 포트원 V2 결제 요청
      const response = await PortOne.requestPayment({
        storeId: "store-22016254-0a4f-4b03-a959-625bfdb6f64a", // 본인의 Store ID 입력
        channelKey: "channel-key-e52e84a2-5c87-4df8-8387-9d32f162e263", // 본인의 Channel Key 입력
        paymentId: merchantUid,
        orderName: productTitle,
        totalAmount: totalAmount,
        currency: "CURRENCY_KRW",
        payMethod: "CARD",
        customer: {
          fullName: buyerName || receiverName,
          phoneNumber: buyerTel || receiverPhone,
          // [수정 1] address는 객체가 아니라 문자열로 전달해야 합니다.
          email: buyerEmail || user?.email || "test@test.com",
          address: {
            addressLine1: buyerAddr || receiverAddress,
            addressLine2: "",
          } as any,
        },
      });

      // [수정 2] response 타입을 안전하게 처리하기 위해 'code' 속성 존재 여부를 확인하거나 as any 사용
      // 에러가 발생한 경우 (code가 존재하면 에러)
      if (response && (response as any).code != null) {
        alert(`결제 실패: ${(response as any).message}`);
        return;
      }

      // 3. 결제 성공 시 서버 검증 요청
      // paymentId는 요청 보낼 때 썼던 merchantUid를 그대로 사용해도 됩니다.
      const verifyData = {
        paymentId: merchantUid,
      };

      const verifyRes = await axiosInstance.post(
        "/payments/complete",
        verifyData
      );

      if (verifyRes.data.success) {
        alert("결제가 완료되었습니다!");
        navigate(PATH.AUTH.PROFILE, { state: { tab: "funding" } });
      } else {
        alert("결제 검증 실패: 관리자에게 문의하세요.");
      }
    } catch (error: any) {
      console.error(error);
      alert(
        error.response?.data?.message || "주문 처리 중 오류가 발생했습니다."
      );
    }
  };

  if (!productId) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 transform transition-all">
        {/* 헤더 영역 */}
        <div className="flex items-center mb-8 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 text-gray-400 hover:text-gray-600 transition-colors p-2 -ml-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-center w-full text-gray-900">
            주문/결제
          </h1>
        </div>

        {/* 상품 정보 요약 */}
        <div className="bg-gray-50 p-5 rounded-xl mb-8 flex gap-5 items-center shadow-sm">
          <img
            src={thumbnailImageUrl}
            alt={productTitle}
            className="w-20 h-20 object-cover rounded-lg shadow-sm flex-shrink-0"
          />
          <div className="flex flex-col justify-center overflow-hidden">
            <h3 className="font-bold text-gray-900 text-lg truncate mb-1">
              {productTitle}
            </h3>
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">{quantity}개</span>
              <span className="mx-2">|</span>
              <span className="font-bold text-[#00cfcf]">
                {totalAmount.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 배송지 정보 입력 */}
        <div className="mb-8 space-y-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-900">배송지 정보</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                수령인
              </label>
              <input
                type="text"
                placeholder="이름을 입력하세요"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-[#00cfcf] focus:border-transparent outline-none transition-all bg-white hover:border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                연락처
              </label>
              <input
                type="text"
                placeholder="010-0000-0000"
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-[#00cfcf] focus:border-transparent outline-none transition-all bg-white hover:border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                주소
              </label>
              <input
                type="text"
                placeholder="배송 받을 주소를 입력하세요"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-[#00cfcf] focus:border-transparent outline-none transition-all bg-white hover:border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                배송 요청사항
              </label>
              <input
                type="text"
                placeholder="예: 문 앞에 놓아주세요"
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-[#00cfcf] focus:border-transparent outline-none transition-all bg-white hover:border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* 결제 버튼 */}
        <button
          onClick={handlePayment}
          className="w-full bg-[#00cfcf] text-white py-4 rounded-xl text-lg font-bold shadow-md hover:bg-[#00afaf] hover:shadow-lg transform active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>{totalAmount.toLocaleString()}원 결제하기</span>
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
