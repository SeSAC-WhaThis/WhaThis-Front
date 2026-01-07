import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import ReviewItem from "./ReviewItem";
import ReviewEditModal from "./ReviewEditModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

// 리뷰 작성자 정보 타입
export interface ReviewerInfo {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
}

// 리뷰 응답 타입
export interface Review {
    id: number;
    content: string;
    star: number;
    imageUrls: string[];
    helpfulCount: number;
    createdAt: string;
    updatedAt: string;
    reviewer: ReviewerInfo;
}

interface ReviewListProps {
    productId: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // 수정 모달 상태
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    // 삭제 모달 상태
    const [deletingReview, setDeletingReview] = useState<Review | null>(null);

    const loadReviews = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get<{ data: Review[] }>(
                `/products/${productId}/reviews`
            );
            setReviews(response.data.data);
        } catch (err) {
            console.error("리뷰 불러오기 실패:", err);
            setError("기대평을 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, [productId, refreshKey]);

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const handleEdit = (review: Review) => {
        setEditingReview(review);
    };

    const handleDelete = (review: Review) => {
        setDeletingReview(review);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-gray-400">기대평을 불러오는 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-red-400">{error}</div>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div>아직 기대평이 없습니다.</div>
                <div className="text-sm mt-1">첫 번째 기대평을 남겨보세요!</div>
            </div>
        );
    }

    return (
        <>
            <div>
                <div className="text-sm text-gray-500 mb-4">
                    총 <span className="font-bold text-[#00cfcf]">{reviews.length}</span>개의 기대평
                </div>
                <div>
                    {reviews.map((review) => (
                        <ReviewItem
                            key={review.id}
                            review={review}
                            productId={productId}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>

            {/* 수정 모달 */}
            {editingReview && (
                <ReviewEditModal
                    productId={productId}
                    reviewId={editingReview.id}
                    initialContent={editingReview.content}
                    onClose={() => setEditingReview(null)}
                    onSuccess={handleRefresh}
                />
            )}

            {/* 삭제 확인 모달 */}
            {deletingReview && (
                <DeleteConfirmModal
                    productId={productId}
                    reviewId={deletingReview.id}
                    onClose={() => setDeletingReview(null)}
                    onSuccess={handleRefresh}
                />
            )}
        </>
    );
};

export default ReviewList;
