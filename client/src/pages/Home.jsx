function Home() {
  const token = localStorage.getItem("token");

  return (
    <div>
      <h1>Main App Page</h1>

      {token ? (
        <p>You are logged in </p>
      ) : (
        <p>You are NOT logged in </p>
      )}
    </div>
  );
}

export default Home;