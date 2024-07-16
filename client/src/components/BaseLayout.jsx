import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Display from "../components/Display";

export default function BaseLayout() {
  return (
    <div className="flex h-screen">
      <Navbar />
      <Display>
        <Outlet />
      </Display>
    </div>
  );
}
