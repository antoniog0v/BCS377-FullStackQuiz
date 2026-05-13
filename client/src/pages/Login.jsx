import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function Login() {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/quiz");
      } else {
        setError("Login failed: invalid email or password.");
      }
    } catch (err) {
      setError("Login failed: server error. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-indigo-950 flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-fuchsia-500 opacity-20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 opacity-20 blur-3xl rounded-full" />

      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-8 shadow-2xl z-10">
        <h1 className="text-4xl font-black text-white mb-2">Welcome Back</h1>
        <p className="text-purple-200 mb-6">Login to continue your quiz journey</p>

        {error && (
          <div className="mb-4 bg-red-500/30 border border-red-500 text-red-100 px-4 py-3 rounded-2xl font-semibold shadow-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-purple-200 text-sm font-semibold pl-1">Email</label>
            <input
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-purple-300 outline-none focus:ring-4 focus:ring-purple-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-purple-200 text-sm font-semibold pl-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Your password"
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-purple-300 outline-none focus:ring-4 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:scale-[1.02] transition-all duration-200 py-4 rounded-2xl font-bold text-white shadow-xl mt-2"
          >
            Login
          </button>
        </form>

        <p className="text-center text-purple-200 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-pink-300 hover:text-pink-200 font-bold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;