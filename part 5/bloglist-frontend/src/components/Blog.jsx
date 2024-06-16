import PropTypes from "prop-types";
import Togglable from "./Togglable";

const Blog = ({ blog, addLikes, deleteBlog }) => (
  <div
    style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}
    className="blog"
  >
    {blog.title}
    <Togglable buttonLabel="view" cancelLabel="hide">
      <div>{blog.url}</div>
      <div>
        likes {blog.likes} <button onClick={addLikes}>like</button>
      </div>
      <div className="author">{blog.author}</div>
      <button onClick={deleteBlog}>remove</button>
    </Togglable>
  </div>
);

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLikes: PropTypes.func,
  deleteBlog: PropTypes.func,
};

export default Blog;
