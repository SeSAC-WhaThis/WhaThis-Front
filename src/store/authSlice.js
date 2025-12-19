import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 카카오 로그인 비동기 액션 (Thunk)
export const loginKakao = createAsyncThunk(
  "auth/loginKakao",
  async (_, { rejectWithValue }) => {
    try {
      const REST_API_KEY = import.meta.env.VITE_KAKAO_CLIENT_SECRET;
      const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

      if (!REST_API_KEY || !REDIRECT_URI) {
        throw new Error(
          "환경 변수(VITE_KAKAO_CLIENT_ID, VITE_KAKAO_REDIRECT_URI)가 설정되지 않았습니다."
        );
      }

      // 카카오 인가 코드 요청 URL 생성
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
      // 카카오 로그인 페이지로 이동
      window.location.href = kakaoAuthUrl;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message || "카카오 로그인 실패");
    }
  }
);

// 카카오 인가 코드로 토큰 및 사용자 정보 가져오기
export const getKakaoToken = createAsyncThunk(
  "auth/getKakaoToken",
  async (code, { rejectWithValue }) => {
    try {
      const REST_API_KEY = import.meta.env.VITE_KAKAO_CLIENT_ID;
      const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
      const CLIENT_SECRET = import.meta.env.VITE_KAKAO_CLIENT_SECRET;

      if (!REST_API_KEY || !REDIRECT_URI) {
        throw new Error(
          "환경 변수(VITE_KAKAO_CLIENT_ID, VITE_KAKAO_REDIRECT_URI)가 설정되지 않았습니다."
        );
      }

      const params = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code,
      });

      if (CLIENT_SECRET) {
        params.append("client_secret", CLIENT_SECRET);
      }

      // 1. 인가 코드로 액세스 토큰 요청
      const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        body: params,
      });

      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok)
        throw new Error(tokenData.error_description || "토큰 발급 실패");

      // 2. 백엔드 서버로 액세스 토큰 전송하여 로그인/회원가입 처리
      // (백엔드 API 주소는 환경 변수 VITE_API_URL로 관리하는 것을 권장합니다)
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:8080";

      const backendResponse = await fetch(`${API_BASE_URL}/api/auth/kakao`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: tokenData.access_token,
        }),
      });

      const backendData = await backendResponse.json();
      if (!backendResponse.ok)
        throw new Error(backendData.message || "백엔드 로그인 실패");

      // 백엔드에서 { user: {...}, token: "..." } 형태로 반환한다고 가정
      return backendData;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null, // JWT 토큰 저장용 상태 추가
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginKakao.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginKakao.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(loginKakao.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getKakaoToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getKakaoToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user; // 백엔드 응답 구조에 맞춰 수정 (예: { user: {...}, token: "..." })
        state.token = action.payload.token; // JWT 토큰 저장
      })
      .addCase(getKakaoToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
