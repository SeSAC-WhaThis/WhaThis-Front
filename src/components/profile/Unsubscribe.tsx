import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../../api/axiosInstance";
import { logout } from "../../store/authSlice";

const Unsubscribe = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (
      !window.confirm(
        "정말로 탈퇴하시겠습니까?\n탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.delete("/users/profile");
      if (response.data.success) {
        alert("회원 탈퇴가 완료되었습니다.");
        dispatch(logout());
        navigate("/");
      }
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl">
      <h1 className="text-2xl font-bold mb-6 border-b pb-4">회원 탈퇴</h1>
      
      <div className="flex flex-col gap-4">
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-2">
          <h3 className="text-red-800 font-semibold mb-2">⚠ 주의사항</h3>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            <li>탈퇴 시 계정 정보는 즉시 삭제되며 복구할 수 없습니다.</li>
            <li>팔로워/팔로잉 목록, 좋아요 내역 등 모든 활동 정보가 삭제됩니다.</li>
            <li>등록된 상품이나 진행 중인 주문이 있는 경우, 탈퇴 전 반드시 확인해주세요.</li>
          </ul>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={loading}
            className="flex-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-bold disabled:opacity-50"
          >
            {loading ? "처리 중..." : "회원 탈퇴"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unsubscribe;
