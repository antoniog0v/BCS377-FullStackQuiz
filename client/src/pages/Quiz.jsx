import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Quiz Parser
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
        return {
          key: key.trim(),
          text: rest.join(")").trim(),
        };
      });

    const answerLine = lines.find((l) => l.includes("Answer"));
    const answer = answerLine?.match(/[A-D]/)?.[0];

    questions.push({
      question: questionText,
      options,
      answer,
    });
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

  const generateQuiz = async () => {
    setLoading(true);
    setFinished(false);
    setScore(0);
    setIndex(0);

    try {
      const res = await fetch("http://localhost:5000/api/ai/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      setQuizData(parseQuiz(data.quiz));
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleAnswer = (choice) => {
    const current = quizData[index];

    if (choice === current.answer) {
      setScore((s) => s + 1);
    }

    const next = index + 1;

    if (next >= quizData.length) {
      setFinished(true);
    } else {
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-950 via-violet-900 to-indigo-950 text-white flex flex-col items-center px-6 py-10">

      
      <div className="absolute top-0 left-0 w-96 h-96 bg-fuchsia-500 opacity-20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 opacity-20 blur-3xl rounded-full" />

      {/* TOP NAVigation */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-10 z-10">
        <div>
          <h1 className="text-5xl font-black tracking-tight">
            Quizopolis
          </h1>

          <p className="text-purple-200 mt-1">
            AI-powered Quizzes
          </p>
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

        <h2 className="text-3xl font-bold mb-2">
          Create a Quiz
        </h2>

        <p className="text-purple-200 mb-6">
          Enter any topic and instantly generate a quiz with AI.
        </p>

        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Try: JavaScript, Anime, Space, Biology..."
          className="w-full p-5 rounded-2xl bg-white/10 border border-white/10 placeholder-purple-200 outline-none focus:ring-4 focus:ring-purple-400 text-lg"
        />

        <button
          onClick={generateQuiz}
          disabled={loading || !topic}
          className="mt-5 w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 py-4 rounded-2xl font-bold text-lg shadow-xl disabled:opacity-50"
        >
          {loading ? "Generating Quiz..." : "Start Quiz"}
        </button>
      </div>

      {/* For when quiz is active */}
      {quizData.length > 0 && !finished && (
        <div className="w-full max-w-3xl mt-10 z-10">

          {/* Scoring and progression */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold">
              Score: {score}
            </div>

            <div className="text-purple-200">
              Question {index + 1} / {quizData.length}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Question card */}
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
                  <span className="font-black mr-3 text-pink-200">
                    {opt.key}.
                  </span>

                  <span className="font-semibold text-lg">
                    {opt.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Finished screen */}
      {finished && (
        <div className="mt-10 w-full max-w-2xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-10 text-center shadow-2xl z-10">

          <div className="text-7xl mb-4">🏆</div>

          <h2 className="text-4xl font-black mb-3">
            Quiz Complete
          </h2>

          <p className="text-xl text-purple-200 mb-8">
            You scored
          </p>

          <div className="text-7xl font-black bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent mb-8">
            {score} / {quizData.length}
          </div>

          <button
            onClick={() => {
              setQuizData([]);
              setTopic("");
              setFinished(false);
              setIndex(0);
              setScore(0);
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