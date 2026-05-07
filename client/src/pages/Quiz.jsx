import { useState } from "react";

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

// Main Component

export default function Quiz() {
  const [topic, setTopic] = useState("");
  const [quizData, setQuizData] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const generateQuiz = async () => {
    setLoading(true);
    setFinished(false);
    setShowLeaderboard(false);
    setScore(0);
    setIndex(0);

    const res = await fetch("http://localhost:5000/api/ai/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();
    setQuizData(parseQuiz(data.quiz));

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
      setShowLeaderboard(true);
    } else {
      setIndex(next);
    }
  };

  /* fake leaderboard */
  const leaderboard = [
    { name: "You", score },
    { name: "AI Bot", score: Math.max(score - 1, 0) },
    { name: "Player 2", score: Math.max(score - 2, 0) },
    { name: "Pro Gamer", score: quizData.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-800 to-indigo-900 text-white flex flex-col items-center p-6">

      {/* header */}
      <h1 className="text-5xl font-extrabold mb-2">Quiz Battle</h1>
      <p className="text-purple-200 mb-6">AI Quiz Game</p>

      {/* input */}
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20">
        <input
          className="w-full p-4 rounded-2xl bg-white/20 placeholder-purple-200"
          placeholder="Enter topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <button
          onClick={generateQuiz}
          className="mt-4 w-full bg-purple-500 hover:bg-purple-400 py-3 rounded-2xl font-bold"
        >
          {loading ? "Generating..." : "Start Quiz"}
        </button>
      </div>

      {/* game */}
      {quizData.length > 0 && !finished && (
        <div className="mt-10 w-full max-w-2xl">
          <div className="text-center mb-4">
            <p>Score: {score}</p>
            <p>Question {index + 1} / {quizData.length}</p>
          </div>

          <div className="bg-white/10 p-6 rounded-3xl border border-white/20">
            <h2 className="text-xl font-bold mb-6">
              {quizData[index].question}
            </h2>

            <div className="grid gap-3">
              {quizData[index].options.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleAnswer(opt.key)}
                  className="bg-purple-600 hover:bg-purple-500 p-4 rounded-2xl text-left font-bold"
                >
                  {opt.key}. {opt.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* leaderboard */}
      {showLeaderboard && (
        <div className="mt-10 w-full max-w-xl bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20">
          <h2 className="text-3xl font-bold text-center mb-6">
            🏆 Leaderboard
          </h2>

          <div className="space-y-3">
            {leaderboard
              .sort((a, b) => b.score - a.score)
              .map((player, i) => (
                <div
                  key={i}
                  className="flex justify-between bg-purple-600/40 p-4 rounded-2xl"
                >
                  <span>{i + 1}. {player.name}</span>
                  <span className="font-bold">{player.score}</span>
                </div>
              ))}
          </div>

          <button
            onClick={() => {
              setQuizData([]);
              setTopic("");
              setFinished(false);
              setShowLeaderboard(false);
              setIndex(0);
              setScore(0);
            }}
            className="mt-6 w-full bg-purple-500 hover:bg-purple-400 py-3 rounded-2xl font-bold"
          >
            Play Again
          </button>
        </div>
      )}

    </div>
  );
}