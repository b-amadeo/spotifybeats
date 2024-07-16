import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from 'axios';
import { albumsData, songsData } from "../assets/assets";
import SongItem from "./SongItem";
import AlbumItem from "./AlbumItem";

export default function DisplayHome() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/generate-recommendations');
        setRecommendations(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 500) {
          setError("The response was blocked because the input or response may contain descriptions of violence, sexual themes, or otherwise derogatory content.");
        } else {
          setError(error.message);
        }
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <>
      <Navbar />
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Recommended Songs</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div className="flex overflow-auto">
            {recommendations.map((song, index) => (
              <div key={index} className="p-2 m-2 bg-blue-900 rounded outline-white">
                <p>{song}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Albums</h1>
        <div className="flex overflow-auto">
            {albumsData.map((item, index) => (<AlbumItem key={index} name={item.name} desc={item.desc} id={item.id} image={item.image}/>))}
        </div>
      </div>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Your Songs</h1>
        <div className="flex overflow-auto">
            {songsData.map((item, index) => (<SongItem key={index} name={item.name} desc={item.desc} id={item.id} image={item.image}/>))
            }
        </div>
      </div>
    </>
  );
}
