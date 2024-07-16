import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Toastify from "toastify-js";

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", status: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/profile/${id}`);
        setUser(response.data.user);
        setFormData({ name: response.data.user.name, status: response.data.user.status });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/profile/${id}`, formData);
      setUser((prevUser) => ({
        ...prevUser,
        name: formData.name,
        status: formData.status,
      }));
      setIsEditing(false);
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

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="flex flex-col items-center p-6 border border-gray-700 rounded-lg bg-gray-800 shadow-lg">
        <div className="w-40 h-40 rounded-full mb-6 border-2 border-gray-700 flex items-center justify-center">
          <span className="text-4xl font-bold text-gray-300">Profile</span>
        </div>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="w-full mb-4 text-center">
              <label className="block text-xl font-bold text-gray-300 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-lg p-2 border border-gray-700 rounded-full bg-gray-900 text-gray-300 w-full text-center"
              />
            </div>
            <div className="w-full mb-4 text-center">
              <label className="block text-xl font-bold text-gray-300 mb-2">Status</label>
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="text-lg p-2 border border-gray-700 rounded-full bg-gray-900 text-gray-300 w-full text-center"
              />
            </div>
            <div className="w-full flex justify-center">
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="w-full mb-4 text-center">
              <label className="block text-xl font-bold text-gray-300 mb-2">Name</label>
              <p className="text-lg p-2 border border-gray-700 rounded-full bg-gray-900 text-gray-300">{user.name}</p>
            </div>
            <div className="w-full mb-4 text-center">
              <label className="block text-xl font-bold text-gray-300 mb-2">Status</label>
              <p className="text-lg p-2 border border-gray-700 rounded-full bg-gray-900 text-gray-300">{user.status}</p>
            </div>
            <button
              onClick={handleEdit}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
}
