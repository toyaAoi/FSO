import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("blogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      const timeout = setTimeout(() => {
        setUser(user);
      }, 0);
      blogService.setToken(user.token);
      return () => clearTimeout(timeout);
    }
  }, [user]);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("blogUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setMessage(["logged in", "success"]);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.log(error);
      setMessage(["wrong username or password", "error"]);
    }

    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("blogUser");
    setUser(null);
  };

  const addLikes = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog.id, {
        ...blog,
        likes: blog.likes + 1,
      });
      setBlogs(blogs.map((b) => (b.id === blog.id ? updatedBlog : b)));
    } catch (error) {
      setMessage([error.message, "error"]);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const addNewBlog = async (newBlog) => {
    try {
      const response = await blogService.create(newBlog);
      noteFormRef.current.toggleVisibility();
      setBlogs(blogs.concat(response));
      setMessage([
        `a new blog ${response.title} by ${response.author} added`,
        "success",
      ]);
    } catch (error) {
      setMessage([error.message, "error"]);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const deleteBlog = async (blog) => {
    if (!confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return;
    }

    try {
      await blogService.remove(blog.id);
      setBlogs(blogs.filter((b) => b.id !== blog.id));
      setMessage([`blog ${blog.title} deleted`, "success"]);
    } catch (error) {
      setMessage([error.response.data.error, "error"]);
      console.log(error);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const loginForm = () => (
    <div>
      <form onSubmit={handleLogin}>
        <label>
          username
          <input
            type="text"
            name="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
        <br />
        <label>
          password
          <input
            type="password"
            name="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
        <br />
        <button type="submit">login</button>
      </form>
    </div>
  );

  const noteFormRef = useRef(null);

  const newBlogForm = () => (
    <Togglable buttonLabel="create new blog" ref={noteFormRef}>
      <BlogForm createBlog={addNewBlog} />
    </Togglable>
  );

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <h1>blogs</h1>
      <Notification message={message} />
      {user ? (
        <div>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          {newBlogForm()}
          {sortedBlogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              addLikes={() => addLikes(blog)}
              deleteBlog={() => deleteBlog(blog)}
            />
          ))}
        </div>
      ) : (
        loginForm()
      )}
    </div>
  );
};

export default App;
