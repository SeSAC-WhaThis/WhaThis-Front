import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

interface DeleteConfirmModalProps {
    productId: number;
    reviewId: number;
    onClose: () => void;
    onSuccess: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    productId,
    reviewId,
    onClose,
    onSuccess,
}) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await axiosInstance.delete(`/products/${productId}/reviews/${reviewId}`);
            alert("기대평이 삭제되었습니다.");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("기대평 삭제 실패:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold mb-4">기대평 삭제</h2>
                <p className="text-gray-600 mb-6">
                    정말 삭제하시겠습니까?<br />
                    <span className="text-sm text-gray-400">삭제된 기대평은 복구할 수 없습니다.</span>
                </p>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 border border-gray-300 text-gray-700 rounded-md py-3 hover:bg-gray-50 transition-colors font-medium"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 bg-red-500 text-white rounded-md py-3 hover:bg-red-600 transition-colors font-bold disabled:opacity-50"
                    >
                        {isDeleting ? "삭제 중..." : "삭제"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
