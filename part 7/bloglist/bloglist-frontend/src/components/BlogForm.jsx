import { useRef, useState } from "react";
import Togglable from "./Togglable";
import {
  createNotification,
  useNotificationDispatch,
} from "../reducers/notificationReactReducer";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import blogServices from "../services/blogs";

const BlogForm = () => {
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  const notificationDispatch = useNotificationDispatch();
  const blogFormRef = useRef();

  const queryClient = useQueryClient();
  const createBlogMutation = useMutation({
    mutationFn: blogServices.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(newBlog));

      notificationDispatch(
        createNotification(
          `A new blog ${newBlog.title} by ${newBlog.author} added`,
          "success",
          5
        )
      );
    },
    onError: (error) => {
      notificationDispatch(
        createNotification(error.response.data.error, "error", 5)
      );
    },
  });

  const addNewBlog = (e) => {
    e.preventDefault();

    blogFormRef.current.toggleVisibility();
    createBlogMutation.mutate(newBlog);
    setNewBlog({ title: "", author: "", url: "" });
  };

  return (
    <div>
      <Togglable ref={blogFormRef} buttonLabel={"create new blog"}>
        <h2 className="form-title">create new</h2>
        <form onSubmit={addNewBlog}>
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
              className="form-input"
            />
          </label>
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
              className="form-input"
            />
          </label>
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
              className="form-input"
            />
          </label>
          <br />
          <button type="submit" className="button mb-2">
            create
          </button>
        </form>
      </Togglable>
    </div>
  );
};

export default BlogForm;
