import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 카카오 로그인 비동기 액션 (Thunk)
// 실제로는 여기서 백엔드 API로 인가 코드를 보내거나, 카카오 SDK 로그인을 수행합니다.
export const loginKakao = createAsyncThunk(
  "auth/loginKakao",
  async (_, { rejectWithValue }) => {
    try {
      // API 호출 시뮬레이션 (1초 대기)
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: 123456,
            nickname: "카카오사용자",
            email: "kakao@example.com",
            accessToken: "dummy_access_token",
          });
        }, 1000);
      });

      return response;
    } catch (error) {
      return rejectWithValue("카카오 로그인 실패");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
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
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginKakao.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
