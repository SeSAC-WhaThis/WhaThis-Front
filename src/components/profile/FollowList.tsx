import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchFollowings, fetchFollowers } from "../../store/followSlice";
import type { RootState, AppDispatch } from "../../store";
import defaultavatar from "../../assets/icons/defaultavatar.png";
import { PATH } from "../../constants/path";

interface FollowListProps {
  type: "following" | "follower";
}

const FollowList: React.FC<FollowListProps> = ({ type }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { followings, followers, loading } = useSelector(
    (state: RootState) => state.follow
  );

  useEffect(() => {
    if (type === "following") {
      dispatch(fetchFollowings());
    } else {
      dispatch(fetchFollowers());
    }
  }, [dispatch, type]);

  const listData = type === "following" ? followings : followers;
  const users = listData?.users || [];
  const count = listData?.count || 0;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 border-b pb-4">
        {type === "following" ? "팔로잉 목록" : "팔로워 목록"}
        <span className="text-sm font-normal text-gray-500 ml-2">
          {count}명
        </span>
      </h2>
      {loading ? (
        <div className="text-center py-8">로딩 중...</div>
      ) : users.length === 0 ? (
        <div className="text-gray-500 py-8 text-center">
          {type === "following" ? "팔로잉하는" : "팔로워"} 사용자가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {users.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(PATH.AUTH.SELLER_PROFILE(item.id))}
            >
              <img
                src={item.profileImageUrl || defaultavatar}
                alt={item.nickname}
                className="w-12 h-12 rounded-full object-cover border border-gray-100"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = defaultavatar;
                }}
              />
              <div className="flex-1">
                <div className="font-bold text-gray-900">{item.nickname}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowList;
