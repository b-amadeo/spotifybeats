// Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function LoginGoogle() {
  const navigate = useNavigate();

  async function handleGoogleLogin(codeResponse) {
    try {
      console.log(codeResponse)
      const { data } = await axios.post(`http://localhost:3000/google-login`, null, {
        headers: {
          token: codeResponse.credential,
        },
      });
      console.log(data)
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_id", data.profile.id )
      localStorage.setItem("user_name", data.profile.name)
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <GoogleLogin onSuccess={handleGoogleLogin} />
      </div>
    </>
  );
}
