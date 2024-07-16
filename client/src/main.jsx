import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import PlayerContextProvider from "./context/PlayerContext.jsx";
import store from "./app/store.js";
import { Provider } from "react-redux";
import "toastify-js/src/toastify.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
    <GoogleOAuthProvider clientId="196186835111-rr98vm5g3hvfo0oelv0pgf0lfr71l179.apps.googleusercontent.com">
      <BrowserRouter>
        <PlayerContextProvider>
          <App />
        </PlayerContextProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);
