import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../store";
import { updateProfile } from "../../store/authSlice";
import { PATH } from "../../constants/path";
import defaultavatar from "../../assets/icons/defaultavatar.png";

interface UpdateProfileProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

const UpdateProfile = ({ onCancel, onSuccess }: UpdateProfileProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    phoneNumber: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    nickname: "",
    phoneNumber: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  // 초기값 설정
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        nickname: user.nickname || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      });
      setPreview(user.profileImageUrl || defaultavatar);
    } else {
      // 로그인 안 된 상태면 로그인 페이지로
      navigate(PATH.AUTH.LOGIN);
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", nickname: "", phoneNumber: "" };

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
      isValid = false;
    }

    if (!formData.nickname.trim()) {
      newErrors.nickname = "닉네임을 입력해주세요.";
      isValid = false;
    }

    const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "전화번호 형식이 올바르지 않습니다 (예: 010-1234-5678).";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("nickname", formData.nickname);
    submitData.append("phoneNumber", formData.phoneNumber);
    submitData.append("address", formData.address);

    if (profileImage) {
      submitData.append("profileImage", profileImage);
    }

    try {
      await dispatch(updateProfile(submitData)).unwrap();
      alert("프로필이 수정되었습니다.");
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(PATH.AUTH.PROFILE);
      }
    } catch (error) {
      alert(`수정 실패: ${error}`);
    }
  };

  return (
    <div className="w-full max-w-xl">
      <h1 className="text-2xl font-bold mb-6 border-b pb-4">
        프로필 정보 수정
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* 이름 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이름
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00cfcf]"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* 닉네임 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            닉네임
          </label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00cfcf]"
          />
          {errors.nickname && (
            <p className="text-red-500 text-sm mt-1">{errors.nickname}</p>
          )}
        </div>

        {/* 전화번호 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            전화번호
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="010-0000-0000"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00cfcf]"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        {/* 주소 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            주소
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00cfcf]"
          />
        </div>

        {/* 프로필 이미지 업로드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            프로필 이미지
          </label>
          <div className="flex items-center gap-4 mb-3">
            {preview && (
              <img
                src={preview}
                alt="프로필 미리보기"
                className="w-20 h-20 rounded-full object-cover border border-gray-200 shadow-sm"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = defaultavatar;
                }}
              />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#e7f9f9] file:text-[#00cfcf] hover:file:bg-[#d0f0f0] cursor-pointer"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={() => {
              if (onCancel) onCancel();
              else navigate(-1);
            }}
            className="flex-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 bg-[#00cfcf] text-white rounded-md hover:bg-[#00afaf] font-bold"
          >
            {loading ? "수정 중..." : "수정 완료"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
