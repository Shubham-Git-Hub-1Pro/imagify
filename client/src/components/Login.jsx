// client/src/components/Login.jsx
import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import api from "../axios"; // axios instance that uses VITE_API_URL
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Login");
  const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // helper to post to backend: prefer backendUrl from context, otherwise use api instance
  const postToBackend = (path, body) => {
    if (backendUrl) {
      // ensure backendUrl doesn't double-up slashes
      const base = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
      const p = path.startsWith("/") ? path : `/${path}`;
      return axios.post(`${base}${p}`, body);
    }
    return api.post(path, body);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (state === "Login") {
        const { data } = await postToBackend("/api/user/login", { email, password });

        if (data?.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          window.scrollTo({ top: 0, behavior: "smooth" });
          setShowLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data?.message || "Login failed");
        }
      } else {
        const { data } = await postToBackend("/api/user/register", { name, email, password });

        if (data?.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          setShowLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data?.message || "Sign up failed");
        }
      }
    } catch (error) {
      const serverData = error?.response?.data;
      const serverMessage = serverData?.message;

      if (serverData?.type === "info") {
        toast.info(serverMessage || "Info");
      } else {
        toast.error(serverMessage || error.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const navbar = document.getElementById("nav-bar");
    if (navbar) navbar.style.opacity = 0.05;
    return () => {
      document.body.style.overflow = "unset";
      if (navbar) navbar.style.opacity = 1;
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999] backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form onSubmit={onSubmitHandler} className="relative bg-white p-10 rounded-xl text-slate-500 shadow-xl">
        <h1 className="text-center text-2xl text-neutral-700 font-medium">{state}</h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>

        {state !== "Login" && (
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
            <img src={assets.user_icon} alt="" />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              className="outline-none text-sm"
              placeholder="Full Name"
              required
            />
          </div>
        )}

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.email_icon} alt="" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className="outline-none text-sm"
            placeholder="Email id"
            required
          />
        </div>

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.lock_icon} alt="" />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className="outline-none text-sm"
            placeholder="Password"
            required
          />
        </div>

        <p className="text-sm text-blue-600 my-4 cursor-pointer">Forgot password?</p>

        <button disabled={loading} className="bg-blue-600 w-full text-white py-2 rounded-full">
          {loading ? (state === "Login" ? "Logging in..." : "Creating...") : state === "Login" ? "Login" : "Create Account"}
        </button>

        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                setState("Sign Up");
              }}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                setState("Login");
              }}
            >
              Login
            </span>
          </p>
        )}

        <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" className="absolute top-5 right-5 cursor-pointer" />
      </form>
    </div>
  );
};

export default Login;


