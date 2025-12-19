import React, { useState } from "react";
// Assuming styled-components is available, or will use standard CSS/modules if preferred. Using standard CSS for now to be safe with existing setup.
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", email, password);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <h2 className="login-title">로그인</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
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
            <button className="social-btn kakao">카카오</button>
            <button className="social-btn naver">네이버</button>
            <button className="social-btn google">구글</button>
            <button className="social-btn apple">Apple</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
