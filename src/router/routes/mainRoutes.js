import RootLayout from "../../layout/RootLayout";
import MainPage from "../../pages/MainPage";
import MyPage from "../../pages/auth/MyPage";
import FundingPage from "../../pages/products/FundingPage";
import PreorderPage from "../../pages/products/PreorderPage";
import ProductDetailPage from "../../pages/products/ProductDetailPage";
import ProfilePage from "../../pages/auth/ProfilePage";
import ProductCreatePage from "../../pages/products/ProductCreatePage";
import SellerProfile from "../../pages/auth/SellerProfile";
import FeedPage from "../../pages/products/FollowingFeedPage";
import { PATH } from "../../constants/path";
import { Component } from "react";
import OrderPage from "../../pages/orders/OrderPage";
import PrivateRoute from "../../components/common/PrivateRoute";

const rootRoutes = [
  {
    path: PATH.MAIN,
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: MainPage,
      },
      // {
      //   path: PATH.MY_PAGE,
      //   Component: MyPage,
      // },
      {
        path: PATH.PRODUCT.FUNDINGPAGE,
        Component: FundingPage,
      },
      {
        path: PATH.PRODUCT.PREORDERPAGE,
        Component: PreorderPage,
      },
      {
        path: "/product/:productId",
        Component: ProductDetailPage,
      },
      {
        path: "/users/profile/:sellerId",
        Component: SellerProfile,
      },
      {
        path: PATH.PRODUCT.FEED,
        Component: FeedPage,
      },
      // Protected Routes
      {
        Component: PrivateRoute,
        children: [
          {
            path: PATH.AUTH.PROFILE,
            Component: ProfilePage,
          },
          {
            path: PATH.PRODUCT.CREATE,
            Component: ProductCreatePage,
          },
          {
            path: PATH.PRODUCT.ORDER,
            Component: OrderPage,
          },
        ],
      },
    ],
  },
];

export default rootRoutes;
