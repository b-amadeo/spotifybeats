import React, { useContext } from "react";
import axios from 'axios'
import { PlayerContext } from "../context/PlayerContext";
import { useDispatch } from "react-redux";
import { fetchLibrary } from "../features/librarySlice";
import Toastify from "toastify-js";

export default function SongItem({ name, image, desc, id }) {
  const { playWithId } = useContext(PlayerContext);
  const dispatch = useDispatch()
  const handleAddToLibrary = async () => {
    try {
      const response = await axios.post('http://localhost:3000/add-to-library', {
        UserId: localStorage.user_id,
        SongId: id
      });

      dispatch(fetchLibrary(localStorage.user_id))

      Toastify({
        text: "Success add song to library",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #00ff00, #0000FF)",
        },
      }).showToast();
    } catch (error) {
      Toastify({
        text: error.response.data.message,
        duration: 2000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #FF0000, #0000FF)",
        },
      }).showToast();
    }
  };

  return (
    <div className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-gray-600 relative">
      <div onClick={() => playWithId(id-1)}>
        <img className="rounded w-full" src={image} alt={name} />
      </div>
      <div className="mt-2">
        <p className="font-bold">{name}</p>
        <p className="text-slate-20 text-sm">{desc}</p>
      </div>
      <div className="mt-2">
        <button
          onClick={handleAddToLibrary}
          className="bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer"
        >
          Add to Library
        </button>
      </div>
    </div>
  );
}
