import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./Login"
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./DisplayAlbum";
import Profile from "./Profile";
import { albumsData } from "../assets/assets";
import LoginGoogle from "./GoogleLogin";

export default function Display() {
  const displayRef = useRef()
  const location = useLocation()
  const isAlbum = location.pathname.includes("album")
  const albumId = isAlbum ? location.pathname.slice(-1) : ""
  const bgColor = albumsData[Number(albumId)].bgColor

  useEffect(() => {
    if (isAlbum) {
      displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`
    } else {
      displayRef.current.style.background = `#121212`
    }
  })

  return (
    <>
      <div ref={displayRef} className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0">
        <Routes>
          <Route path="/" element={<LoginGoogle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<DisplayHome />} />
          <Route path="/album/:id" element={<DisplayAlbum />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
}