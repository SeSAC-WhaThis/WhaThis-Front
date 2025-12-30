import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// Product 타입
export interface Product {
  id: number;
  title: string;
  brn?: string; // 사업자등록번호
  thumbnailImageUrl: string;
  startDate: string; // 시작 날짜
  endDate: string; // 종료 날짜
  goalAmount: number; // 목표 금액
  currentAmount: number; // 현재 금액
  price?: number; // 가격
  inventory?: number; // 재고
  seller: string; // 판매자
  category: string;
  type?: string; // 펀딩 타입 (예: 리워드, 기부 등)
  description?: string; // 상품 설명
  storyImage?: string; // 스토리 이미지 URL
}

// 카테고리 타입
export interface Category {
  id: number;
  name: string;
}

// 상세 상품 조회 액션
export const fetchProductDetail = createAsyncThunk<Product, number>(
  "products/fetchProductDetail",
  async (productId) => {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response.data;
  }
);

// 내 상품 조회 액션
export const fetchMyProducts = createAsyncThunk<Product[]>(
  "products/fetchMyProducts",
  async () => {
    const response = await axiosInstance.get("/products/my");
    return response.data;
  }
);

// 카테고리 목록 조회 액션
export const fetchCategories = createAsyncThunk<Category[]>(
  "products/fetchCategories",
  async () => {
    const response = await axiosInstance.get("/categories");
    const data = response.data;
    console.log("카테고리 API 응답:", data); // 콘솔에서 데이터 구조 확인용

    // 1. 바로 배열인 경우
    if (Array.isArray(data)) return data;
    // 2. data 프로퍼티 안에 배열이 있는 경우 (예: { data: [...] })
    if (data && Array.isArray(data.data)) return data.data;
    // 3. result 프로퍼티 안에 배열이 있는 경우 (예: { result: [...] })
    if (data && Array.isArray(data.result)) return data.result;

    return []; // 배열을 찾지 못하면 빈 배열 반환
  }
);

// 상품 생성 액션
export const createProduct = createAsyncThunk<Product, FormData>(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/products", productData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "상품 생성 실패");
    }
  }
);

// 비동기 액션 생성 (API 호출)
export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchProducts",
  async () => {
    const response = await axiosInstance.get("/products");
    return response.data;

    // // 테스트용 더미 데이터
    // const today = new Date();
    // const endDate = new Date(today);
    // endDate.setDate(today.getDate() + 15); // 15일 후 마감

    // return [
    //   {
    //     id: 1,
    //     title: "테스트 펀딩 상품",
    //     thumbnailImageUrl: "https://via.placeholder.com/300",
    //     startDate: today.toISOString(),
    //     endDate: endDate.toISOString(),
    //     goalAmount: 1000000,
    //     currentAmount: 350000,
    //     seller: "테스트 판매자",
    //     category: "테크/가전",
    //     type: "리워드",
    //     description: "이것은 테스트를 위한 더미 데이터입니다.",
    //   },
    // ];
  }
);

interface ProductState {
  products: Product[];
  myProducts: Product[];
  categories: Category[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  myProducts: [],
  categories: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        // API 응답이 배열인지 확인 후 할당 (배열이 아니면 빈 배열 처리)
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "에러가 발생했습니다.";
      })
      // 상세 조회
      .addCase(fetchProductDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "상품 정보를 불러오는데 실패했습니다.";
      })
      // 내 상품 조회
      .addCase(fetchMyProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myProducts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "내 상품을 불러오는데 실패했습니다.";
      })
      // 카테고리 조회
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.error.message || "카테고리 로딩 실패";
      })
      // 상품 생성
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myProducts.push(action.payload); // 내 상품 목록에 추가
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "상품 생성에 실패했습니다.";
      });
  },
});

export default productSlice.reducer;
