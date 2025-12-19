import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// Assuming styled-components is available, or will use standard CSS/modules if preferred. Using standard CSS for now to be safe with existing setup.
import "./Login.css";
import kakaoLoginImg from "../../assets/icons/kakao.png";
import naverLoginImg from "../../assets/icons/naver.png";
import googleIcon from "../../assets/icons/google.png";
import { loginKakao } from "../../store/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  const dispatch = useDispatch();
  // @ts-ignore: JS 파일인 store/index.js의 타입을 추론하지 못할 경우를 대비해 임시로 무시하거나 RootState 타입을 정의해야 합니다.
  const { loading } = useSelector((state: any) => state.auth);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("이메일 형식이 올바르지 않습니다.");
      return;
    }
    // Handle login logic here
    console.log("Login attempt:", email, password);
  };

  const handleKakaoLogin = () => {
    // @ts-ignore: Thunk 액션 디스패치 타입 호환성 문제 방지
    dispatch(loginKakao());
  };

  return (
    <div className="login-container">
      <h1 className="login-title">whathis</h1>
      <div className="login-wrapper">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="이메일 입력"
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
          <div className="input-group">
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>
          <button type="submit" className="login-button primary">
            로그인
          </button>
        </form>

        <div className="login-options">
          <a href="/find-id">아이디 찾기</a>
          <span className="divider">|</span>
          <a href="/find-pw">비밀번호 찾기</a>
          <span className="divider">|</span>
          <a href="/signup">회원가입</a>
        </div>

        <div className="social-login">
          <p className="social-login-text">다른 계정으로 로그인</p>
          <div className="social-buttons">
            <button
              type="button"
              className="social-text-btn kakao"
              onClick={handleKakaoLogin}
              disabled={loading}
            >
              <img src={kakaoLoginImg} alt="카카오" />
              <span>카카오 로그인</span>
            </button>
            <button type="button" className="social-text-btn naver">
              <img src={naverLoginImg} alt="네이버" />
              <span>네이버 로그인</span>
            </button>
            <button type="button" className="social-text-btn google">
              <img src={googleIcon} alt="구글" />
              <span>구글 로그인</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
