import PropTypes from "prop-types";
import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  const addBlog = (e) => {
    e.preventDefault();
    createBlog(newBlog);
    setNewBlog({ title: "", author: "", url: "" });
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <label>
          title:
          <input
            type="text"
            name="title"
            placeholder="enter blog title"
            value={newBlog.title}
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, title: target.value })
            }
          />
        </label>
        <br />
        <label>
          author:
          <input
            type="text"
            name="author"
            placeholder="enter author name"
            value={newBlog.author}
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, author: target.value })
            }
          />
        </label>
        <br />
        <label>
          url:
          <input
            type="text"
            name="url"
            placeholder="enter url"
            value={newBlog.url}
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, url: target.value })
            }
          />
        </label>
        <br />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
