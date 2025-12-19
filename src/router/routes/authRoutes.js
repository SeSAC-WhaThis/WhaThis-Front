import Login from "../../pages/auth/Login";
import PATHS from "../../constants/paths";
import { Component } from "react";

const authRoutes = [
  {
    path: PATHS.AUTH.LOGIN,
    Component: Login,
  },
];

export default authRoutes;
