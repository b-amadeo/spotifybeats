import { createBrowserRouter, redirect } from "react-router-dom";
import BaseLayout from "./BaseLayout";
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./DisplayAlbum";
import Profile from "./Profile"
import LoginGoogle from "../components/GoogleLogin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginGoogle />
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <BaseLayout />,  
    children: [
      {
        path: "/home",
        element: <DisplayHome />,
      },
      {
        path: "/album/:id",
        element: <DisplayAlbum />,
      },
      {
        path: "/profile/:id", 
        element: <Profile />,
      }
    ],
  },
]);

export default router;
