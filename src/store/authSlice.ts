import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";

// 환경 변수 및 상수 정의 (타입 단언 사용)
const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_SECRET as string;
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI as string;

// 사용자 정보 타입 정의
export interface User {
  id: number;
  nickname: string;
  email: string;
  name: string;
  profileImageUrl?: string;
  [key: string]: any; // 추가 필드 허용
}

// 로그인/회원가입 응답 타입
export interface AuthResponse {
  user: User;
  token: string;
}

// 초기 상태 타입 정의
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null | undefined;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

// 카카오 로그인 비동기 액션 (Thunk)
export const loginKakao = createAsyncThunk(
  "auth/loginKakao",
  async (_, { rejectWithValue }) => {
    try {
      if (!KAKAO_CLIENT_ID || !REDIRECT_URI) {
        throw new Error(
          "환경 변수(VITE_KAKAO_CLIENT_SECRET, VITE_KAKAO_REDIRECT_URI)가 설정되지 않았습니다."
        );
      }

      // 카카오 인가 코드 요청 URL 생성
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
      // 카카오 로그인 페이지로 이동
      window.location.href = kakaoAuthUrl;
    } catch (error: any) {
      console.error(error);
      return rejectWithValue(error.message || "카카오 로그인 실패");
    }
  }
);

// 카카오 인가 코드로 토큰 및 사용자 정보 가져오기
export const getKakaoToken = createAsyncThunk<
  AuthResponse,
  string,
  { rejectValue: string }
>("auth/getKakaoToken", async (code, { rejectWithValue }) => {
  try {
    if (!KAKAO_CLIENT_ID || !REDIRECT_URI) {
      throw new Error(
        "환경 변수(VITE_KAKAO_CLIENT_SECRET, VITE_KAKAO_REDIRECT_URI)가 설정되지 않았습니다."
      );
    }

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: KAKAO_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code,
    });

    // 1. 인가 코드로 액세스 토큰 요청
    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );

    const tokenData = tokenResponse.data;

    // 2. 백엔드 서버로 액세스 토큰 전송하여 로그인/회원가입 처리
    const backendResponse = await axiosInstance.post<AuthResponse>(
      "/auth/kakao",
      { accessToken: tokenData.access_token }
    );

    return backendResponse.data; // { user, token }
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ?? "카카오 로그인 실패"
    );
  }
});

// 일반 로그인 비동기 액션
export const login = createAsyncThunk<
  AuthResponse,
  any,
  { rejectValue: string }
>("auth/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/auth/login", userData);

    // 헤더에서 토큰 추출
    const authorization = response.headers["authorization"];
    const token = authorization ? authorization.replace("Bearer ", "") : null;

    // 바디 데이터 처리 (유저 정보)
    const user = response.data.user || response.data;

    if (!token) {
      throw new Error("인증 토큰이 헤더에 없습니다.");
    }

    return { user, token };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ?? "로그인에 실패했습니다."
    );
  }
});

// 회원가입 비동기 액션
export const signup = createAsyncThunk<
  AuthResponse, // 회원가입도 user+token 내려준다면 이렇게
  any,
  { rejectValue: string }
>("auth/signup", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/signup",
      userData
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ?? "회원가입에 실패했습니다."
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },
    // ✅ 개발용 더미 로그인 (mock)
    mockLogin(state, action: PayloadAction<AuthResponse>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;

      // 실제 로그인과 동일하게 동작하게 하려면
      localStorage.setItem("token", action.payload.token);
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
      .addCase(loginKakao.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginKakao.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getKakaoToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getKakaoToken.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = null;

          localStorage.setItem("token", action.payload.token);
        }
      )
      .addCase(getKakaoToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = null;
          localStorage.setItem("token", action.payload.token);
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, mockLogin } = authSlice.actions;
export default authSlice.reducer;
