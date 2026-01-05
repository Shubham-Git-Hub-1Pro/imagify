import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();

  // ============================
  // STATE
  // ============================
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credit, setCredit] = useState(
    Number(localStorage.getItem("credit")) || 0
  );

  const isAuthenticated = Boolean(token);

  // ============================
  // BACKEND URL
  // ============================
  const backendUrl =
    import.meta.env.VITE_API_URL ||
    "https://imagify-backend-es4d.onrender.com";

  // ============================
  // LOAD USER + CREDITS
  // ============================
  const loadCreditsData = async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/credits`,
        {
          headers: { token },
        }
      );

      if (data.success) {
        // 🔥 SINGLE SOURCE OF TRUTH
        setCredit(data.credits);
        setUser(data.user);

        // 🔥 PERSIST DATA
        localStorage.setItem("credit", data.credits);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load credits");
    }
  };

  // ============================
  // IMAGE GENERATION
  // ============================
  const generateImage = async (prompt) => {
    if (!token) {
      toast.error("Please login first");
      return null;
    }

    if (credit <= 0) {
      toast.error("You have exhausted your credits");
      navigate("/buy");
      return null;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/image/generate-image`,
        { prompt },
        {
          headers: { token },
        }
      );

      if (data.success) {
        await loadCreditsData(); // 🔥 refresh credits
        return data.imageUrl;
      } else {
        toast.error(data.message || "Image generation failed");
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
    localStorage.removeItem("user");
    localStorage.removeItem("credit");

    setToken(null);
    setUser(null);
    setCredit(0);

    navigate("/");
  };

  // ============================
  // EFFECTS
  // ============================
  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]);

  // ============================
  // CONTEXT VALUE
  // ============================
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
