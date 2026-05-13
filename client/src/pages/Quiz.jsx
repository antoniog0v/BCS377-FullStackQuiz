import { useState } from "react";
import { useNavigate } from "react-router-dom";

function parseQuiz(text) {
  const questions = [];
  const blocks = text.split("Question ").slice(1);

  blocks.forEach((block) => {
    const lines = block.split("\n").filter(Boolean);
    const questionText = lines[0].replace(/\d+:?/, "").trim();

    const options = lines
      .filter((l) => /^[A-D]\)/.test(l))
      .map((l) => {
        const [key, ...rest] = l.split(")");
        return { key: key.trim(), text: rest.join(")").trim() };
      });

    const answerLine = lines.find((l) => l.includes("Answer"));
    const answer = answerLine?.match(/Answer:\**\s*([A-D])/i)?.[1];

    questions.push({ question: questionText, options, answer });
  });

  return questions;
}

export default function Quiz() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [quizData, setQuizData] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetLeaderboard = () => {
    setLeaderboard([]);
    setUserRank(null);
    setTotalPoints(0);
    setSubmitError(null);
  };

  const generateQuiz = async () => {
    setLoading(true);
    setFinished(false);
    setScore(0);
    setIndex(0);
    resetLeaderboard();

    try {
      const res = await fetch("http://localhost:5000/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      setQuizData(parseQuiz(data.quiz));
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleAnswer = async (choice) => {
    const current = quizData[index];
    const isCorrect = choice === current.answer;
    const updatedScore = isCorrect ? score + 1 : score;

    if (isCorrect) setScore(updatedScore);

    const next = index + 1;

    if (next >= quizData.length) {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const token = localStorage.getItem("token");

        const pointsRes = await fetch("http://localhost:5000/api/leaderboard/add-points", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ score: updatedScore }),
        });

        if (!pointsRes.ok) {
          const err = await pointsRes.json();
          throw new Error(err.message || "Failed to save points");
        }

        const pointsData = await pointsRes.json();
        setTotalPoints(pointsData.total_points);

        const lbRes = await fetch("http://localhost:5000/api/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!lbRes.ok) throw new Error("Failed to fetch leaderboard");

        const lbData = await lbRes.json();
        setLeaderboard(lbData);

        const decoded = JSON.parse(atob(token.split(".")[1]));
        const currentUser = lbData.find((p) => p.email === decoded.email);
        if (currentUser) setUserRank(currentUser.rank);

      } catch (err) {
        console.error("Score submission error:", err);
        setSubmitError(err.message);
      } finally {
        setIsSubmitting(false);
      }

      setScore(updatedScore);
      setFinished(true);

    } else {
      setScore(updatedScore);
      setIndex(next);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const progress =
    quizData.length > 0
      ? ((index + (finished ? 1 : 0)) / quizData.length) * 100
      : 0;

  const medalEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-950 via-violet-900 to-indigo-950 text-white flex flex-col items-center px-6 py-10">

      <div className="absolute top-0 left-0 w-96 h-96 bg-fuchsia-500 opacity-20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 opacity-20 blur-3xl rounded-full" />

      {/* Top Nav */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-10 z-10">
        <div>
          <h1 className="text-5xl font-black tracking-tight">Quizopolis</h1>
          <p className="text-purple-200 mt-1">AI-powered Quizzes</p>
        </div>
        <button
          onClick={logout}
          className="bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3 rounded-2xl font-semibold backdrop-blur-xl transition-all duration-200"
        >
          Logout
        </button>
      </div>

      {/* Quiz creation card */}
      <div className="w-full max-w-2xl bg-white/10 border border-white/20 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl z-10">
        <h2 className="text-3xl font-bold mb-2">Create a Quiz</h2>
        <p className="text-purple-200 mb-6">
          Enter any topic and instantly generate a quiz with AI.
        </p>

        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Try: JavaScript, Anime, Space, Biology..."
          className="w-full p-5 rounded-2xl bg-white/10 border border-white/10 placeholder-purple-200 outline-none focus:ring-4 focus:ring-purple-400 text-lg"
        />

        {quizData.length === 0 || finished ? (
          <button
            onClick={generateQuiz}
            disabled={loading || !topic}
            className="mt-5 w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 py-4 rounded-2xl font-bold text-lg shadow-xl disabled:opacity-50"
          >
            {loading ? "Generating Quiz..." : "Start Quiz"}
          </button>
        ) : (
          <button
            onClick={() => {
              setQuizData([]);
              setFinished(false);
              setIndex(0);
              setScore(0);
              resetLeaderboard();
            }}
            className="mt-5 w-full bg-red-500/80 hover:bg-red-500 transition-all duration-200 py-4 rounded-2xl font-bold text-lg shadow-xl"
          >
            Exit Quiz
          </button>
        )}
      </div>

      {/* Active quiz */}
      {quizData.length > 0 && !finished && (
        <div className="w-full max-w-3xl mt-10 z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold">Score: {score}</div>
            <div className="text-purple-200">
              Question {index + 1} / {quizData.length}
            </div>
          </div>

          <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-8 leading-snug">
              {quizData[index].question}
            </h2>
            <div className="grid gap-4">
              {quizData[index].options.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleAnswer(opt.key)}
                  className="group bg-gradient-to-r from-purple-700/70 to-fuchsia-700/60 hover:from-fuchsia-600 hover:to-purple-500 border border-white/10 p-5 rounded-2xl text-left transition-all duration-200 hover:scale-[1.02] shadow-lg"
                >
                  <span className="font-black mr-3 text-pink-200">{opt.key}.</span>
                  <span className="font-semibold text-lg">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Finished screen */}
      {finished && (
        <div className="mt-10 w-full max-w-3xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-10 text-center shadow-2xl z-10">
          <div className="text-7xl mb-4">🏆</div>
          <h2 className="text-4xl font-black mb-3">Quiz Complete</h2>
          <p className="text-xl text-purple-200 mb-8">You scored</p>

          <div className="text-7xl font-black bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent mb-8">
            {score} / {quizData.length}
          </div>

          {/* Rank + points card */}
          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 mb-8">
            {isSubmitting ? (
              <p className="text-purple-200 text-lg animate-pulse">Saving your score...</p>
            ) : submitError ? (
              <p className="text-red-400 text-lg">⚠️ {submitError}</p>
            ) : (
              <div className="flex justify-around items-center">
                <div>
                  <p className="text-purple-300 text-sm font-semibold uppercase tracking-widest mb-1">Global Rank</p>
                  <div className="text-5xl font-black text-pink-300">#{userRank || "-"}</div>
                </div>
                <div className="w-px h-16 bg-white/20" />
                <div>
                  <p className="text-purple-300 text-sm font-semibold uppercase tracking-widest mb-1">Lifetime Points</p>
                  <div className="text-5xl font-black text-white">{totalPoints}</div>
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard */}
          {leaderboard.length > 0 && (
            <div className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-8 shadow-2xl mb-8">
              <h2 className="text-2xl font-black mb-6 text-center tracking-tight">
                Global Leaderboard
              </h2>

              {/* Column headers */}
              <div className="flex justify-between items-center px-4 mb-3">
                <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">Player </span>
                <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">Points</span>
              </div>

              <div className="space-y-2">
                {leaderboard.map((player) => {
                  const isMe = player.rank === userRank;
                  const medal = medalEmoji(player.rank);

                  return (
                    <div
                      key={player.rank}
                      className={`flex justify-between items-center px-4 py-3 rounded-2xl border transition-all ${
                        isMe
                          ? "bg-fuchsia-500/25 border-pink-400/60"
                          : "bg-white/5 border-white/5"
                      }`}
                    >
                      {/* Left: rank + name */}
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm font-black text-purple-400 w-6 shrink-0">
                          {medal ?? `#${player.rank}`}
                        </span>
                        <span className={`font-semibold truncate ${isMe ? "text-pink-200" : "text-white"}`}>
                          {player.username}
                          {isMe && (
                            <span className="ml-2 text-xs font-bold text-pink-400 bg-pink-400/20 px-2 py-0.5 rounded-full">
                              you
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Right: points */}
                      <span className={`font-black text-lg shrink-0 ml-4 ${isMe ? "text-pink-300" : "text-purple-300"}`}>
                        {player.total_points ?? 0}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setQuizData([]);
              setTopic("");
              setFinished(false);
              setIndex(0);
              setScore(0);
              resetLeaderboard();
            }}
            className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:scale-[1.02] transition-all duration-200 py-4 rounded-2xl font-bold text-lg shadow-xl"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}