import FundingPage from "../pages/products/FundingPage";

export const PATH = {
  MAIN: "/",
  ABOUT: "/about",
  TODO: "/todo/",
  FUNDING: "/funding",
  PREORDER: "/preorder",
  AUTH: {
    LOGIN: "/auth/login",
    KAKAO_CALLBACK: "/oauth/kakao/callback",
    SIGNUP: "/auth/signup",
    PROFILE: "/auth/profile",
  },
  PRODUCT: {
    INDEX: "/products",
    FUNDINGPAGE: "/products/fundingPage",
    PREORDERPAGE: "/products/preorderPage",
    DETAIL: (productId: number) => `/product/detail/${productId}`,
  },
} as const;
