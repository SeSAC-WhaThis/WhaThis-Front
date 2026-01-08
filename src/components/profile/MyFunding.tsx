import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

interface Order {
  orderId: number;
  merchantUid: string;
  productName: string;
  productImageUrl: string;
  orderDate: string;
  endDate: string;
  quantity: number;
  totalAmount: number;
  orderStatus: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  requestNote: string;
}

const MyFunding = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState("단순 변심");
  const [customReason, setCustomReason] = useState("");

  const cancelReasons = [
    "단순 변심",
    "구매 실수",
    "배송 지연",
    "상품 문제",
    "기타",
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/orders/my");
        if (response.data.success) {
          // 'PENDING' (결제 대기) 상태인 주문은 제외하고 저장
          const filteredOrders = response.data.data.filter(
            (order: Order) => order.orderStatus !== "PENDING"
          );
          setOrders(filteredOrders);
        }
      } catch (error) {
        console.error("내 펀딩 내역 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
    setCancelReason("단순 변심");
    setCustomReason("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleCancelPayment = async () => {
    if (!selectedOrder) return;

    const reasonToSend = cancelReason === "기타" ? customReason : cancelReason;

    if (!reasonToSend.trim()) {
      alert("취소 사유를 입력해주세요.");
      return;
    }

    // 요청 데이터 확인용 로그 (Body에 들어갈 내용)
    console.log("결제 취소 요청 Body:", {
      paymentId: selectedOrder.merchantUid,
      cancelReason: reasonToSend,
    });

    try {
      const response = await axiosInstance.post("/orders/cancel", {
        paymentId: selectedOrder.merchantUid,
        cancelReason: reasonToSend,
      });

      if (response.data.success) {
        alert("주문 취소가 완료되었습니다.");
        // 취소된 주문의 상태를 변경
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === selectedOrder.orderId
              ? { ...o, orderStatus: "CANCELLED" }
              : o
          )
        );
        handleCloseModal();
      }
    } catch (error: any) {
      console.error("주문 취소 실패:", error);
      const status = error.response?.status;
      const message =
        error.response?.data?.message || "주문 취소에 실패했습니다.";
      alert(`${message}${status ? ` (오류 코드: ${status})` : ""}`);
    }
  };

  const renderStatusBadge = (status: string) => {
    let styles = "bg-gray-100 text-gray-600";
    let text = status;

    switch (status) {
      case "PENDING":
        styles = "bg-yellow-100 text-yellow-700";
        text = "결제 대기";
        break;
      case "RESERVED":
        styles = "bg-blue-100 text-blue-700";
        text = "펀딩 참여";
        break;
      case "PAID":
        styles = "bg-green-100 text-green-700";
        text = "결제 완료";
        break;
      case "CANCELLED":
        styles = "bg-red-100 text-red-700";
        text = "취소됨";
        break;
    }

    return (
      <span className={`px-2 py-0.5 rounded text-xs font-bold ${styles}`}>
        {text}
      </span>
    );
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 border-b pb-4">내 펀딩 내역</h2>
      {orders.length === 0 ? (
        <div className="text-gray-500 py-8 text-center">
          참여한 펀딩 내역이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs text-gray-500">
                    주문번호: {order.merchantUid}
                  </div>
                  {renderStatusBadge(order.orderStatus)}
                </div>
                <div className="flex gap-4 mb-4">
                  <img
                    src={
                      order.productImageUrl?.startsWith("http")
                        ? order.productImageUrl
                        : `http://localhost:8080${order.productImageUrl}`
                    }
                    alt={order.productName}
                    className="w-20 h-20 object-cover rounded-md flex-shrink-0 bg-gray-100"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
                      {order.productName}
                    </h3>
                    <div className="text-xl font-bold text-[#00cfcf]">
                      {order.totalAmount.toLocaleString()}원
                      <span className="text-sm text-gray-500 font-normal ml-2">
                        {order.quantity}개
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex">
                    <span className="w-20 font-medium text-gray-500">
                      받는 분
                    </span>
                    <span>{order.receiverName}</span>
                  </div>
                  <div className="flex">
                    <span className="w-20 font-medium text-gray-500">
                      연락처
                    </span>
                    <span>{order.receiverPhone}</span>
                  </div>
                  <div className="flex">
                    <span className="w-20 font-medium text-gray-500">주소</span>
                    <span className="flex-1">{order.receiverAddress}</span>
                  </div>
                  {order.requestNote && (
                    <div className="flex">
                      <span className="w-20 font-medium text-gray-500">
                        요청사항
                      </span>
                      <span className="flex-1">{order.requestNote}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                {order.orderStatus !== "CANCELLED" && (
                  <button
                    onClick={() => handleOpenModal(order)}
                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors"
                  >
                    결제 취소
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 취소 모달 */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-900">결제 취소</h3>
            <div className="bg-gray-50 p-4 rounded-md mb-6 text-sm text-gray-700">
              <p className="mb-1">
                <span className="font-bold">상품명:</span>{" "}
                {selectedOrder.productName}
              </p>
              <p className="mb-1">
                <span className="font-bold">주문번호:</span>{" "}
                {selectedOrder.merchantUid}
              </p>
              <p>
                <span className="font-bold">결제금액:</span>{" "}
                {selectedOrder.totalAmount.toLocaleString()}원
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                취소 사유를 선택해주세요
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00cfcf] bg-white mb-2"
              >
                {cancelReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              {cancelReason === "기타" && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00cfcf] resize-none"
                  placeholder="취소 사유를 입력해주세요"
                  rows={3}
                />
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                닫기
              </button>
              <button
                onClick={handleCancelPayment}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-bold transition-colors"
              >
                취소하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFunding;
