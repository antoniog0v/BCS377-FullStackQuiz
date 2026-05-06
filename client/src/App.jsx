import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/test")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Full Stack Test</h1>

      {!data ? (
        <p>Loading backend data...</p>
      ) : (
        <>
          <h2>{data.message}</h2>
          <p>{data.time}</p>
        </>
      )}
    </div>
  );
}

export default App;