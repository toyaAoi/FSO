import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Recommendations from "./components/Recomendations";

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("authors");

  useEffect(() => {
    const token = localStorage.getItem("libraryToken");
    if (token) {
      setToken(token);
    }
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.clear();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
        {token ? <button onClick={logout}>logout</button> : null}
      </div>
      <Authors show={page === "authors"} token={token} />
      <Books show={page === "books"} />
      <Login show={page === "login"} setToken={setToken} setPage={setPage} />
      <NewBook show={page === "add"} token={token} setPage={setPage} />
      {token && (
        <Recommendations show={page === "recommend"} token={token} />
      )}{" "}
    </div>
  );
};

export default App;
