import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function Signup() {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[\d\W]).{6,}$/;
    if (!form.username || form.username.length > 10)
      return "Username must be 10 characters or less.";
    if (!emailRegex.test(form.email))
      return "Invalid email format.";
    if (!passwordRegex.test(form.password))
      return "Password must contain 1 uppercase letter and 1 number or symbol.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.message) {
        setSuccess("Account created successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Signup failed.");
      }
    } catch (err) {
      setError("Server error.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-indigo-950 flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-fuchsia-500 opacity-20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 opacity-20 blur-3xl rounded-full" />

      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-8 shadow-2xl z-10">
        <h1 className="text-4xl font-black text-white mb-2">Create Account</h1>
        <p className="text-purple-200 mb-6">Join and start generating AI quizzes</p>

        {error && (
          <div className="mb-4 bg-red-500/30 border border-red-500 text-red-100 px-4 py-3 rounded-2xl font-semibold shadow-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-400 text-green-200 p-3 rounded-xl mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-purple-200 text-sm font-semibold pl-1">Username</label>
            <input
              name="username"
              placeholder="Max 10 characters"
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-purple-300 outline-none focus:ring-4 focus:ring-purple-400"
            />
          </div>

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
              placeholder="Min 6 chars, 1 uppercase, 1 number/symbol"
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-purple-300 outline-none focus:ring-4 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 py-4 rounded-2xl font-bold text-white shadow-xl mt-2"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-purple-200 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-300 font-bold hover:text-pink-200">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;