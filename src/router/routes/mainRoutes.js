import RootLayout from "../../layout/RootLayout";
import MyPage from "../../pages/auth/MyPage";
import FundingPage from "../../pages/products/FundingPage";
import PreorderPage from "../../pages/products/PreorderPage";
import { PATH } from "../../constants/path";
import { Component } from "react";

const rootRoutes = [
  {
    path: PATH.MAIN,
    Component: RootLayout,
    children: [
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
    ],
  },
];

export default rootRoutes;
