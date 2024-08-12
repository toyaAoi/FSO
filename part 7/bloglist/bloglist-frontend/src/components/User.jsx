import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const User = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <>
      <h1 className="title">{user.name}</h1>
      <ul>
        {user.blogs.map((blog) => (
          <Link to={"/blogs/" + blog.id} key={blog.id} className="blog-link">
            {blog.title}
          </Link>
        ))}
      </ul>
    </>
  );
};

User.propTypes = {
  user: PropTypes.object,
};

export default User;

