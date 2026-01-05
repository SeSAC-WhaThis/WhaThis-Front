export const PATH = {
  MAIN: "/",
  AUTH: {
    LOGIN: "/login",
    SIGNUP: "/signup",
    PROFILE: "/profile",
    KAKAO_CALLBACK: "/oauth/callback/kakao",
    SELLER_PROFILE: (sellerId: string | number) => `/users/profile/${sellerId}`,
  },
  PRODUCT: {
    FUNDINGPAGE: "/funding",
    PREORDERPAGE: "/preorder",
    CREATE: "/product/create",
    DETAIL: (productId: string | number) => `/product/${productId}`,
  },
};
