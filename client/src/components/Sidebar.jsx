import React, { useState, useEffect } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchLibrary } from "../features/librarySlice";
import SpotifyWebApi from "spotify-web-api-js";
import Toastify from "toastify-js";

const spotifyApi = new SpotifyWebApi();

const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
      let parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
};

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stateLibrary = useSelector((state) => {
    return state.library.library;
  });

  const [spotifyToken, setSpotifyToken] = useState("");
  const [nowPlaying, setNowPlaying] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [librarySongs, setLibrarySongs] = useState([]);

  useEffect(() => {
    const spotifyToken = getTokenFromUrl().access_token;
    window.location.hash = "";

    if (spotifyToken) {
      setSpotifyToken(spotifyToken);
      spotifyApi.setAccessToken(spotifyToken);
      spotifyApi.getMe().then((user) => {
        console.log(user);
      });
      setLoggedIn(true);
    }

    fetchLibrarySongs();
    dispatch(fetchLibrary(localStorage.user_id)); // Fetch songs in the library when the component mounts
  }, []);

  const fetchLibrarySongs = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const response = await axios.get(
        `http://localhost:3000/library/${userId}`
      );
      setLibrarySongs(response.data.songs);
    } catch (error) {
      console.error("Error fetching library songs:", error);
    }
  };

  const handleRemoveFromLibrary = async (songId) => {
    try {
      const userId = localStorage.getItem("user_id");
      await axios.delete(`http://localhost:3000/remove-from-library/${songId}`);
      dispatch(fetchLibrary(userId));

      Toastify({
        text: "Success delete song from library",
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

  const getNowPlaying = () => {
    spotifyApi.getMyCurrentPlaybackState().then((response) => {
      setNowPlaying({
        name: response.item.name,
        albumArt: response.item.album.images[0].url,
      });
    });
  };

  return (
    <>
      <div className="w-[25%] h-full p-2 flex flex-col gap-2 text-white hidden lg:flex">
        <div className="bg-[#121212] h-[15%] rounded flex flex-col justify-around">
          <div
            onClick={() => navigate("/home")}
            className="flex items-center gap-3 pl-8 cursor-pointer"
          >
            <img className="w-6" src={assets.home_icon} alt="" />
            <p className="font-bold">Home</p>
          </div>
        </div>
        <div className="bg-[#121212] h-[85%] rounded">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img className="w-8" src={assets.stack_icon} alt="" />
              <p className="font-semibold">Your Library</p>
            </div>
            <div className="flex items-center gap-3">
              <img className="w-5" src={assets.arrow} alt="" />
              <img className="w-5" src={assets.plus} alt="" />
            </div>
          </div>
          {loggedIn && (
            <div className="p-4">
              {stateLibrary.map((library) => (
                <div
                  key={library.id}
                  className="flex justify-between items-center mb-2"
                >
                  <div className="flex items-center">
                    <div className="ml-2">
                      <p className="text-white">{library.Song.name}</p>
                      <p className="text-gray-400 text-sm">
                        {library.Song.desc}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFromLibrary(library.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          {loggedIn && (
            <div className="p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-center justify-center">
              <div className="mb-2"> Now Playing: {nowPlaying.name} </div>
              <div>
                <img src={nowPlaying.albumArt} style={{ height: 150 }} />
              </div>
              <button
                onClick={() => getNowPlaying()}
                className="px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4"
              >
                Check Now Playing
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
