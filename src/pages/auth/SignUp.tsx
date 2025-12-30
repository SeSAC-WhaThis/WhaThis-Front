import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/path";
import { signup } from "../../store/authSlice";
import "./Login.css"; // 로그인 페이지 스타일 재사용

const SignUp = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [nameError, setNameError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // @ts-ignore
  const { loading } = useSelector((state: any) => state.auth);

  // --- 유효성 검사 함수 ---
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  // --- 폼 제출 핸들러 ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 제출 시 최종 유효성 검사
    const isNameValid = !!name.trim();
    const isNicknameValid = !!nickname.trim();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isPasswordConfirmValid = password === passwordConfirm;

    if (!isNameValid) setNameError("이름을 입력해주세요.");
    if (!isNicknameValid) setNicknameError("닉네임을 입력해주세요.");
    if (!isEmailValid) setEmailError("이메일 형식이 올바르지 않습니다.");
    if (!isPasswordValid) setPasswordError("비밀번호는 8자 이상이어야 합니다.");
    if (!isPasswordConfirmValid)
      setPasswordConfirmError("비밀번호가 일치하지 않습니다.");

    if (
      isNameValid &&
      isNicknameValid &&
      isEmailValid &&
      isPasswordValid &&
      isPasswordConfirmValid
    ) {
      // 백엔드로 보낼 데이터
      const userData = {
        email,
        password,
        name,
        nickname,
        confirmPassword: passwordConfirm,
      };

      // @ts-ignore
      dispatch(signup(userData))
        .unwrap()
        .then(() => {
          alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
          navigate(PATH.AUTH.LOGIN);
        })
        .catch((err: any) => {
          alert(err || "회원가입에 실패했습니다.");
        });
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">회원가입</h1>
      <div className="login-wrapper">
        <form onSubmit={handleSubmit} className="login-form">
          {/* 이름 */}
          <div className="input-group">
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError("");
              }}
              className="login-input"
            />
            {nameError && (
              <p className="text-red-500 text-sm mt-1">{nameError}</p>
            )}
          </div>

          {/* 닉네임 */}
          <div className="input-group">
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (nicknameError) setNicknameError("");
              }}
              className="login-input"
            />
            {nicknameError && (
              <p className="text-red-500 text-sm mt-1">{nicknameError}</p>
            )}
          </div>

          {/* 이메일 */}
          <div className="input-group">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => {
                const newEmail = e.target.value;
                setEmail(newEmail);
                if (newEmail && !validateEmail(newEmail)) {
                  setEmailError("이메일 형식이 올바르지 않습니다.");
                } else {
                  setEmailError("");
                }
              }}
              className="login-input"
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="input-group">
            <input
              type="password"
              placeholder="비밀번호 (8자 이상)"
              value={password}
              onChange={(e) => {
                const newPassword = e.target.value;
                setPassword(newPassword);
                if (newPassword && !validatePassword(newPassword)) {
                  setPasswordError("비밀번호는 8자 이상이어야 합니다.");
                } else {
                  setPasswordError("");
                }
                // 비밀번호 확인 필드도 다시 검사
                if (passwordConfirm && newPassword !== passwordConfirm) {
                  setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
                } else {
                  setPasswordConfirmError("");
                }
              }}
              className="login-input"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className="input-group">
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={passwordConfirm}
              onChange={(e) => {
                const newConfirm = e.target.value;
                setPasswordConfirm(newConfirm);
                if (password && newConfirm !== password) {
                  setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
                } else {
                  setPasswordConfirmError("");
                }
              }}
              className="login-input"
            />
            {passwordConfirmError && (
              <p className="text-red-500 text-sm mt-1">
                {passwordConfirmError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="login-button primary"
            disabled={loading}
          >
            {loading ? "가입 중..." : "가입하기"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
