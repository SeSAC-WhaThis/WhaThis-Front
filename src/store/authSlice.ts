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
  phoneNumber?: string;
  address?: string;
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

export const getKakaoToken = createAsyncThunk<
  AuthResponse,
  string,
  { rejectValue: string }
>("auth/getKakaoToken", async (code, { rejectWithValue }) => {
  try {
    // 1. 인가 코드(Code)를 백엔드로 바로 전송
    // 백엔드는 { code: "..." } 형태의 JSON을 기대합니다.
    const response = await axiosInstance.post("/auth/kakao", { code });

    // 2. 백엔드 응답 헤더에서 액세스 토큰 추출
    // 백엔드가 "Authorization: Bearer <token>" 형태로 헤더를 보냅니다.
    const authHeader = response.headers["authorization"];
    const accessToken = authHeader?.replace("Bearer ", "");

    if (!accessToken) {
      throw new Error("인증 토큰을 받아오지 못했습니다.");
    }

    // 3. 토큰 저장 (로컬 스토리지)
    localStorage.setItem("token", accessToken);

    // 4. 사용자 프로필 정보 조회
    // 로그인 응답에는 유저 정보가 없으므로, 토큰을 헤더에 실어 별도로 요청해야 합니다.
    const profileResponse = await axiosInstance.get("/users/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 백엔드 ApiResponse 구조: { success: true, data: { ...UserResponse... }, ... }
    const user = profileResponse.data.data;

    // 5. Redux 상태 업데이트를 위해 반환
    return { user, token: accessToken };
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

// 프로필 수정 비동기 액션
export const updateProfile = createAsyncThunk<
  User,
  any,
  { rejectValue: string }
>("auth/updateProfile", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch("/users/profile", userData);
    // 응답 데이터 구조에 따라 response.data 또는 response.data.data 등을 반환
    return response.data.user || response.data.data || response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? "프로필 수정 실패");
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
      })
      // 프로필 수정
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload }; // 기존 정보에 덮어쓰기
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, mockLogin } = authSlice.actions;
export default authSlice.reducer;
