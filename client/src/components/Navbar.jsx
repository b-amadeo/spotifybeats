import React, { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/profile/${localStorage.user_id}`);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/logout");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <div className="w-full flex justify-between items-center font-semibold">
        <div className="flex items-center gap-2">
          <img
            onClick={() => navigate(-1)}
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            src={assets.arrow_left}
            alt=""
          />
          <img
            onClick={() => navigate(1)}
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            src={assets.arrow_right}
            alt=""
          />
        </div>

        <div className="flex items-center gap-4">
          <Link to="https://www.spotify.com/id-en/premium/" className="bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer">
            Explore Premium
          </Link>
          <p
            onClick={handleLogout}
            className="bg-black py-1 px-3 rounded 2xl text-[15px] cursor-pointer"
          >
            Log Out
          </p>
          {user && (
            <Link to={`/profile/${localStorage.user_id}`} className="bg-purple-500 text-black w-7 h-7 rounded-full flex items-center justify-center">
              {localStorage.user_name.charAt(0).toUpperCase()}
            </Link>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer">
          All
        </p>
      </div>
    </>
  );
}
