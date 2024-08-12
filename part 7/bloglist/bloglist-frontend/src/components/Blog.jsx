import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createNotification,
  useNotificationDispatch,
} from "../reducers/notificationReactReducer";
import blogService from "../services/blogs";

const Blog = ({ blog }) => {
  const notificationDispatch = useNotificationDispatch();

  const queryClient = useQueryClient();
  const addLikesMutation = useMutation({
    mutationFn: (blog) =>
      blogService.update({ ...blog, likes: blog.likes + 1 }),
    onSuccess: (blog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((b) => (b.id === blog.id ? blog : b))
      );
    },
    onError: (error) => {
      notificationDispatch(
        createNotification(error.response.data.error, "error", 5)
      );
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: (blog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((b) => (b.id === blog.id ? blog : b))
      );
    },
    onError: (error) => {
      notificationDispatch(
        createNotification(error.response.data.error, "error", 5)
      );
    },
  });

  const handleLikes = (blog) => {
    addLikesMutation.mutate(blog);
  };

  const handleAddComment = (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    addCommentMutation.mutate({ id: blog.id, comment });
    event.target.comment.value = "";
  };

  if (!blog) {
    return null;
  }

  return (
    <div className="blog-container">
      <h1 className="title">{blog.title}</h1>
      <a href="#" className="blog-url">
        {blog.url}
      </a>
      <div className="blog-like">
        likes {blog.likes}{" "}
        <button onClick={() => handleLikes(blog)} className="button">
          like
        </button>
      </div>
      <div className="author blog-author">added by {blog.author}</div>
      <h3 className="comment-title">comments</h3>

      <form onSubmit={handleAddComment}>
        <input type="text" name="comment" className="comment-input" />
        <button type="submit" className="button ml-4">
          add comment
        </button>
      </form>

      <ul>
        {blog.comments.map((comment, i) => (
          <li key={i} className="comment">
            {comment}
          </li>
        ))}
      </ul>
      {/* <button onClick={() => handleDelete(blog)}>remove</button> */}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object,
};

export default Blog;
