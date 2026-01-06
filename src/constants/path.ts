export const PATH = {
  MAIN: "/",
  AUTH: {
    LOGIN: "/login",
    KAKAO_CALLBACK: "/oauth/kakao/callback",
    SIGNUP: "/signup",
    PROFILE: "/profile",
    SELLER_PROFILE: (sellerId: string | number) => `/users/profile/${sellerId}`,
  },
  PRODUCT: {
    FUNDINGPAGE: "/funding",
    PREORDERPAGE: "/preorder",
    CREATE: "/product/create",
    DETAIL: (productId: string | number) => `/product/${productId}`,
    ORDER: "/orders/new",
    FEED: "/feed",
  },
};
