import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Product 타입
export interface Product {
  id: number;
  title: string;
  thumbnailImageUrl: string;
  startDate: string; // 시작 날짜
  endDate: string; // 종료 날짜
  goalAmount: number; // 목표 금액
  currentAmount: number; // 현재 금액
  seller: string; // 판매자
  category: string;
}

// 비동기 액션 생성 (API 호출)
export const fetchFundingProducts = createAsyncThunk<Product[]>(
  "products/fetchFundingProducts",
  async () => {
    const response = await axios.get("/products");
    return response.data;
  }
);

interface ProductState {
  fundingProducts: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  fundingProducts: [],
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFundingProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFundingProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        // API 응답이 배열인지 확인 후 할당 (배열이 아니면 빈 배열 처리)
        state.fundingProducts = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchFundingProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "에러가 발생했습니다.";
      });
  },
});

export default productSlice.reducer;
