import React from "react";
import { useSelector } from "react-redux";
import { Review } from "./ReviewList";
import defaultavatar from "../../assets/icons/defaultavatar.png";
import type { RootState } from "../../store";

interface ReviewItemProps {
    review: Review;
    productId: number;
    onEdit: (review: Review) => void;
    onDelete: (review: Review) => void;
}

// 날짜 포맷팅 함수
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const ReviewItem: React.FC<ReviewItemProps> = ({
    review,
    productId,
    onEdit,
    onDelete,
}) => {
    // 현재 로그인한 사용자 정보
    const { user } = useSelector((state: RootState) => state.auth);
    const currentUserId = user?.id;

    // 본인 기대평인지 확인
    const isOwner = currentUserId && review.reviewer.id === currentUserId;

    return (
        <div className="border-b border-gray-100 py-6">
            {/* 작성자 정보 */}
            <div className="flex items-center gap-3 mb-3">
                <img
                    src={review.reviewer.profileImageUrl || defaultavatar}
                    alt={review.reviewer.nickname}
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = defaultavatar;
                    }}
                />
                <div className="flex-1">
                    <div className="font-bold text-gray-900 text-sm">
                        {review.reviewer.nickname}
                    </div>
                    <div className="text-xs text-gray-400">
                        {formatDate(review.createdAt)}
                    </div>
                </div>

                {/* 본인 기대평일 때만 수정/삭제 버튼 표시 */}
                {isOwner && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(review)}
                            className="text-xs text-gray-500 hover:text-[#00cfcf] transition-colors"
                        >
                            수정
                        </button>
                        <button
                            onClick={() => onDelete(review)}
                            className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                        >
                            삭제
                        </button>
                    </div>
                )}
            </div>

            {/* 리뷰 내용 */}
            <p className="text-gray-700 text-sm leading-relaxed">
                {review.content}
            </p>

            {/* 도움됨 수 */}
            {review.helpfulCount > 0 && (
                <div className="text-xs text-gray-400 mt-3">
                    {review.helpfulCount}명에게 도움이 됨
                </div>
            )}
        </div>
    );
};

export default ReviewItem;
