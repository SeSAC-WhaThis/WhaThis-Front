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
  },
  PRODUCT: {
    INDEX: "/products",
    FUNDINGPAGE: "/products/fundingPage",
    PREORDERPAGE: "/products/preorderPage",
    DETAIL: (productId: number) => `/products/${productId}`,
  },
} as const;
