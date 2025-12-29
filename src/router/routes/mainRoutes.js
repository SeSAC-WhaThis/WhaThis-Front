import RootLayout from "../../layout/RootLayout";
import MainPage from "../../pages/MainPage";
import MyPage from "../../pages/auth/MyPage";
import FundingPage from "../../pages/products/FundingPage";
import PreorderPage from "../../pages/products/PreorderPage";
import ProductDetailPage from "../../pages/products/ProductDetailPage";
import ProfilePage from "../../pages/products/ProfilePage";
import { PATH } from "../../constants/path";
import { Component } from "react";

const rootRoutes = [
  {
    path: PATH.MAIN,
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: MainPage,
      },
      {
        path: PATH.MY_PAGE,
        Component: MyPage,
      },
      {
        path: PATH.PRODUCT.FUNDINGPAGE,
        Component: FundingPage,
      },
      {
        path: PATH.PRODUCT.PREORDERPAGE,
        Component: PreorderPage,
      },
      {
        path: "/product/detail/:productId",
        Component: ProductDetailPage,
      },
      {
        path: PATH.AUTH.PROFILE,
        Component: ProfilePage,
      },
    ],
  },
];

export default rootRoutes;
