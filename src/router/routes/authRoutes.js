import Login from "../../pages/auth/Login";
import KakaoCallback from "../../pages/auth/KakaoCallback";
import { PATH } from "../../constants/path";

const authRoutes = [
  {
    path: PATH.LOGIN,
    Component: Login,
  },
  {
    path: PATH.KAKAO_CALLBACK,
    Component: KakaoCallback,
  },
];

export default authRoutes;
