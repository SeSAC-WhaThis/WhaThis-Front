import RootLayout from "../../layout/RootLayout";
import MyPage from "../../pages/auth/MyPage";
import PATHS from "../../constants/paths";
import { Component } from "react";

const rootRoutes = [
  {
    path: PATHS.INDEX,
    Component: RootLayout,
    children: [
      {
        path: PATHS.MY_PAGE,
        Component: MyPage,
      },
      // 다른 메인 페이지 라우트들을 여기에 추가
    ],
  },
];

export default rootRoutes;
