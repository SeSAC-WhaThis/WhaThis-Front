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
        navigate(PATH.AUTH.PROFILE);
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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">주문서 작성</h1>

      <div className="flex gap-4 border p-4 rounded-lg mb-8">
        <img
          src={thumbnailImageUrl}
          alt={productTitle}
          className="w-24 h-24 object-cover rounded"
        />
        <div>
          <h3 className="font-bold text-lg">{productTitle}</h3>
          <p className="text-gray-600">
            {quantity}개 / {totalAmount.toLocaleString()}원
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">배송지 정보</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="수령인 이름"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            className="border p-3 rounded"
          />
          <input
            type="text"
            placeholder="연락처"
            value={receiverPhone}
            onChange={(e) => setReceiverPhone(e.target.value)}
            className="border p-3 rounded"
          />
          <input
            type="text"
            placeholder="주소"
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
            className="border p-3 rounded"
          />
          <input
            type="text"
            placeholder="배송 요청사항"
            value={requestNote}
            onChange={(e) => setRequestNote(e.target.value)}
            className="border p-3 rounded"
          />
        </div>
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-[#00cfcf] text-white py-4 rounded-lg text-xl font-bold hover:bg-[#00afaf]"
      >
        {totalAmount.toLocaleString()}원 결제하기
      </button>
    </div>
  );
};

export default OrderPage;
