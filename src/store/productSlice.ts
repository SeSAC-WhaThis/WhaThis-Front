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
  seller: User; // 판매자
  category: Category;
  type?: string; // 펀딩 타입 (예: 리워드, 기부 등)
  description?: string; // 상품 설명
  storyImageUrl?: string; // 스토리 이미지 URL
  likeCount?: number; // 좋아요 수
  isLiked?: boolean; // 좋아요 여부
}

// 카테고리 타입
export interface Category {
  id: number;
  name: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  nickname: string;
  phoneNumber?: string;
  address?: string;
  profileImageUrl?: string;
  brn?: string;
}

// 상세 상품 조회 액션
export const fetchProductDetail = createAsyncThunk<Product, number>(
  "products/fetchProductDetail",
  async (productId) => {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response.data.data;
  }
);

// 내 상품 조회 액션
export const fetchMyProducts = createAsyncThunk<Product[]>(
  "products/fetchMyProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/products/my");
      const data = response.data;

      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.data)) return data.data;
      if (data && Array.isArray(data.result)) return data.result;
      return [];
    } catch (error: any) {
      console.error("내 상품 조회 에러 상세:", error);
      // 서버에서 보낸 구체적인 에러 메시지 확인
      if (error.response && error.response.data) {
        console.error("서버 반환 에러 데이터:", error.response.data);
      }
      return rejectWithValue(error.response?.data || "내 상품 조회 실패");
    }
  }
);

// 좋아요한 상품 조회 액션
export const fetchLikedProducts = createAsyncThunk<Product[]>(
  "products/fetchLikedProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/products/like");
      const data = response.data;

      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.data)) return data.data;
      if (data && Array.isArray(data.result)) return data.result;
      return [];
    } catch (error: any) {
      console.error("좋아요 상품 조회 에러 상세:", error);
      return rejectWithValue(error.response?.data || "좋아요 상품 조회 실패");
    }
  }
);

// 카테고리 목록 조회 액션
export const fetchCategories = createAsyncThunk<Category[]>(
  "products/fetchCategories",
  async () => {
    const response = await axiosInstance.get("/categories");
    const data = response.data;

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
      const response = await axiosInstance.post("/products", productData, {
        headers: {
          // undefined로 설정하면 브라우저가 자동으로 boundary를 포함한 multipart/form-data를 설정합니다.
          "Content-Type": undefined,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("상품 생성 에러 상세:", error);
      // 서버에서 보낸 구체적인 에러 메시지 확인
      if (error.response && error.response.data) {
        console.error("서버 반환 에러 데이터:", error.response.data);
      }
      return rejectWithValue(error.response?.data || "상품 생성 실패");
    }
  }
);

// 비동기 액션 생성 (API 호출)
export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchProducts",
  async () => {
    const response = await axiosInstance.get("/products");

    const data = response.data;
    let products: any[] = [];

    if (Array.isArray(data)) products = data;
    else if (data && Array.isArray(data.data)) products = data.data;
    else if (data && Array.isArray(data.result)) products = data.result;

    return products.map((product) => ({
      ...product,
      likeCount: product.likeCount || 0,
      isLiked: product.isLiked || false,
    }));
  }
);

interface ProductState {
  products: Product[];
  myProducts: Product[];
  likedProducts: Product[];
  categories: Category[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  myProducts: [],
  likedProducts: [],
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
      // 좋아요 상품 조회
      .addCase(fetchLikedProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLikedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.likedProducts = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchLikedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "좋아요한 상품을 불러오는데 실패했습니다.";
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
