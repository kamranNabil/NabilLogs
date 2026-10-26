import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/login`,
        inputs
      );
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-8 bg-white shadow-xl rounded-2xl w-full max-w-md border border-gray-100"
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center">Welcome Back</h1>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        
        <input
          required
          type="email"
          name="email"
          placeholder="Email address"
          onChange={handleChange}
          className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          required
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          disabled={loading}
          className="p-3 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
        
        <p className="text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;