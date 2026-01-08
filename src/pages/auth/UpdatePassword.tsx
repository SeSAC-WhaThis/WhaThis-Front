import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { PATH } from "../../constants/path";

interface UpdatePasswordProps {
    onCancel?: () => void;
    onSuccess?: () => void;
}

const UpdatePassword = ({ onCancel, onSuccess }: UpdatePasswordProps) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [errors, setErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // 입력 시 해당 필드 에러 초기화
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        };

        if (!formData.currentPassword.trim()) {
            newErrors.currentPassword = "현재 비밀번호를 입력해주세요.";
            isValid = false;
        }

        if (!formData.newPassword.trim()) {
            newErrors.newPassword = "새 비밀번호를 입력해주세요.";
            isValid = false;
        } else {
            // 비밀번호 패턴 검증 (영문, 숫자, 특수문자 포함 8자 이상)
            const passwordRegex =
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
            if (!passwordRegex.test(formData.newPassword)) {
                newErrors.newPassword =
                    "비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.";
                isValid = false;
            }
        }

        if (!formData.confirmNewPassword.trim()) {
            newErrors.confirmNewPassword = "새 비밀번호 확인을 입력해주세요.";
            isValid = false;
        } else if (formData.newPassword !== formData.confirmNewPassword) {
            newErrors.confirmNewPassword = "새 비밀번호가 일치하지 않습니다.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            await axiosInstance.patch("/users/profile/password", {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmNewPassword: formData.confirmNewPassword,
            });
            alert("비밀번호가 변경되었습니다.");
            if (onSuccess) {
                onSuccess();
            } else {
                navigate(PATH.AUTH.PROFILE);
            }
            //axiosInstance에서 alert을 이미 표시하므로 여기서는 폼 에러만 설정
        } catch (error: any) {
            console.error("비밀번호 변경 실패:", error);
            const errorMessage =
                error.response?.data?.error?.message || "";
            if (errorMessage.includes("현재 비밀번호") || errorMessage.includes("일치")) {
                setErrors((prev) => ({ ...prev, currentPassword: errorMessage }));
            } else if (errorMessage.includes("동일")) {
                setErrors((prev) => ({ ...prev, newPassword: errorMessage }));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-xl">
            <h1 className="text-2xl font-bold mb-6 border-b pb-4">비밀번호 변경</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        현재 비밀번호
                    </label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="현재 비밀번호를 입력하세요"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00cfcf]"
                    />
                    {errors.currentPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        새 비밀번호
                    </label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00cfcf]"
                    />
                    {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        새 비밀번호 확인
                    </label>
                    <input
                        type="password"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        placeholder="새 비밀번호를 다시 입력하세요"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00cfcf]"
                    />
                    {errors.confirmNewPassword && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.confirmNewPassword}
                        </p>
                    )}
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
                        {loading ? "변경 중..." : "비밀번호 변경"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdatePassword;
