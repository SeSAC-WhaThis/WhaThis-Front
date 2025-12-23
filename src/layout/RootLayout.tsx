import React from "react";
import { Outlet } from "react-router-dom";
import RootMenus from "../components/menus/RootMenus";

export default function RootLayout() {
  return (
    <>
      <RootMenus />
      <Outlet />
    </>
  );
}
