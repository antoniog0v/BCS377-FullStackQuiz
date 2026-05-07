import { Link } from "react-router-dom";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div>
      <h1>Main App Page</h1>

      {token ? (
        <>
          <p>You are logged in</p>
          <Link to="/quiz">
            <button>Go to Quiz</button>
          </Link>
        </>
      ) : (
        <p>You are NOT logged in</p>
      )}
    </div>
  );
}

export default Home;