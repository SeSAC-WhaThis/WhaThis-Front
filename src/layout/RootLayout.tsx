import React from "react";
import { Outlet } from "react-router-dom";
import RootMenus from "../components/menus/RootMenus";
import ChatWidget from "../components/chat/ChatWidget";

export default function RootLayout() {
  return (
    <>
      <RootMenus />
      <Outlet />
      <ChatWidget />
    </>
  );
}
