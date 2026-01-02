import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export interface FollowUser {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface FollowListResponse {
  count: number;
  users: FollowUser[];
}

interface FollowState {
  loading: boolean;
  error: string | null;
  followings: FollowListResponse | null;
  followers: FollowListResponse | null;
}

const initialState: FollowState = {
  loading: false,
  error: null,
  followings: null,
  followers: null,
};

export const fetchFollowings = createAsyncThunk(
  "follow/fetchFollowings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/follows/followings");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "팔로잉 목록 조회 실패"
      );
    }
  }
);

export const fetchFollowers = createAsyncThunk(
  "follow/fetchFollowers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/follows/followers");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "팔로워 목록 조회 실패"
      );
    }
  }
);

export const followUser = createAsyncThunk(
  "follow/followUser",
  async (targetUserId: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/follows/${targetUserId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "팔로우 실패");
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async (targetUserId: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/follows/${targetUserId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "언팔로우 실패");
    }
  }
);

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 팔로잉 목록 조회
      .addCase(fetchFollowings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowings.fulfilled, (state, action) => {
        state.loading = false;
        state.followings = action.payload;
      })
      .addCase(fetchFollowings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 팔로워 목록 조회
      .addCase(fetchFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default followSlice.reducer;
