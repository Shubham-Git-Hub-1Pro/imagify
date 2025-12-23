import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credit, setCredit] = useState(0);

  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const navigate = useNavigate();
  const isAuthenticated = !!token;

  // ============================
  // LOAD USER DATA
  // ============================
  const loadCreditsData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/user/credits",
        { headers: { token } }
      );

      if (data.success) {
        setCredit(data.credits);
        setUser(data.user);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load credits");
    }
  };

  // ============================
  // 🔒 SAFE IMAGE GENERATION
  // ============================
  const generateImage = async (prompt) => {
    // 🔐 HARD SAFETY NET
    if (credit <= 0) {
      toast.error("You have exhausted your credits");
      navigate("/buy");
      return null;
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/image/generate-image",
        { prompt },
        { headers: { token } }
      );

      if (data.success) {
        loadCreditsData();
        return data.imageUrl;
      } else {
        toast.error(data.message || "Image generation failed");

        if (data.creditBalance === 0) {
          navigate("/buy");
        }
        return null;
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while generating image");
      return null;
    }
  };

  // ============================
  // LOGOUT
  // ============================
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]);

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage,
    isAuthenticated,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
