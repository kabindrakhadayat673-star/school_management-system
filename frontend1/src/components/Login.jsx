import React, { useState } from "react";
import Input from "./shared/Input";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/authState";
const Login = () => {
  const navigate = useNavigate();
  const Dispatch = useDispatch();
  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formdata.email || !formdata.password) {
      toast.error("please check your id password");
      return;
    }
    try {
      const res = await fetch("http://localhost:500/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      console.log(data);
      toast.success(`${data.message}`);
      Dispatch(setUser(data?.user));
      if (res.status === 200) {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Something wrong", error);
    }
  };
  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="flex flex-col items-center bg-white p-10 rounded-xl shadow-md w-96">
        {/* Login Heading */}
        <h1 className="text-3xl font-bold mb-6">LOGIN</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-5">
          <label className="flex flex-col text-left">
            Email:
            <Input
              type="text"
              placeholder="Enter the email"
              id="email"
              value={formdata.email}
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col text-left">
            Password:
            <Input
              type="password"
              placeholder="Enter the password"
              id="password"
              value={formdata.password}
              onChange={handleChange}
            />
          </label>

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-lg mt-3"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
