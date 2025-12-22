import Login from "../../pages/auth/Login";
import KakaoCallback from "../../pages/auth/KakaoCallback";
import SignUp from "../../pages/auth/SignUp";
import { PATH } from "../../constants/path";

const authRoutes = [
  {
    path: PATH.AUTH.LOGIN,
    Component: Login,
  },
  {
    path: PATH.AUTH.KAKAO_CALLBACK,
    Component: KakaoCallback,
  },
  {
    path: PATH.AUTH.SIGNUP,
    Component: SignUp,
  },
];

export default authRoutes;
