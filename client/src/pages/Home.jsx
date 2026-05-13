import { Link } from "react-router-dom";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-indigo-950 flex items-center justify-center px-6 relative overflow-hidden">

  
      <div className="absolute top-0 left-0 w-96 h-96 bg-fuchsia-500 opacity-20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 opacity-20 blur-3xl rounded-full" />

      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[36px] p-10 shadow-2xl text-center z-10">

        {/* Title */}
        <h1 className="text-5xl font-black text-white mb-4">
          Quizopolis
        </h1>

        {/* Description */}
        <p className="text-purple-200 text- mb-8 leading-relaxed">
          Generate interactive quizzes instantly using AI.  
          Pick a topic, answer questions one by one, and test your knowledge in a
          clean, game-style experience created by Antonio Villani
        </p>

        {/* Logged in or not*/}
        {token ? (
          <div className="space-y-4">
            <p className="text-green-300 font-semibold">
              You are logged in 🎉
            </p>

            <Link to="/quiz">
              <button className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:scale-[1.02] transition-all py-4 rounded-2xl font-bold text-white shadow-xl">
                Start Quiz
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">

            <p className="text-purple-200">
              Get started by creating an account or logging in.
            </p>

            <div className="grid gap-4">

              <Link to="/login">
                <button className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:scale-[1.02] transition-all py-4 rounded-2xl font-bold text-white shadow-xl">
                  Login
                </button>
              </Link>

              <Link to="/signup">
                <button className="w-full bg-white/10 hover:bg-white/20 transition-all py-4 rounded-2xl font-bold text-white border border-white/20">
                  Sign Up
                </button>
              </Link>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Home;