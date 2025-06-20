import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import axios from "axios";
const Login = () => {
  const { setUser, setShowLogin, backendUrl, setToken } =
    useContext(AppContext);
    const [loading,setLoading] = useState(false);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
      if (state === "Login") {
        try {
        
          const { data } = await axios.post(backendUrl + "/api/user/login", {
            email: formData.email,
            password: formData.password,
          });
          console.log(data);
          setShowLogin(false);
          setToken(data.token);
          setUser(data.user);
          toast.success("Welcome back to neuropixel!😁");
          localStorage.setItem("token", data.token);
        } catch (error) {
          console.log(error.message);
          toast.error(error.message);
        }
      } else {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/register",
            formData
          );
          console.log(data);
          setShowLogin(false);
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          toast.success("Welcome to neuropixel!😁");
        } catch (error) {
          console.log(error.message);
          toast.error(error.message);
        }
      }
    } catch (error) {
        
      console.log(error.message);
      toast.error(error.message);
    }finally{
        setLoading(false);
    }
  };
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <motion.form
        onSubmit={onSubmitHandler}
        initial={{ opacity: 0.8, y: 100 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          {state}
        </h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>
        {state !== "Login" && (
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
            <i className="fa-solid fa-user"></i>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  [e.target.name]: e.target.value,
                }))
              }
              name="name"
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
            value={formData.email}
            onChange={(e) =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                [e.target.name]: e.target.value,
              }))
            }
            name="email"
            type="email"
            className="outline-none text-sm"
            placeholder="Email Id"
            required
          />
        </div>
        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.lock_icon} alt="" />
          <input
            value={formData.password}
            onChange={(e) =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                [e.target.name]: e.target.value,
              }))
            }
            name="password"
            type="password"
            className="outline-none text-sm"
            placeholder="Password"
            required
          />
        </div>
        {state === "Login" ? (
          <p className="text-sm text-blue-600 my-4 cursor-pointer">
            Forgot password?
          </p>
        ) : (
          <div className="h-6"></div>
        )}
        <button
          disabled={loading}
          className={`w-full py-2 rounded-full text-white flex items-center justify-center gap-2 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:cursor-pointer"
          }`}
        >
          {state === "Login" ? "login" : "create account"}
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 01-8 8z"
              ></path>
            </svg>
          )}
        </button>
        {state === "Login" ? (
          <p className="mt-5 text-center" onClick={() => setState("Sign Up")}>
            Don't have an account?
            <span className="text-blue-600 cursor-pointer">Sign Up</span>
          </p>
        ) : (
          <p className="mt-5 text-center" onClick={() => setState("Login")}>
            Already have an account?
            <span className="text-blue-600 cursor-pointer">Login</span>
          </p>
        )}
        <img
          src={assets.cross_icon}
          alt=""
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => setShowLogin(false)}
        />
      </motion.form>
    </div>
  );
};

export default Login;
