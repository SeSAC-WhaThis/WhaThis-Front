import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

interface ReviewEditModalProps {
    productId: number;
    reviewId: number;
    initialContent: string;
    onClose: () => void;
    onSuccess: () => void;
}

const ReviewEditModal: React.FC<ReviewEditModalProps> = ({
    productId,
    reviewId,
    initialContent,
    onClose,
    onSuccess,
}) => {
    const [content, setContent] = useState<string>(initialContent);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>("");

    const validateForm = () => {
        if (!content.trim()) {
            setError("기대평 내용은 필수입니다.");
            return false;
        }
        if (content.length > 200) {
            setError("기대평은 200자 이하여야 합니다.");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await axiosInstance.patch(`/products/${productId}/reviews/${reviewId}`, {
                star: 5, // 고정값
                content,
                imageUrls: "https://example.com/image.jpg", // 고정값
            });
            alert("기대평이 수정되었습니다.");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("기대평 수정 실패:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-6">기대평 수정</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                            기대평 내용 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#00cfcf] transition-shadow"
                            placeholder="기대평을 작성해주세요 (최대 200자)"
                            maxLength={200}
                        />
                        <div className="flex justify-between items-center mt-1">
                            {error ? (
                                <p className="text-red-500 text-sm">{error}</p>
                            ) : (
                                <span />
                            )}
                            <span className="text-gray-400 text-sm">{content.length}/200</span>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-gray-300 text-gray-700 rounded-md py-3 hover:bg-gray-50 transition-colors font-medium"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-[#00cfcf] text-white rounded-md py-3 hover:bg-[#00afaf] transition-colors font-bold disabled:opacity-50"
                        >
                            {isSubmitting ? "수정 중..." : "수정하기"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewEditModal;
