import { useState } from "react";

export default function Quiz() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState("");

  const generateQuiz = async () => {
    setLoading(true);
    setQuiz("");

    try {
      const res = await fetch("http://localhost:5000/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      setQuiz(data.quiz);
    } catch (err) {
      setQuiz("Error generating quiz.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Quiz Page</h1>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter topic"
      />

      <button onClick={generateQuiz} disabled={!topic || loading}>
        {loading ? "Loading..." : "Generate"}
      </button>

      <pre>{quiz}</pre>
    </div>
  );
}