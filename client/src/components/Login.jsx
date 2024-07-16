// Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

export default function Login() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  const handleSpotifyLogin = () => {
    // Redirect the user to the Spotify login page
    window.location.href = "http://localhost:3000/login";
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">
        Spotify{" "}
        <img className="inline-block w-5" src={assets.spotify_logo} alt="" />
      </h1>
      <button
        onClick={handleSpotifyLogin}
        className="bg-green-500 text-white px-4 py-2 rounded-full cursor-pointer"
      >
        Login
      </button>
      <button
        onClick={handleLogout}
        className="bg-white text-black px-4 py-2 rounded-full cursor-pointer"
      >
        Logout Google
      </button>
    </div>
  );
}
